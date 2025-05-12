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
    <div style={{ padding: "20px" }}>
      <h1>Notas Fiscais</h1>
      <div style={{ display: "flex", alignItems: "center", alignContent: "center", gap: 10 }}>
        <Link
          to="/config-signature"
          style={{
            marginBottom: 20,
            textDecoration: "none",
            color: "blue",
            padding: 10,
            border: "1px solid blue",
            borderRadius: 5,
          }}
        >
          Configurar Método de Assinatura
        </Link>
        <button
          onClick={() => navigate("/create")}
          style={{ marginBottom: 20 }}
        >
          Nova Venda
        </button>
      </div>
      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Status</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id}>
              <td>{sale.id}</td>
              <td>{sale.customerName}</td>
              <td>R$ {sale.value.toFixed(2)}</td>
              <td>{new Date(sale.createdAt).toLocaleString()}</td>
              <td>
                {sale.signatureBase64 ? (
                  <span style={{ color: "green" }}>Assinado</span>
                ) : (
                  <span style={{ color: "red" }}>Pendente</span>
                )}
              </td>
              <td>
                <button onClick={() => navigate(`/sign/${sale.id}`)}>
                  Assinar
                </button>
                <button
                  onClick={() => navigate(`/view/${sale.id}`)}
                  style={{ marginLeft: 10 }}
                >
                  Visualizar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
