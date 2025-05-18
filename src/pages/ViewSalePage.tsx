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

  if (!sale) return <p>Carregando...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Visualização de Nota</h1>
      <p><strong>ID:</strong> {sale.id}</p>
      <p><strong>Cliente:</strong> {sale.customerName}</p>
      <p><strong>Valor:</strong> R$ {sale.value.toFixed(2)}</p>
      <p><strong>Data:</strong> {new Date(sale.createdAt).toLocaleString()}</p>

      <div>
        <strong>Assinatura:</strong>
        <div>
          {sale.signatureBase64 ? (
            <img
              src={
                sale.signatureBase64.startsWith('data:image')
                  ? sale.signatureBase64
                  : `data:image/jpeg;base64,${sale.signatureBase64}`
              }
              alt="Assinatura"
              style={{ marginTop: 10, maxWidth: '100%', height: 'auto' }}
            />
          ) : (
            <p style={{ color: 'red' }}>Ainda não assinada</p>
          )}

        </div>
      </div>

      <Link to="/" style={{ marginTop: 20, display: 'inline-block' }}>← Voltar</Link>
    </div>
  );
}
