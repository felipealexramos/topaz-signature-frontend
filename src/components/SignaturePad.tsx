import { useState } from 'react';

interface SignaturePadProps {
  onCapture: (base64: string) => void;
}

// Add TypeScript definition for electronAPI
declare global {
  interface Window {
    electronAPI?: {
      captureSignature: () => Promise<string>;
      finishCapture: () => Promise<string>;
    };
  }
}

function SignaturePad({ onCapture }: SignaturePadProps) {
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Start capture process
      const result = await window.electronAPI?.captureSignature();
      
      if (result === "CAPTURING") {
        // Show UI indicating user should sign now
        setIsCapturing(true);
        
        // Wait for user to sign (you could add a button to finish instead of timeout)
        setTimeout(async () => {
          try {
            const base64 = await window.electronAPI?.finishCapture();
            if (typeof base64 === 'string' && base64.length > 100) { // Basic validation
              setSignature(base64);
              onCapture(base64);
            } else {
              throw new Error("Failed to capture signature properly");
            }
          } catch (finishErr: any) {
            setError(finishErr.message || "Error completing signature");
          } finally {
            setIsCapturing(false);
            setLoading(false);
          }
        }, 10000); // Give 10 seconds to sign - better to use a button
      } else {
        // Error or unexpected result
        setError("Failed to start signature capture");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to capture signature");
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">Captura de Assinatura</h2>
      
      {isCapturing ? (
        <div className="text-center p-4 bg-blue-100 border border-blue-300 rounded mb-4">
          <p className="font-semibold text-blue-800">Por favor, assine no dispositivo Topaz</p>
          <p className="text-sm text-blue-600 mt-1">Concluindo em 10 segundos...</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
            <div className="bg-blue-600 h-2.5 rounded-full animate-progress"></div>
          </div>
        </div>
      ) : (
        <button 
          onClick={handleCapture}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Iniciando...' : 'Capturar Assinatura'}
        </button>
      )}
      
      {error && <div className="mt-4 text-red-500">{error}</div>}
      
      {signature && (
        <div className="mt-4">
          <h3 className="text-base font-medium mb-2">Assinatura Capturada:</h3>
          <img 
            src={`data:image/png;base64,${signature}`} 
            alt="Assinatura" 
            className="border border-gray-300 p-2 max-w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}

export default SignaturePad;