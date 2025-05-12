import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ConfigAssinaturaPage() {
  const [metodo, setMetodo] = useState('canvas');
  const navigate = useNavigate();

  const handleSubmit = () => {
    localStorage.setItem('metodoAssinatura', metodo);
    navigate('/'); // ou selecione dinamicamente
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Configurar Método de Assinatura</h1>
      <label>Escolha o método:</label>
      <div>
        <input
          type="radio"
          id="canvas"
          name="metodo"
          value="canvas"
          checked={metodo === 'canvas'}
          onChange={(e) => setMetodo(e.target.value)}
        />
        <label htmlFor="canvas">Canvas (mouse/touch)</label>
      </div>

      <div>
        <input
          type="radio"
          id="topaz"
          name="metodo"
          value="topaz"
          checked={metodo === 'topaz'}
          onChange={(e) => setMetodo(e.target.value)}
        />
        <label htmlFor="topaz">Topaz SigWeb</label>
      </div>

      <div>
        <input
          type="radio"
          id="touchscreen"
          name="metodo"
          value="touchscreen"
          checked={metodo === 'touchscreen'}
          onChange={(e) => setMetodo(e.target.value)}
        />
        <label htmlFor="touchscreen">Touchscreen (Canvas Mobile)</label>
      </div>

      <button onClick={handleSubmit} style={{ marginTop: 20 }}>
        Ir para Assinatura
      </button>
    </div>
  );
}
