import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ConfigAssinaturaPage() {
  const [metodo, setMetodo] = useState('canvas');
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.setItem('metodoAssinatura', metodo);
    navigate('/');
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configurar Método de Assinatura</h1>
      <label className="block mb-2 font-medium">Escolha o método:</label>
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            id="canvas"
            name="metodo"
            value="canvas"
            checked={metodo === 'canvas'}
            onChange={(e) => setMetodo(e.target.value)}
            className="accent-blue-600"
          />
          <span>Canvas (mouse/touch)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            id="topazextlite"
            name="metodo"
            value="topazextlite"
            checked={metodo === 'topazextlite'}
            onChange={(e) => setMetodo(e.target.value)}
            className="accent-blue-600"
          />
          <span>Topaz ExtLite (Extensão Chrome)</span>
        </label>
      </div>
      <button
        onClick={handleSubmit}
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
      >
        Ir para Assinatura
      </button>
    </div>
  );
}