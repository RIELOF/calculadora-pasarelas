import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const clp = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);

export default function GraficoBarras({ resultados }) {
  const colores = resultados.map((_, i) => {
    if (i === 0) return 'rgba(22, 163, 74, 0.85)';
    if (i === resultados.length - 1) return 'rgba(220, 38, 38, 0.85)';
    return 'rgba(59, 130, 246, 0.75)';
  });

  const data = {
    labels: resultados.map((r) => r.pasarela),
    datasets: [
      {
        label: 'Comisión',
        data: resultados.map((r) => r.comision),
        backgroundColor: colores,
        borderColor: colores.map((c) => c.replace(/[\d.]+\)$/, '1)')),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Comisión por pasarela (menor es mejor)',
        font: { size: 13, weight: '700' },
        color: '#374151',
        padding: { bottom: 16 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `  Comisión: ${clp(ctx.raw)}`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (val) => clp(val),
          font: { size: 11 },
        },
        grid: { color: '#f3f4f6' },
      },
      x: {
        ticks: { font: { size: 11 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="card">
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
