import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SalesListPage } from './pages/SalesListPage';
import { SignPage } from './pages/SignPage';
import { CreateSalePage } from './pages/CreateSalePage';
import { ViewSalePage } from './pages/ViewSalePage';
import { ConfigAssinaturaPage } from './pages/ConfigAssinaturePage';
import { TopazSignatureCapture } from './pages/TopazSignaturePage';
import { TopazS460SignatureCapture } from './pages/TopazS460SignatureCapture';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SalesListPage />} />
        <Route path="/sign/:id" element={<SignPage />} />
        <Route path="/create" element={<CreateSalePage />} />
        <Route path="/view/:id" element={<ViewSalePage />} />
        <Route path="/config-signature" element={<ConfigAssinaturaPage />} /> {/* Nova rota */}
        <Route path="/topaz" element={<TopazSignatureCapture />} />
        <Route path="/topazs460" element={<TopazS460SignatureCapture />} />
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;