import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { CanvasSignatureAdapter, TopazSignatureAdapter, SignatureComponent } from '@felipealexandre/signature-lib';


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

    if (metodo === 'canvas' || metodo === 'touchscreen') {
      setAdapter(new CanvasSignatureAdapter());
    } else if (metodo === 'topaz') {
      setAdapter(new TopazSignatureAdapter());
    }
  }, [id]);

  const handleSign = (base64: string) => {
    if (!sale) return;
    api.post(`/sales/${sale.id}/signature`, { signatureBase64: base64 }).then(() => {
      alert('Assinatura salva com sucesso!');
    });
  };

  if (!sale || !adapter) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Assinatura de Nota Fiscal</h1>
      <p><strong>Cliente:</strong> {sale.customerName}</p>
      <p><strong>Valor:</strong> R$ {sale.value.toFixed(2)}</p>

      <SignatureComponent adapter={adapter} onCapture={handleSign} />

      {sale.signatureBase64 && (
        <div style={{ marginTop: 20 }}>
          <h3>Assinatura existente:</h3>
          <img src={sale.signatureBase64} alt="Assinatura" />
        </div>
      )}
    </div>
  );
}