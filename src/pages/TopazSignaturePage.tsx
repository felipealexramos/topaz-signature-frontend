import { useEffect, useState } from 'react';

export const TopazSignatureCapture = () => {
  const [isReady, setIsReady] = useState(false);
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const [signatureString, setSignatureString] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Aguarda carregamento do wrapper
  const waitForTopaz = async (timeout = 3000): Promise<void> => {
    const interval = 100;
    let waited = 0;

    while (!(window as any).Topaz) {
      if (waited >= timeout) throw new Error('Topaz Wrapper não carregado.');
      await new Promise((r) => setTimeout(r, interval));
      waited += interval;
    }
  };

  // Carrega o script da extensão
  useEffect(() => {
    const loadWrapper = () => {
      const wrapperURL = document.documentElement.getAttribute('SigPlusExtLiteWrapperURL');
      if (wrapperURL) {
        const script = document.createElement('script');
        script.src = wrapperURL;
        script.async = true;
        script.onload = () => setIsReady(true);
        script.onerror = () => setError('Erro ao carregar SigPlusExtLiteWrapper.js');
        document.body.appendChild(script);

        return () => document.body.removeChild(script);
      } else {
        setError('Atributo SigPlusExtLiteWrapperURL não encontrado.');
      }
    };

    loadWrapper();
  }, []);

  // Inicia assinatura
  const handleSign = async () => {
    setError(null);
    setSignatureImage(null);
    setSignatureString(null);

    try {
      await waitForTopaz();

      const Topaz = (window as any).Topaz;
      const global = Topaz.Global;
      const deviceStatus = await global.GetDeviceStatus();
      if (deviceStatus !== 2) throw new Error('Dispositivo GemView não detectado.');

      const gemView = Topaz.GemView;
      const signWindow = Topaz.SignatureCaptureWindow.Sign;
      const customWindow = Topaz.SignatureCaptureWindow.CustomWindow;

      // Envia a aba atual para o GemView
      await gemView.PushCurrentTab();

      // Customiza janela
      await customWindow.SetSigningWindowTitle('Assinatura da Nota Fiscal');
      await customWindow.SetSigningWindowSize(800, 400);
      await customWindow.Save();

      // Inicia assinatura
      await signWindow.StartSign(false, 1, 0, ''); // defaultWindow, compressão lossless, clear text

      // Aguarda usuário assinar (você pode colocar um botão de "Finalizar" se quiser)
      await new Promise((r) => setTimeout(r, 5000)); // simula tempo de assinatura

      const image = await signWindow.GetSignatureImage();
      const sigStr = await signWindow.GetSigString();

      await signWindow.SignComplete();
      await gemView.RevertCurrentTab(1); // retorna para tela principal

      setSignatureImage(image);
      setSignatureString(sigStr);
    } catch (err: any) {
      setError(err.message || 'Erro desconhecido');
    }
  };

  return (
    <div>
      <h2>Captura de Assinatura com Topaz</h2>

      {!isReady && <p>Carregando wrapper da extensão...</p>}
      {error && <p style={{ color: 'red' }}>Erro: {error}</p>}

      <button onClick={handleSign} disabled={!isReady}>
        Iniciar Assinatura
      </button>

      {signatureImage && (
        <div>
          <h4>Assinatura capturada:</h4>
          <img src={`data:image/jpeg;base64,${signatureImage}`} alt="Assinatura" />
          <p>
            <strong>SigString:</strong> <br />
            <textarea readOnly rows={4} cols={80} value={signatureString ?? ''} />
          </p>
        </div>
      )}
    </div>
  );
};
