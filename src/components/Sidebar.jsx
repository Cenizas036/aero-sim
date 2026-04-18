import React from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, LayoutDashboard, BarChart2 } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h1>AEROSIM</h1>
        <span>CORP. EDITION v3.0</span>
      </div>
      <nav className="nav-links">
        <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>
          <Activity size={18} />
          <span>Simulation</span>
        </NavLink>
        <NavLink to="/scenarios" className={({isActive}) => isActive ? 'active' : ''}>
          <LayoutDashboard size={18} />
          <span>Scenarios</span>
        </NavLink>
        <NavLink to="/analytics" className={({isActive}) => isActive ? 'active' : ''}>
          <BarChart2 size={18} />
          <span>Analytics</span>
        </NavLink>
      </nav>
    </aside>
  );
}
