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
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Nova Venda</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded shadow p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="font-medium">Cliente:</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nome do cliente"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Valor (R$):</label>
          <input
            type="number"
            step="0.01"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Valor da venda"
          />
        </div>
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Salvar
        </button>
      </form>
    </div>
  );
}