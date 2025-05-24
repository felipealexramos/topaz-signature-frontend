import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';

interface Sale {
  id: number;
  customerName: string;
  value: number;
  createdAt: string;
  signatureBase64: string | null;
}

export function ViewSalePage() {
  const { id } = useParams();
  const [sale, setSale] = useState<Sale | null>(null);

  useEffect(() => {
    api.get(`/sales/${id}`).then((res) => setSale(res.data));
  }, [id]);

  if (!sale)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="text-gray-500 text-lg">Carregando...</span>
      </div>
    );

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Visualização de Nota</h1>
      <div className="mb-4 space-y-1">
        <p>
          <span className="font-semibold">ID:</span> {sale.id}
        </p>
        <p>
          <span className="font-semibold">Cliente:</span> {sale.customerName}
        </p>
        <p>
          <span className="font-semibold">Valor:</span> R$ {sale.value.toFixed(2)}
        </p>
        <p>
          <span className="font-semibold">Data:</span> {new Date(sale.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="mb-6">
        <span className="font-semibold">Assinatura:</span>
        <div>
          {sale.signatureBase64 ? (
            <img
              src={
                sale.signatureBase64.startsWith('data:image')
                  ? sale.signatureBase64
                  : `data:image/jpeg;base64,${sale.signatureBase64}`
              }
              alt="Assinatura"
              className="mt-2 max-w-full h-auto border rounded"
            />
          ) : (
            <p className="text-red-600 mt-2">Ainda não assinada</p>
          )}
        </div>
      </div>

      <Link
        to="/"
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        ← Voltar
      </Link>
    </div>
  );
}