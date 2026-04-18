import React from 'react';
import { useSimulationStore } from '../store/SimulationStore';
import { useNavigate } from 'react-router-dom';

export default function Scenarios() {
  const { applyScenario } = useSimulationStore();
  const navigate = useNavigate();

  const scenarios = [
    {
      id: 'SCN-01',
      title: 'Standard Cruise',
      desc: 'Optimal high-altitude conditions. Minimum stress, optimal fuel burn.',
      tags: ['Clear Skies', '35000ft'],
      payload: { windSpeed: 20, temperature: -50, turbulence: 5, precipitation: 0 }
    },
    {
      id: 'SCN-02',
      title: 'North Atlantic Winter Storm',
      desc: 'Extreme headwinds and severe icing conditions. High risk.',
      tags: ['Severe Icing', 'High Wind'],
      payload: { windSpeed: 140, temperature: -15, turbulence: 85, precipitation: 90 }
    },
    {
      id: 'SCN-03',
      title: 'Equatorial Thunderstorm',
      desc: 'Violent updrafts and heavy precipitation. Maximum structural stress.',
      tags: ['Turbulence', 'Heavy Rain'],
      payload: { windSpeed: 60, temperature: 10, turbulence: 100, precipitation: 100 }
    }
  ];

  const handleSelect = (payload) => {
    applyScenario(payload);
    navigate('/');
  };

  return (
    <div className="page-content">
      <h2 className="page-title">PRE-CONFIGURED SCENARIOS</h2>
      <div className="scenario-grid">
        {scenarios.map(sc => (
          <div key={sc.id} className="scenario-card" onClick={() => handleSelect(sc.payload)}>
            <div className="panel-header" style={{padding: '0 0 1rem 0', border: 'none'}}>
              <h3>{sc.title}</h3>
              <span className="header-id">{sc.id}</span>
            </div>
            <p>{sc.desc}</p>
            <div className="tags">
              {sc.tags.map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
