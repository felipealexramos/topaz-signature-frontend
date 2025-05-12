import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SalesListPage } from './pages/SalesListPage';
import { SignPage } from './pages/SignPage';
import { CreateSalePage } from './pages/CreateSalePage';
import { ViewSalePage } from './pages/ViewSalePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SalesListPage />} />
        <Route path="/sign/:id" element={<SignPage />} />
        <Route path="/create" element={<CreateSalePage />} />
        <Route path="/view/:id" element={<ViewSalePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
