import React from 'react';
import { useHUD } from '../../hud/HUDContext';
import { Map, Star, Shield, Cpu, BookOpen } from 'lucide-react';
import './universe-map.css';

export default function UniverseMap({ navigateTo }) {
  const { hud } = useHUD();
  const playerLevel = hud?.player?.level || 1;

  const sectors = [
    {
      id: 'matrix',
      name: 'Matrix of Conscience',
      x: 30,
      y: 70,
      icon: <Cpu size={32} />,
      route: 'conscience',
      unlocked: true,
      color: '#ffd700'
    },
    {
      id: 'nexus',
      name: 'Nexus Defense',
      x: 60,
      y: 40,
      icon: <Shield size={32} />,
      route: 'nexus-hud', 
      unlocked: playerLevel >= 2,
      color: '#00f2ff'
    },
    {
      id: 'storybook',
      name: 'Shell of Vision',
      x: 80,
      y: 80,
      icon: <BookOpen size={32} />,
      route: 'storybook',
      unlocked: playerLevel >= 3,
      color: '#a855f7'
    },
    {
      id: 'starmatrix',
      name: 'Star Matrix',
      x: 20,
      y: 20,
      icon: <Star size={32} />,
      route: 'hub',
      unlocked: playerLevel >= 4,
      color: '#ef4444'
    }
  ];

  return (
    <div className="universe-map-container">
      <div className="map-header text-center mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-[0.2em] mb-2 drop-shadow-[0_0_15px_rgba(0,229,255,0.8)] text-[#00E5FF]">
          Universe Expansion
        </h1>
        <p className="text-gray-300 font-mono text-sm">
          Sector Unlock Level: {playerLevel}. Navigate the cosmos to secure timelines.
        </p>
      </div>

      <div className="map-viewport relative w-full h-[600px] border border-purple-500/50 rounded-xl overflow-hidden bg-[#020617] shadow-[0_0_30px_rgba(120,81,169,0.3)]">
        
        {/* Background Grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.1
        }}></div>

        {/* Connections (SVG Lines) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {sectors.map((s1, i) => {
            if (i === sectors.length - 1) return null;
            const s2 = sectors[i + 1];
            return (
              <line 
                key={`line_${s1.id}_${s2.id}`}
                x1={`${s1.x}%`} y1={`${s1.y}%`}
                x2={`${s2.x}%`} y2={`${s2.y}%`}
                stroke={s2.unlocked ? '#a855f7' : '#333'}
                strokeWidth="2"
                strokeDasharray="5,5"
                className={s2.unlocked ? 'neon-pulse-stroke' : ''}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {sectors.map((sector) => (
          <div
            key={sector.id}
            className={`absolute flex flex-col items-center justify-center transition-all duration-300
              ${sector.unlocked ? 'cursor-pointer hover:scale-110' : 'opacity-50 grayscale cursor-not-allowed'}
            `}
            style={{ left: `${sector.x}%`, top: `${sector.y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={() => {
              if (sector.unlocked) {
                if (sector.id === 'nexus' || sector.id === 'starmatrix') {
                   // Open external URL for standalone arcade games
                   window.location.href = sector.id === 'nexus' ? '/arcade/tower-defense/index.html' : '/arcade/star-matrix/index.html';
                } else {
                  navigateTo(sector.route);
                }
              }
            }}
          >
            <div 
              className={`p-4 rounded-full bg-black border-2 shadow-[0_0_20px_${sector.color}40]`}
              style={{ borderColor: sector.color, color: sector.color, boxShadow: sector.unlocked ? `0 0 20px ${sector.color}` : 'none' }}
            >
              {sector.icon}
            </div>
            <div className="mt-2 text-center font-bold tracking-widest text-sm bg-black/80 px-2 py-1 rounded shadow-lg border border-gray-800" style={{ color: sector.color }}>
              {sector.name}
              {!sector.unlocked && <span className="block text-xs text-gray-500 font-mono">LOCKED</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
