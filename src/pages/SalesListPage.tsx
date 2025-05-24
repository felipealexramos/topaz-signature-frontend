import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Link, useNavigate } from "react-router-dom";

interface Sale {
  id: number;
  customerName: string;
  value: number;
  signatureBase64: string | null;
  createdAt: string;
}

export function SalesListPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/sales").then((res) => setSales(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Notas Fiscais</h1>
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/config-signature"
          className="px-4 py-2 border border-blue-600 rounded text-blue-600 hover:bg-blue-50 transition"
        >
          Configurar Método de Assinatura
        </Link>
        <button
          onClick={() => navigate("/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
        >
          Nova Venda
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b text-center">ID</th>
              <th className="px-4 py-2 border-b text-center">Cliente</th>
              <th className="px-4 py-2 border-b text-center">Valor</th>
              <th className="px-4 py-2 border-b text-center">Data</th>
              <th className="px-4 py-2 border-b text-center">Status</th>
              <th className="px-4 py-2 border-b text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b text-center">{sale.id}</td>
                <td className="px-4 py-2 border-b text-center">{sale.customerName}</td>
                <td className="px-4 py-2 border-b text-center">R$ {sale.value.toFixed(2)}</td>
                <td className="px-4 py-2 border-b text-center">{new Date(sale.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 border-b text-center">
                  {sale.signatureBase64 ? (
                    <span className="text-green-600 font-semibold">Assinado</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Pendente</span>
                  )}
                </td>
                <td className="px-4 py-2 border-b text-center">
                  <button
                    onClick={() => navigate(`/sign/${sale.id}`)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    Assinar
                  </button>
                  <button
                    onClick={() => navigate(`/view/${sale.id}`)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition ml-2"
                  >
                    Visualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}