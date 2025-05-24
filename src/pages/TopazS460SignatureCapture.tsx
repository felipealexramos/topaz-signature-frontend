import { useEffect, useState } from 'react';

export function TopazS460SignatureCapture() {
  const [isReady, setIsReady] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);

  useEffect(() => {
    const isInstalled = document.documentElement.getAttribute('SigPlusExtLiteExtension-installed');
    if (!isInstalled) {
      alert('A extensão SigPlusExtLite não está instalada ou está desativada.');
      return;
    }

    // Listener para a resposta da assinatura
    const handleSignResponse = (event: any) => {
      const str = event.target.getAttribute("msgAttribute") || event.target.getAttribute("msg-Attribute");
      const response = JSON.parse(str);

      if (response?.isSigned) {
        setSignatureData(response.imgData);
      } else {
        alert(`Assinatura não capturada: ${response.errorMsg || 'Usuário cancelou ou erro desconhecido.'}`);
      }
    };

    top?.document.addEventListener('SignResponse', handleSignResponse, false);
    setIsReady(true);

    return () => {
      top?.document.removeEventListener('SignResponse', handleSignResponse, false);
    };
  }, []);

  const startCapture = () => {
    const message = {
      metadata: { version: 1.0, command: 'SignatureCapture' },
      imageFormat: 2,
      imageX: 300,
      imageY: 100,
      imageTransparency: true,
      imageScaling: false,
      maxUpScalePercent: 0,
      rawDataFormat: 'ENC',
      minSigPoints: 25,
      penThickness: '2',
      penColor: '#000000',
      encryptionMode: '0',
      encryptionKey: '',
      sigCompressionMode: 1,
      customWindow: false
    };

    const messageData = JSON.stringify(message);
    const element = document.createElement("MyExtensionDataElement");
    element.setAttribute("messageAttribute", messageData);
    document.documentElement.appendChild(element);

    const evt = document.createEvent("Events");
    evt.initEvent("SignStartEvent", true, false);
    element.dispatchEvent(evt);
  };

  return (
    <div className='flex flex-col items-center gap-4 p-4 max-w-xl mx-auto'>
      <h2 className='text-xl font-bold'>Captura de Assinatura - Topaz S460</h2>
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50'
        onClick={startCapture}
        disabled={!isReady}
      >
        Iniciar Assinatura
      </button>

      {signatureData && (
        <div className='flex flex-col items-center mt-4 w-full'>
          <h3 className='mb-2 font-semibold'>Assinatura Capturada:</h3>
          <img
            src={`data:image/png;base64,${signatureData}`}
            alt="Assinatura"
            className='border border-gray-300 rounded-md'
          />
          <textarea
            className='mt-4 w-full h-40 p-2 border rounded text-sm'
            value={signatureData}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
