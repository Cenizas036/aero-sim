import { create } from 'zustand';

// Use Zustand for simple global state
export const useSimulationStore = create((set) => ({
  windSpeed: 0,
  temperature: -50,
  turbulence: 0,
  precipitation: 0,
  history: [],
  setControls: (controls) => set((state) => ({ ...state, ...controls })),
  logHistory: (entry) => set((state) => ({
    history: [...state.history, { timestamp: new Date().toISOString(), ...entry }].slice(-50) // Keep last 50 logs
  })),
  applyScenario: (scenario) => set(() => ({
    windSpeed: scenario.windSpeed,
    temperature: scenario.temperature,
    turbulence: scenario.turbulence,
    precipitation: scenario.precipitation
  }))
}));
