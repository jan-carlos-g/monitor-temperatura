import React, { useEffect, useState } from "react";
import {
  Line
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const API_URL = "https://d8f9bf316cfd.ngrok-free.app/api/dados";

export default function App() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(API_URL, {
          headers: {
            'ngrok-skip-browser-warning': 'true'
          }
        });
        if (!res.ok) throw new Error(`Erro na requisição: ${res.status}`);

        const json = await res.json();
        setDados(json.slice(-20));
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      }
    };


    fetchData();
    const interval = setInterval(fetchData, 5000); // atualiza a cada 5s
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: dados.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: "Temperatura (°C)",
        data: dados.map(d => d.temperatura),
        fill: false,
        borderColor: "#FF6600",
        backgroundColor: "#FF6600",
        tension: 0.3,
      }
    ]
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Monitor de Temperatura Remoto</h1>

      <div style={styles.chartBox}>
        <Line data={chartData} options={{ responsive: true }} />
      </div>

      <div style={styles.tableBox}>
        <h2 style={styles.subtitle}>Histórico de Leituras</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Temperatura (°C)</th>
              <th style={styles.th}>Data e Hora</th>
            </tr>
          </thead>
          <tbody>
            {dados.map((d, i) => (
              <tr key={i} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                <td style={{ ...styles.td, color: "#FF6600", fontWeight: "600" }}>
                  {d.temperatura.toFixed(1)}
                </td>
                <td style={styles.td}>
                  {new Date(d.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 800,
    margin: "30px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    color: "#FF6600",
    fontSize: 28,
    marginBottom: 30,
  },
  chartBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: 40,
  },
  tableBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  subtitle: {
    marginBottom: 15,
    color: "#333",
    fontSize: 20,
    fontWeight: "600",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    padding: "8px 12px",
    color: "#666",
  },
  td: {
    padding: "8px 12px",
    color: "#555",
  },
  trEven: {
    backgroundColor: "#f9f9f9",
  },
  trOdd: {
    backgroundColor: "#fff",
  },
};
