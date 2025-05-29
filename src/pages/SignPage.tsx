import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import SignaturePad from '../components/SignaturePad';

interface Sale {
  id: number;
  customerName: string;
  value: number;
  signatureBase64?: string;
}

export function SignPage() {
  const { id } = useParams();
  const [sale, setSale] = useState<Sale | null>(null);
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    // Load sale data
    if (id) {
      api.get(`/sales/${id}`).then((res) => setSale(res.data));
    }
    
    // Check if we're running in Electron
    setIsElectron(!!window.electronAPI);
  }, [id]);

  const handleSign = (base64: string) => {
    if (!sale) return;
    
    api.post(`/sales/${sale.id}/signature`, { signatureBase64: base64 })
      .then(() => {
        alert('Assinatura salva com sucesso!');
        // Update local sale object with the new signature
        setSale(prev => prev ? {...prev, signatureBase64: base64} : null);
      })
      .catch(error => {
        console.error('Error saving signature:', error);
        alert('Erro ao salvar assinatura');
      });
  };

  if (!sale) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="text-gray-500 text-lg">Carregando...</span>
      </div>
    );
  }

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

      {isElectron ? (
        <div className="mb-6">
          <SignaturePad onCapture={handleSign} />
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-300 rounded mb-6">
          <p className="text-yellow-700">
            Para usar a mesa de assinatura Topaz, abra este aplicativo na versão desktop.
          </p>
        </div>
      )}

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
      
      <div className="mt-6">
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}