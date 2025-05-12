import { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export function CreateSalePage() {
  const [customerName, setCustomerName] = useState('');
  const [value, setValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !value) {
      alert('Preencha todos os campos');
      return;
    }

    try {
      await api.post('/sales', {
        customerName,
        value: parseFloat(value),
      });
      alert('Venda criada com sucesso!');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Erro ao criar venda');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Nova Venda</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Cliente:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        <div>
          <label>Valor (R$):</label>
          <input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button type="submit" style={{ marginTop: 10 }}>
          Salvar
        </button>
      </form>
    </div>
  );
}
