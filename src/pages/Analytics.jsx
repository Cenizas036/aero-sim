import React from 'react';
import { useSimulationStore } from '../store/SimulationStore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Analytics() {
  const { history } = useSimulationStore();

  const chartData = {
    labels: history.map((_, i) => `T-${history.length - i}`),
    datasets: [
      {
        label: 'Structural Stress %',
        data: history.map(h => parseFloat(h.stress)),
        borderColor: '#00e5ff',
        backgroundColor: 'rgba(0, 229, 255, 0.1)',
        tension: 0.4
      },
      {
        label: 'Risk Factor',
        data: history.map(h => parseFloat(h.risk)),
        borderColor: '#ff3333',
        backgroundColor: 'rgba(255, 51, 51, 0.1)',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' } },
      x: { grid: { color: 'rgba(255,255,255,0.05)' } }
    },
    plugins: {
      legend: { labels: { color: '#6b7280' } }
    }
  };

  return (
    <div className="page-content">
      <h2 className="page-title">SIMULATION ANALYTICS</h2>
      
      <div className="chart-container">
        {history.length > 0 ? (
          <Line data={chartData} options={options} />
        ) : (
          <div style={{color: '#6b7280', textAlign: 'center', marginTop: '100px'}}>NO DATA LOGGED YET. RUN SIMULATION.</div>
        )}
      </div>

      <div className="panel" style={{width: '100%', maxWidth: 'none'}}>
        <div className="panel-header">
          <h2>HISTORICAL LOGS</h2>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>TIMESTAMP</th>
              <th>MACH</th>
              <th>DENSITY</th>
              <th>STRESS</th>
              <th>G-FORCE</th>
              <th>RISK</th>
            </tr>
          </thead>
          <tbody>
            {[...history].reverse().map((entry, i) => (
              <tr key={i}>
                <td>{new Date(entry.timestamp).toLocaleTimeString()}</td>
                <td>{entry.mach}</td>
                <td>{entry.density}</td>
                <td>{entry.stress}%</td>
                <td>{entry.gforce}</td>
                <td>{entry.risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
