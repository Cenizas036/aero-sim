import React, { useEffect, useRef } from 'react';
import { useSimulationStore } from '../store/SimulationStore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const canvasRef = useRef(null);
  
  const { 
    windSpeed, temperature, turbulence, precipitation, history,
    setControls, logHistory 
  } = useSimulationStore();

  const colors = {
    safe: '#00ff66', warning: '#ffb700', danger: '#ff3333',
    optimal: '#00e5ff', hud: 'rgba(0, 229, 255, 0.5)'
  };

  const stateRef = useRef({ 
    time: 0, 
    particles: [], 
    airspeed: 450,
    status: 'normal', // normal, breaking, exploding, destroyed
    debris: [],
    explosionRadius: 0
  });

  const resetSimulation = () => {
    setControls({ windSpeed: 0, temperature: -50, turbulence: 0, precipitation: 0 });
    stateRef.current.status = 'normal';
    stateRef.current.debris = [];
    stateRef.current.explosionRadius = 0;
  };

  const initDebris = (type) => {
    stateRef.current.debris = [];
    if (type === 'break') {
      stateRef.current.debris.push({ id: 'fuselage', x: 0, y: 0, vx: 0, vy: 2, rot: 0, vrot: 0.05 });
      stateRef.current.debris.push({ id: 'lwing', x: -20, y: 0, vx: -3, vy: 4, rot: 0, vrot: -0.1 });
      stateRef.current.debris.push({ id: 'rwing', x: 20, y: 0, vx: 3, vy: 5, rot: 0, vrot: 0.08 });
      stateRef.current.debris.push({ id: 'tail', x: 0, y: 40, vx: 1, vy: -1, rot: 0, vrot: 0.2 });
    } else if (type === 'explode') {
      for (let i = 0; i < 30; i++) {
        stateRef.current.debris.push({
          id: 'shard',
          x: 0, y: 0,
          vx: (Math.random() - 0.5) * 15,
          vy: (Math.random() - 0.5) * 15,
          rot: 0, vrot: (Math.random() - 0.5) * 0.5
        });
      }
    }
  };

  // Init particles
  useEffect(() => {
    stateRef.current.particles = [];
    for (let i = 0; i < 200; i++) {
      stateRef.current.particles.push({
        x: Math.random() * 800, y: Math.random() * 600,
        size: Math.random() * 2 + 0.5,
        speedX: Math.random() * 2 - 1, speedY: Math.random() * 2 + 1
      });
    }
  }, []);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let animationId;

    const drawScientificBackground = () => {
      stateRef.current.time += 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      const offsetX = stateRef.current.time % gridSize;

      ctx.beginPath();
      for (let x = -offsetX; x < canvas.width; x += gridSize) {
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      ctx.fillStyle = colors.hud;
      ctx.font = '10px "IBM Plex Mono"';
      for (let y = gridSize; y < canvas.height; y += gridSize * 2) {
        ctx.fillText(`ALT-${35000 + (y - canvas.height/2)}`, 10, y);
      }
    };

    const drawWeather = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      const windFactor = windSpeed / 15;
      const precipDensity = precipitation / 100;
      const numParticles = Math.floor(stateRef.current.particles.length * precipDensity);

      for (let i = 0; i < numParticles; i++) {
        const p = stateRef.current.particles[i];
        ctx.fillRect(p.x, p.y, p.size, p.size * 2);
        
        p.x -= (p.speedX + windFactor);
        p.y += p.speedY;
        
        if (turbulence > 0) {
          p.x += (Math.random() - 0.5) * (turbulence / 5);
          p.y += (Math.random() - 0.5) * (turbulence / 5);
        }
        
        if (p.y > canvas.height) p.y = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      }
    };

    const drawAircraftWireframe = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      ctx.save();
      ctx.translate(centerX, centerY);

      const { status, debris, explosionRadius } = stateRef.current;

      if (status === 'destroyed') {
        ctx.fillStyle = colors.danger;
        ctx.font = '32px "IBM Plex Mono"';
        ctx.textAlign = 'center';
        ctx.fillText("SIGNAL LOST", 0, 0);
        ctx.font = '14px "IBM Plex Mono"';
        ctx.fillText("CATASTROPHIC FAILURE LOGGED", 0, 30);
        ctx.restore();
        return;
      }

      if (status === 'normal') {
        if (turbulence > 0) {
          const turbFactor = turbulence / 15;
          ctx.translate((Math.random() - 0.5) * turbFactor, (Math.random() - 0.5) * turbFactor);
          ctx.rotate((Math.random() - 0.5) * (turbFactor * 0.02));
        }

        ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
        ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(0, 0, 160, 0, Math.PI * 2); ctx.stroke();

        ctx.strokeStyle = colors.hud;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = 'rgba(0, 229, 255, 0.05)';
        
        ctx.beginPath();
        ctx.moveTo(0, -60);
        ctx.lineTo(10, -30); ctx.lineTo(12, 10);
        ctx.lineTo(50, 30); ctx.lineTo(50, 40); ctx.lineTo(12, 35);
        ctx.lineTo(8, 60); ctx.lineTo(25, 75); ctx.lineTo(25, 80); ctx.lineTo(5, 75);
        ctx.lineTo(0, 85);
        ctx.lineTo(-5, 75); ctx.lineTo(-25, 80); ctx.lineTo(-25, 75); ctx.lineTo(-8, 60);
        ctx.lineTo(-12, 35); ctx.lineTo(-50, 40); ctx.lineTo(-50, 30);
        ctx.lineTo(-12, 10); ctx.lineTo(-10, -30);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        const tempPenalty = Math.abs(temperature - (-45));
        let heatColor = colors.optimal;
        if (tempPenalty > 60 || windSpeed > 100) heatColor = colors.danger;
        else if (tempPenalty > 30) heatColor = colors.warning;

        ctx.fillStyle = heatColor;
        ctx.shadowColor = heatColor;
        ctx.shadowBlur = 10;
        ctx.fillRect(-15, 35, 4, 15);
        ctx.fillRect(11, 35, 4, 15);
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.stroke();

      } else {
        // breaking or exploding
        ctx.fillStyle = colors.danger;
        ctx.font = '24px "IBM Plex Mono"';
        ctx.textAlign = 'center';
        ctx.fillText("CRITICAL FAILURE", 0, -120);

        if (status === 'exploding') {
          stateRef.current.explosionRadius += 8;
          const r = stateRef.current.explosionRadius;
          const alpha = Math.max(0, 1 - r/200);
          ctx.fillStyle = `rgba(255, 80, 0, ${alpha})`;
          ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.beginPath(); ctx.arc(0, 0, r*0.5, 0, Math.PI * 2); ctx.fill();
          
          if (r > 250) stateRef.current.status = 'destroyed';
        }

        // Draw falling/spinning debris
        stateRef.current.debris.forEach(d => {
          d.x += d.vx;
          d.y += d.vy;
          d.rot += d.vrot;
          ctx.save();
          ctx.translate(d.x, d.y);
          ctx.rotate(d.rot);
          ctx.strokeStyle = colors.danger;
          ctx.lineWidth = 2;
          ctx.beginPath();
          
          if (d.id === 'fuselage') {
            ctx.moveTo(0, -30); ctx.lineTo(10, 0); ctx.lineTo(-10, 0); ctx.closePath();
          } else if (d.id === 'lwing') {
            ctx.moveTo(0, 0); ctx.lineTo(-40, 10); ctx.lineTo(0, -10); ctx.closePath();
          } else if (d.id === 'rwing') {
            ctx.moveTo(0, 0); ctx.lineTo(40, 10); ctx.lineTo(0, -10); ctx.closePath();
          } else if (d.id === 'tail') {
            ctx.moveTo(0, 10); ctx.lineTo(-15, 20); ctx.lineTo(15, 20); ctx.closePath();
          } else {
            ctx.moveTo(-5, 0); ctx.lineTo(5, 0);
          }
          
          ctx.stroke();
          ctx.restore();
        });

        // if breaking, transition to destroyed after some time
        if (status === 'breaking' && stateRef.current.debris[0].y > 300) {
           stateRef.current.status = 'destroyed';
        }
      }

      ctx.restore();
    };

    const checkFailureConditions = () => {
      if (stateRef.current.status !== 'normal') return;

      const tempKelvin = temperature + 273.15;
      const pressure = 23800; 
      const density = pressure / (287.05 * tempKelvin);
      const currentStress = Math.min(100, (turbulence * 0.8) + (windSpeed * 0.2) + (density > 1.0 ? 10 : 0));
      
      if (temperature >= 30) {
        // Too heated up -> Explode
        stateRef.current.status = 'exploding';
        stateRef.current.explosionRadius = 0;
        initDebris('explode');
      } else if (currentStress >= 100) {
        // Too unstable -> Break apart
        stateRef.current.status = 'breaking';
        initDebris('break');
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawScientificBackground();
      drawWeather();
      checkFailureConditions();
      drawAircraftWireframe();
      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [windSpeed, temperature, turbulence, precipitation]);

  // Telemetry Logging Interval (Faster for live charts: 1s)
  useEffect(() => {
    const interval = setInterval(() => {
      const tempKelvin = temperature + 273.15;
      const speedOfSoundKts = 38.9678 * Math.sqrt(tempKelvin);
      const mach = stateRef.current.airspeed / speedOfSoundKts;
      const pressure = 23800; 
      const density = pressure / (287.05 * tempKelvin);
      const stress = Math.min(100, (turbulence * 0.8) + (windSpeed * 0.2) + (density > 1.0 ? 10 : 0));
      const currentG = 1.0 + ((Math.random() - 0.5) * (turbulence / 25));
      const icingRisk = (temperature > -20 && temperature < 0) ? precipitation : 0;
      const risk = Math.min(100, (stress * 0.5) + (icingRisk * 0.5) + (windSpeed > 100 ? 20 : 0));

      logHistory({
        mach: mach.toFixed(3),
        density: density.toFixed(3),
        stress: stress.toFixed(1),
        gforce: currentG.toFixed(2),
        risk: risk.toFixed(2)
      });
    }, 1000); 

    return () => clearInterval(interval);
  }, [windSpeed, temperature, turbulence, precipitation]);

  // Calculated values for render
  const tempKelvin = temperature + 273.15;
  const speedOfSoundKts = 38.9678 * Math.sqrt(tempKelvin);
  const mach = stateRef.current.airspeed / speedOfSoundKts;
  const pressure = 23800; 
  const density = pressure / (287.05 * tempKelvin);
  const stress = Math.min(100, (turbulence * 0.8) + (windSpeed * 0.2) + (density > 1.0 ? 10 : 0));
  const risk = Math.min(100, (stress * 0.5) + (((temperature > -20 && temperature < 0) ? precipitation : 0) * 0.5) + (windSpeed > 100 ? 20 : 0));

  const stressColor = stress < 30 ? colors.safe : stress < 75 ? colors.warning : colors.danger;
  const riskColor = risk < 20 ? colors.safe : risk < 60 ? colors.warning : colors.danger;

  // Real-time chart configuration
  const recentHistory = history.slice(-20);
  const chartData = {
    labels: recentHistory.map(() => ''),
    datasets: [{
      label: 'Stress %',
      data: recentHistory.map(h => parseFloat(h.stress)),
      borderColor: colors.optimal,
      borderWidth: 2,
      pointRadius: 0,
      tension: 0.4,
      fill: true,
      backgroundColor: 'rgba(0, 229, 255, 0.1)'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 100, display: false },
      x: { display: false }
    },
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    animation: { duration: 0 } // No animation for immediate real-time feel
  };

  return (
    <div className="page-content dashboard-content">
      <aside className="panel telemetry-panel">
        <div className="panel-header">
          <h2>TELEMETRY DATA</h2>
          <span className="header-id">TEL-01</span>
        </div>
        <div className="data-grid">
          <div className="data-cell">
            <span className="data-label">AIRSPEED (KTS)</span>
            <span className="data-value">450.0</span>
          </div>
          <div className="data-cell">
            <span className="data-label">MACH NO.</span>
            <span className="data-value">{mach.toFixed(3)}</span>
          </div>
          <div className="data-cell">
            <span className="data-label">ALTITUDE (FT)</span>
            <span className="data-value">35000</span>
          </div>
          <div className="data-cell">
            <span className="data-label">AIR DENSITY</span>
            <span className="data-value">{density.toFixed(3)}</span>
          </div>
        </div>
        <div className="metric-block">
          <div className="metric-header">
            <span>STRUCTURAL STRESS</span>
            <span className="raw-val">{stress.toFixed(1)}%</span>
          </div>
          <div className="progress-track"><div className="progress-bar" style={{width: `${stress}%`, backgroundColor: stressColor}}></div></div>
        </div>
        <div className="metric-block">
          <div className="metric-header">
            <span>AERODYNAMIC RISK</span>
            <span className="raw-val">{risk.toFixed(2)}</span>
          </div>
          <div className="progress-track"><div className="progress-bar" style={{width: `${risk}%`, backgroundColor: riskColor}}></div></div>
        </div>
        
        {/* Real-time Analytical Chart */}
        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 600 }}>LIVE STRESS FEED</span>
            <span style={{ fontSize: '0.65rem', color: colors.optimal, fontFamily: 'IBM Plex Mono' }}>1.0 Hz</span>
          </div>
          <div style={{ flex: 1, minHeight: '80px', position: 'relative' }}>
             <Line data={chartData} options={chartOptions} />
             {recentHistory.length === 0 && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: '#6b7280'}}>AWAITING DATA...</div>}
          </div>
        </div>
      </aside>

      <main className="canvas-container">
        <div className="hud-overlay">
          <div className="crosshair-h"></div>
          <div className="crosshair-v"></div>
        </div>
        <canvas ref={canvasRef} id="simulation-canvas"></canvas>
        {risk >= 60 && <div className="canvas-overlay" style={{backgroundColor: `rgba(255, 51, 51, 0.15)`}}></div>}
      </main>

      <aside className="panel controls-panel">
        <div className="panel-header">
          <h2>ENV PARAMETERS</h2>
          <span className="header-id">ENV-02</span>
        </div>
        <div className="control-block">
          <div className="control-header">
            <label>WIND VELOCITY</label>
            <span className="val-display">{windSpeed} KTS</span>
          </div>
          <input type="range" min="0" max="150" value={windSpeed} onChange={e => setControls({windSpeed: parseInt(e.target.value)})} />
        </div>
        <div className="control-block">
          <div className="control-header">
            <label>OAT (OUTSIDE AIR TEMP)</label>
            <span className="val-display">{temperature} °C</span>
          </div>
          <input type="range" min="-80" max="40" value={temperature} onChange={e => setControls({temperature: parseInt(e.target.value)})} />
        </div>
        <div className="control-block">
          <div className="control-header">
            <label>TURBULENCE COEFF</label>
            <span className="val-display">{(turbulence / 100).toFixed(2)}</span>
          </div>
          <input type="range" min="0" max="100" value={turbulence} onChange={e => setControls({turbulence: parseInt(e.target.value)})} />
        </div>
        <div className="control-block">
          <div className="control-header">
            <label>PRECIPITATION / ICING</label>
            <span className="val-display">{precipitation} %</span>
          </div>
          <input type="range" min="0" max="100" value={precipitation} onChange={e => setControls({precipitation: parseInt(e.target.value)})} />
        </div>

        <div style={{ padding: '1.25rem 1rem', marginTop: 'auto' }}>
          <button 
            onClick={resetSimulation}
            style={{
              width: '100%', padding: '0.75rem', background: 'transparent',
              border: `1px solid ${colors.hud}`, color: colors.hud,
              fontFamily: 'IBM Plex Mono', fontSize: '0.8rem', cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={e => { e.target.style.background = 'rgba(0, 229, 255, 0.1)'; }}
            onMouseOut={e => { e.target.style.background = 'transparent'; }}
          >
            RESET SIMULATION
          </button>
        </div>
      </aside>
    </div>
  );
}
