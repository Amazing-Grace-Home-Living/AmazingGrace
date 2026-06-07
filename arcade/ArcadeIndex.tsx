import React from 'react';

export default function ArcadeIndex() {
  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-purple-500 selection:text-white">
      
      {/* Site Header
        Optimized for navigation button space; title text removed.
      */}
      <header className="flex justify-start items-center p-4 border-b border-purple-900/50 bg-black/80 backdrop-blur-md sticky top-0 z-50">
         <nav className="flex gap-4">
           <a 
             href="/" 
             className="px-5 py-2 text-amber-400 border border-amber-500/30 rounded font-semibold hover:bg-amber-500/10 hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all"
           >
             ← Core Node
           </a>
           <a 
             href="/library" 
             className="px-5 py-2 text-purple-400 border border-purple-500/30 rounded font-semibold hover:bg-purple-500/10 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
           >
             Library
           </a>
         </nav>
      </header>

      <main className="max-w-6xl mx-auto p-8 mt-8">
        
        {/* Arcade Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-amber-400 to-purple-600 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
            Nexus Arcade
          </h1>
          <p className="mt-4 text-purple-200/60 font-mono tracking-wide">
            Select a simulation module to deploy.
          </p>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. Matrix of Conscience: Duality Core */}
          <div className="group relative rounded-xl border border-purple-500/40 bg-gray-900/50 p-6 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-100 group-hover:text-amber-400 transition-colors duration-300">
                  Matrix of Conscience
                </h2>
                <span className="px-2 py-1 text-xs font-bold bg-purple-900/80 text-amber-200 rounded border border-purple-500/50 uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed flex-grow">
                Duality Core (3D). A collaborative Tower Defense simulation. Utilize the Drafting Board to negotiate with AI agents and manage dynamic threat vectors in real-time.
              </p>
              <a 
                href="/arcade/matrix-of-conscience/" 
                className="block w-full text-center py-3 bg-purple-800 text-white font-bold tracking-wide rounded border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:bg-purple-600 hover:shadow-[0_0_25px_rgba(168,85,247,0.8)] hover:-translate-y-0.5 transition-all duration-200"
              >
                Deploy Simulation
              </a>
            </div>
          </div>

          {/* 2. Classic Tower Defense */}
          <div className="group relative rounded-xl border border-purple-500/40 bg-gray-900/50 p-6 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-100 group-hover:text-amber-400 transition-colors duration-300">
                  Protocol: Tower Defense
                </h2>
                <span className="px-2 py-1 text-xs font-bold bg-purple-900/80 text-amber-200 rounded border border-purple-500/50 uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed flex-grow">
                Manage your cores and integrity. Deploy Blaster, Sniper, EMP, Plasma, and Tesla arrays against incoming waves. Utilize the Cyber Upgrade Protocol to upclock systems (+50% DMG | +15% RNG).
              </p>
              <a 
                href="/arcade/tower-defense/" 
                className="block w-full text-center py-3 bg-gray-800 text-gray-200 font-bold tracking-wide rounded border border-gray-600 hover:border-amber-400 hover:text-amber-400 hover:bg-gray-800/80 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-200"
              >
                Deploy Simulation
              </a>
            </div>
          </div>

          {/* 3. Star Matrix */}
          <div className="group relative rounded-xl border border-purple-500/40 bg-gray-900/50 p-6 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-100 group-hover:text-amber-400 transition-colors duration-300">
                  Star Matrix
                </h2>
                <span className="px-2 py-1 text-xs font-bold bg-purple-900/80 text-amber-200 rounded border border-purple-500/50 uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed flex-grow">
                Navigate the celestial grid. A strategic routing module requiring precise alignment of orbital nodes and cosmic energy to establish secure neural pathways.
              </p>
              <a 
                href="/arcade/star-matrix/" 
                className="block w-full text-center py-3 bg-gray-800 text-gray-200 font-bold tracking-wide rounded border border-gray-600 hover:border-amber-400 hover:text-amber-400 hover:bg-gray-800/80 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-200"
              >
                Deploy Simulation
              </a>
            </div>
          </div>

          {/* 4. Trinity */}
          <div className="group relative rounded-xl border border-purple-500/40 bg-gray-900/50 p-6 overflow-hidden backdrop-blur-md transition-all duration-300 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-100 group-hover:text-amber-400 transition-colors duration-300">
                  Trinity
                </h2>
                <span className="px-2 py-1 text-xs font-bold bg-purple-900/80 text-amber-200 rounded border border-purple-500/50 uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                  Active
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-6 leading-relaxed flex-grow">
                Tri-state logic simulation. Balance three competing core principles simultaneously to achieve perfect systemic harmony and structural integrity.
              </p>
              <a 
                href="/arcade/trinity/" 
                className="block w-full text-center py-3 bg-gray-800 text-gray-200 font-bold tracking-wide rounded border border-gray-600 hover:border-amber-400 hover:text-amber-400 hover:bg-gray-800/80 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all duration-200"
              >
                Deploy Simulation
              </a>
            </div>
          </div>

        </div>
      </main>
      
    </div>
  );
}
