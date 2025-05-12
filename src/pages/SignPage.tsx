import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { SignaturePad } from '../components/SignaturePad';
import { useParams } from 'react-router-dom';

interface Sale {
  id: number;
  customerName: string;
  value: number;
  signatureBase64?: string;
}

export function SignPage() {
  const [sale, setSale] = useState<Sale | null>(null);

const { id } = useParams();
useEffect(() => {
  api.get(`/sales/${id}`).then((res) => setSale(res.data));
}, [id]);

  const handleSign = (base64: string) => {
    api.post(`/sales/${sale!.id}/signature`, { signatureBase64: base64 }).then(() => {
      alert('Assinatura salva com sucesso!');
    });
  };

  if (!sale) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Assinatura de Nota Fiscal</h1>
      <p><strong>Cliente:</strong> {sale.customerName}</p>
      <p><strong>Valor:</strong> R$ {sale.value.toFixed(2)}</p>

      <SignaturePad onSignComplete={handleSign} />

      {sale.signatureBase64 && (
        <div style={{ marginTop: 20 }}>
          <h3>Assinatura existente:</h3>
          <img src={sale.signatureBase64} alt="Assinatura" />
        </div>
      )}
    </div>
  );
}
