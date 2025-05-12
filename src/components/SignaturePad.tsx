import { useRef } from 'react';

interface Props {
  onSignComplete: (base64: string) => void;
}

export function SignaturePad({ onSignComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const clear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const save = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const base64 = canvas.toDataURL();
      onSignComplete(base64);
    }
  };

  const startDraw = (e: React.MouseEvent) => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    canvas.onmousemove = (ev) => {
      ctx.lineTo(ev.offsetX, ev.offsetY);
      ctx.stroke();
    };
  };

  const endDraw = () => {
    const canvas = canvasRef.current!;
    canvas.onmousemove = null;
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        style={{ border: '1px solid black', background: '#fff' }}
        onMouseDown={startDraw}
        onMouseUp={endDraw}
      />
      <div style={{ marginTop: '10px' }}>
        <button onClick={clear}>Limpar</button>
        <button onClick={save} style={{ marginLeft: '10px' }}>Salvar Assinatura</button>
      </div>
    </div>
  );
}
