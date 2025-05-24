import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { SignatureComponent } from '@felipealexandre/signature-lib';
import { getAdapterByMetodo } from '../config/signatureMethods';

interface Sale {
  id: number;
  customerName: string;
  value: number;
  signatureBase64?: string;
}

export function SignPage() {
  const { id } = useParams();
  const [sale, setSale] = useState<Sale | null>(null);
  const [adapter, setAdapter] = useState<any>(null);

  useEffect(() => {
    api.get(`/sales/${id}`).then((res) => setSale(res.data));

    const metodo = localStorage.getItem('metodoAssinatura') || 'canvas';

    const tryLoad = async () => {
      if (metodo === 'topaz') {
        // espera carregar o script sigweb
        while (typeof window.SetTabletState !== 'function') {
          console.log('Aguardando SigWebTablet...');
          await new Promise((res) => setTimeout(res, 200));
        }
      }

      const adapter = getAdapterByMetodo(metodo);
      setAdapter(adapter);
    };

    tryLoad();
  }, [id]);

  const handleSign = (base64: string) => {
    if (!sale) return;
    api.post(`/sales/${sale.id}/signature`, { signatureBase64: base64 }).then(() => {
      alert('Assinatura salva com sucesso!');
    });
  };

  if (!sale || !adapter)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="text-gray-500 text-lg">Carregando...</span>
      </div>
    );

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Assinatura de Nota Fiscal</h1>
      <div className="mb-4">
        <p>
          <span className="font-semibold">Cliente:</span> {sale.customerName}
        </p>
        <p>
          <span className="font-semibold">Valor:</span> R$ {sale.value.toFixed(2)}
        </p>
      </div>

      <div className="mb-6">
        <SignatureComponent adapter={adapter} onCapture={handleSign} />
      </div>

      {sale.signatureBase64 && (
        <div className="mt-8 bg-gray-50 rounded p-4 border">
          <h3 className="font-semibold mb-2">Assinatura existente:</h3>
          <img
            src={
              sale.signatureBase64.startsWith('data:image')
                ? sale.signatureBase64
                : `data:image/jpeg;base64,${sale.signatureBase64}`
            }
            alt="Assinatura"
            className="mt-2 max-w-full h-auto border rounded"
          />
        </div>
      )}
    </div>
  );
}