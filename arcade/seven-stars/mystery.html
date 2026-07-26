import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Sun, Moon, Hexagon, Gem, Flame, Palette, Shield, 
    Hammer, Zap, Bomb, Play, RefreshCw, Trophy, Target, Clock 
} from 'lucide-react';

// --- LORE & CONSTANTS ---
const ICON_MAP = { Sun, Moon, Hexagon, Gem, Flame, Palette, Shield };

const GEM_TYPES = [
    { id: 'knowledge', color: 'bg-yellow-400', shadow: 'shadow-[0_0_15px_rgba(250,204,21,0.5)]', icon: 'Sun', label: 'Knowledge' },
    { id: 'faith', color: 'bg-slate-300', shadow: 'shadow-[0_0_15px_rgba(203,213,225,0.5)]', icon: 'Moon', label: 'Faith' },
    { id: 'truth', color: 'bg-blue-500', shadow: 'shadow-[0_0_15px_rgba(59,130,246,0.5)]', icon: 'Hexagon', label: 'Truth' },
    { id: 'compassion', color: 'bg-emerald-500', shadow: 'shadow-[0_0_15px_rgba(16,185,129,0.5)]', icon: 'Gem', label: 'Compassion' },
    { id: 'courage', color: 'bg-rose-500', shadow: 'shadow-[0_0_15px_rgba(244,63,94,0.5)]', icon: 'Flame', label: 'Courage' },
    { id: 'creativity', color: 'bg-purple-500', shadow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]', icon: 'Palette', label: 'Creativity' },
    { id: 'integrity', color: 'bg-zinc-700', shadow: 'shadow-[0_0_15px_rgba(63,63,70,0.5)]', icon: 'Shield', label: 'Integrity' },
];

const BOARD_SIZE = 8;
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// --- SYNTH AUDIO ENGINE ---
let audioCtx = null;
const playSound = (type) => {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    const now = audioCtx.currentTime;
    
    try {
        if (type === 'swap') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, now);
            osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);
            gain.gain.setValueAtTime(0.05, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
        } else if (type === 'match') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === 'combo') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.3);
        } else if (type === 'powerup') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(40, now + 0.4);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        } else if (type === 'level_up') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.setValueAtTime(500, now + 0.1);
            osc.frequency.setValueAtTime(600, now + 0.2);
            osc.frequency.setValueAtTime(800, now + 0.3);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.6);
            osc.start(now);
            osc.stop(now + 0.6);
        }
    } catch(e) { console.warn("Audio error", e); }
};

// --- GAME LOGIC HELPER ---
const generateBoard = () => {
    let b = [];
    for(let r=0; r<BOARD_SIZE; r++){
        let row = [];
        for(let c=0; c<BOARD_SIZE; c++){
            let type;
            do {
                type = GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
            } while (
                (r >= 2 && b[r-1][c].type.id === type.id && b[r-2][c].type.id === type.id) ||
                (c >= 2 && row[c-1].type.id === type.id && row[c-2].type.id === type.id)
            );
            row.push({ id: Math.random().toString(), type, isMatched: false });
        }
        b.push(row);
    }
    return b;
};

const checkMatches = (currentBoard) => {
    let matchedSet = new Set();
    
    // Horizontal
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE - 2; c++) {
            let t1 = currentBoard[r][c]?.type?.id;
            if (t1 && t1 === currentBoard[r][c+1]?.type?.id && t1 === currentBoard[r][c+2]?.type?.id) {
                matchedSet.add(`${r},${c}`);
                matchedSet.add(`${r},${c+1}`);
                matchedSet.add(`${r},${c+2}`);
                let ext = 3;
                while (c + ext < BOARD_SIZE && currentBoard[r][c+ext]?.type?.id === t1) {
                    matchedSet.add(`${r},${c+ext}`);
                    ext++;
                }
            }
        }
    }
    // Vertical
    for (let c = 0; c < BOARD_SIZE; c++) {
        for (let r = 0; r < BOARD_SIZE - 2; r++) {
            let t1 = currentBoard[r][c]?.type?.id;
            if (t1 && t1 === currentBoard[r+1][c]?.type?.id && t1 === currentBoard[r+2][c]?.type?.id) {
                matchedSet.add(`${r},${c}`);
                matchedSet.add(`${r+1},${c}`);
                matchedSet.add(`${r+2},${c}`);
                let ext = 3;
                while (r + ext < BOARD_SIZE && currentBoard[r+ext][c]?.type?.id === t1) {
                    matchedSet.add(`${r+ext},${c}`);
                    ext++;
                }
            }
        }
    }
    return Array.from(matchedSet).map(str => {
        const [r, c] = str.split(',').map(Number);
        return { r, c };
    });
};

export default function App() {
    // --- STATE ---
    const [gameState, setGameState] = useState('start');
    const [board, setBoard] = useState([]);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [moves, setMoves] = useState(25);
    const [timeLeft, setTimeLeft] = useState(null);
    const [combo, setCombo] = useState(1);
    const [message, setMessage] = useState(null);
    const [powerUps, setPowerUps] = useState({ hammer: 1, row: 1, color: 1 });
    const [activePowerUp, setActivePowerUp] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Refs for synch access inside asynchronous loops
    const boardRef = useRef([]);
    const scoreRef = useRef(0);
    const movesRef = useRef(25);
    const comboRef = useRef(1);
    const targetScoreRef = useRef(2000);
    
    // Interaction Refs for Drag/Swipe
    const dragData = useRef(null);
    const touchStartData = useRef(null);

    const isBonusLevel = level % 3 === 0;

    // --- INITIALIZATION ---
    const startGame = () => {
        playSound('swap');
        const newBoard = generateBoard();
        boardRef.current = newBoard;
        setBoard(newBoard);
        setScore(0);
        scoreRef.current = 0;
        setLevel(1);
        setMoves(25);
        movesRef.current = 25;
        targetScoreRef.current = 2000;
        setPowerUps({ hammer: 1, row: 1, color: 1 });
        setGameState('playing');
    };

    const updateBoardState = (newBoard) => {
        boardRef.current = newBoard.map(r => r.map(c => c ? {...c} : null));
        setBoard(boardRef.current);
    };

    const showToast = (txt) => {
        setMessage(txt);
        setTimeout(() => setMessage(null), 2500);
    };

    // --- GAME ENGINE ---
    const processMatches = async (isInitialSwap = false, pos1 = null, pos2 = null) => {
        let matches = checkMatches(boardRef.current);
        
        if (matches.length > 0) {
            let currentCombo = isInitialSwap ? 1 : comboRef.current + 1;
            comboRef.current = currentCombo;
            setCombo(currentCombo);

            // Deduct move only on successful initial swap
            if (isInitialSwap && typeof movesRef.current === 'number') {
                movesRef.current -= 1;
                setMoves(movesRef.current);
            }

            // Power-up Rewards based on match size
            if (matches.length >= 5) {
                setPowerUps(p => ({...p, color: p.color + 1}));
                showToast("Supernova Earned!");
            } else if (matches.length === 4) {
                setPowerUps(p => ({...p, row: p.row + 1}));
                showToast("Shooting Star Earned!");
            } else if (currentCombo === 3) {
                setPowerUps(p => ({...p, hammer: p.hammer + 1}));
                showToast("Shatter Earned!");
            }

            let newBoard = boardRef.current.map(row => [...row]);
            matches.forEach(({r, c}) => {
                if(newBoard[r][c]) newBoard[r][c].isMatched = true;
            });
            updateBoardState(newBoard);
            playSound(currentCombo > 1 ? 'combo' : 'match');
            
            const points = matches.length * 10 * currentCombo;
            scoreRef.current += points;
            setScore(scoreRef.current);

            await delay(300);
            await applyGravityAndCascade();
            
        } else if (isInitialSwap) {
            // Revert Swap
            playSound('swap');
            let newBoard = boardRef.current.map(row => [...row]);
            const temp = newBoard[pos1.r][pos1.c];
            newBoard[pos1.r][pos1.c] = newBoard[pos2.r][pos2.c];
            newBoard[pos2.r][pos2.c] = temp;
            updateBoardState(newBoard);
            comboRef.current = 1;
            setCombo(1);
            setIsProcessing(false);
        } else {
            // End of cascade
            comboRef.current = 1;
            setCombo(1);
            checkLevelProgress();
        }
    };

    const applyGravityAndCascade = async () => {
        let newBoard = boardRef.current.map(row => [...row]);
        for (let c = 0; c < BOARD_SIZE; c++) {
            let emptySpots = 0;
            for (let r = BOARD_SIZE - 1; r >= 0; r--) {
                if (!newBoard[r][c] || newBoard[r][c].isMatched) {
                    emptySpots++;
                    newBoard[r][c] = null;
                } else if (emptySpots > 0) {
                    newBoard[r + emptySpots][c] = newBoard[r][c];
                    newBoard[r][c] = null;
                }
            }
            // Generate new tiles at the top
            for (let r = 0; r < emptySpots; r++) {
                newBoard[r][c] = {
                    id: Math.random().toString(),
                    type: GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)],
                    isMatched: false
                };
            }
        }
        updateBoardState(newBoard);
        await delay(350); // wait for visual drop
        await processMatches(false);
    };

    const checkLevelProgress = () => {
        if (scoreRef.current >= targetScoreRef.current) {
            handleLevelComplete(true);
        } else if (!isBonusLevel && typeof movesRef.current === 'number' && movesRef.current <= 0) {
            setGameState('gameover');
            playSound('powerup'); // failure sound
        } else {
            setIsProcessing(false);
        }
    };

    const handleLevelComplete = (reachedTarget = true) => {
        playSound('level_up');
        if (isBonusLevel && reachedTarget) {
            const timeBonus = (timeLeft || 0) * 50;
            scoreRef.current += timeBonus;
            setScore(scoreRef.current);
            showToast("Bonus Mastered! Time Bonus Applied!");
        } else {
            showToast("Level Complete!");
        }
        
        setIsProcessing(true);
        setTimeout(() => {
            setLevel(l => {
                const nextLevel = l + 1;
                const nextIsBonus = nextLevel % 3 === 0;
                
                targetScoreRef.current = scoreRef.current + (nextLevel * 1500);
                
                if (nextIsBonus) {
                    setMoves('∞');
                    movesRef.current = '∞';
                    setTimeLeft(60);
                } else {
                    const newMoves = 20 + nextLevel * 2;
                    setMoves(newMoves);
                    movesRef.current = newMoves;
                    setTimeLeft(null);
                }
                
                updateBoardState(generateBoard());
                setIsProcessing(false);
                return nextLevel;
            });
        }, 2000);
    };

    // --- INTERACTIONS: UNIVERSAL SWAP LOGIC ---
    const attemptSwap = (pos1, pos2) => {
        if (isProcessing || gameState !== 'playing') return;
        if (!pos1 || !pos2) return;
        if (pos1.r === pos2.r && pos1.c === pos2.c) return;

        const isAdjacent = Math.abs(pos1.r - pos2.r) + Math.abs(pos1.c - pos2.c) === 1;
        if (!isAdjacent) return;

        setIsProcessing(true);
        playSound('swap');
        
        let newBoard = boardRef.current.map(row => [...row]);
        const temp = newBoard[pos1.r][pos1.c];
        newBoard[pos1.r][pos1.c] = newBoard[pos2.r][pos2.c];
        newBoard[pos2.r][pos2.c] = temp;
        updateBoardState(newBoard);
        
        setTimeout(() => processMatches(true, pos1, pos2), 300);
    };

    // 1. Click / Tap
    const handleTileClick = (r, c) => {
        if (isProcessing || gameState !== 'playing') return;

        if (activePowerUp) {
            usePowerUp(r, c);
            return;
        }

        if (!selected) {
            setSelected({ r, c });
        } else {
            attemptSwap(selected, { r, c });
            setSelected(null);
        }
    };

    // 2. Desktop Drag & Drop
    const handleDragStart = (e, r, c) => {
        if (isProcessing || activePowerUp || gameState !== 'playing') {
            e.preventDefault();
            return;
        }
        dragData.current = { r, c };
        setSelected(null); // Clear selection visually if dragging
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary for drop to trigger
    };

    const handleDrop = (e, targetR, targetC) => {
        e.preventDefault();
        if (dragData.current) {
            attemptSwap(dragData.current, { r: targetR, c: targetC });
            dragData.current = null;
        }
    };

    // 3. Mobile Swipe
    const handleTouchStart = (e, r, c) => {
        if (isProcessing || activePowerUp || gameState !== 'playing') return;
        const touch = e.touches[0];
        touchStartData.current = { x: touch.clientX, y: touch.clientY, r, c };
    };

    const handleTouchEnd = (e) => {
        if (!touchStartData.current) return;
        const touch = e.changedTouches[0];
        
        const deltaX = touch.clientX - touchStartData.current.x;
        const deltaY = touch.clientY - touchStartData.current.y;
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        
        // Minimum 30px swipe threshold
        if (Math.max(absX, absY) > 30) {
            let targetR = touchStartData.current.r;
            let targetC = touchStartData.current.c;
            
            if (absX > absY) {
                targetC += (deltaX > 0 ? 1 : -1); // Right or Left
            } else {
                targetR += (deltaY > 0 ? 1 : -1); // Down or Up
            }
            
            // Boundary Check
            if (targetR >= 0 && targetR < BOARD_SIZE && targetC >= 0 && targetC < BOARD_SIZE) {
                attemptSwap(touchStartData.current, { r: targetR, c: targetC });
                setSelected(null);
            }
        }
        touchStartData.current = null;
    };


    // --- POWER UPS ---
    const usePowerUp = async (r, c) => {
        setIsProcessing(true);
        playSound('powerup');
        
        let newBoard = boardRef.current.map(row => [...row]);
        
        if (activePowerUp === 'hammer') {
            newBoard[r][c].isMatched = true;
            setPowerUps(p => ({...p, hammer: p.hammer - 1}));
        } else if (activePowerUp === 'row') {
            for(let i=0; i<BOARD_SIZE; i++) newBoard[r][i].isMatched = true;
            setPowerUps(p => ({...p, row: p.row - 1}));
        } else if (activePowerUp === 'color') {
            const targetType = newBoard[r][c].type.id;
            for(let i=0; i<BOARD_SIZE; i++) {
                for(let j=0; j<BOARD_SIZE; j++) {
                    if(newBoard[i][j].type.id === targetType) newBoard[i][j].isMatched = true;
                }
            }
            setPowerUps(p => ({...p, color: p.color - 1}));
        }
        
        setActivePowerUp(null);
        updateBoardState(newBoard);
        
        await delay(300);
        await applyGravityAndCascade();
    };

    const togglePowerUp = (type) => {
        if (isProcessing) return;
        if (powerUps[type] <= 0) return;
        setActivePowerUp(prev => prev === type ? null : type);
        setSelected(null);
    };

    // --- EFFECTS ---
    useEffect(() => {
        if (gameState === 'playing' && isBonusLevel && timeLeft !== null) {
            if (timeLeft > 0) {
                const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
                return () => clearTimeout(timer);
            } else if (timeLeft === 0) {
                handleLevelComplete(false);
            }
        }
    }, [isBonusLevel, timeLeft, gameState]);


    // --- RENDERING HELPERS ---
    const getLevelName = (lvl) => {
        if (lvl % 3 === 0) return "Forge of Valor (Bonus)";
        const names = ["Knowledge", "Faith", "Truth", "Compassion", "Courage", "Creativity", "Integrity"];
        return names[(lvl - Math.floor(lvl/3) - 1) % names.length];
    };

    if (gameState === 'start') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/30 via-slate-950 to-black pointer-events-none"></div>
                <div className="relative z-10 text-center space-y-8 max-w-lg p-8">
                    <Trophy size={64} className="mx-auto text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)] mb-4" />
                    <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 drop-shadow-sm">
                        Mystery of the Seven Stars
                    </h1>
                    <p className="text-xl text-slate-300">Unite the Virtues. Master the Matrix.</p>
                    <button 
                        onClick={startGame} 
                        className="mt-8 px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(59,130,246,0.6)] flex items-center gap-3 mx-auto"
                    >
                        <Play fill="currentColor" /> Begin Journey
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'gameover') {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/30 via-slate-950 to-black pointer-events-none"></div>
                <div className="relative z-10 text-center space-y-6">
                    <h1 className="text-5xl font-black text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,0.5)]">Matrix Unstable</h1>
                    <p className="text-2xl text-slate-300">You reached Level {level}</p>
                    <p className="text-4xl font-bold text-white">Final Score: {score}</p>
                    <button 
                        onClick={startGame} 
                        className="mt-8 px-10 py-4 bg-rose-600 rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(244,63,94,0.6)] flex items-center gap-3 mx-auto"
                    >
                        <RefreshCw /> Restart Journey
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center font-sans relative overflow-hidden select-none">
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-black pointer-events-none"></div>
            
            <div className="relative z-10 w-full max-w-[480px] bg-slate-900/60 backdrop-blur-xl rounded-[2rem] border border-white/10 shadow-2xl p-6 flex flex-col items-center">
                
                {/* HUD */}
                <div className="w-full flex justify-between items-end mb-6">
                    <div>
                        <div className={`text-sm font-bold tracking-widest uppercase ${isBonusLevel ? 'text-yellow-400' : 'text-blue-400'}`}>
                            {getLevelName(level)}
                        </div>
                        <div className="text-3xl font-black text-white">Level {level}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-slate-400 text-sm font-semibold uppercase flex items-center gap-1 justify-end">
                            <Target size={14}/> Target
                        </div>
                        <div className="text-2xl font-bold text-white">
                            <span className="text-blue-400">{score}</span> / {targetScoreRef.current}
                        </div>
                    </div>
                </div>

                <div className="w-full flex gap-4 mb-6">
                    <div className="flex-1 bg-slate-800/80 rounded-2xl p-4 border border-white/5 flex items-center justify-between shadow-inner">
                        <span className="text-slate-400 font-bold uppercase text-sm">Moves</span>
                        <span className="text-2xl font-black text-emerald-400">{moves}</span>
                    </div>
                    {isBonusLevel && (
                        <div className="flex-1 bg-rose-900/30 rounded-2xl p-4 border border-rose-500/20 flex items-center justify-between shadow-inner">
                            <span className="text-rose-400 font-bold uppercase text-sm flex items-center gap-2"><Clock size={16}/> Time</span>
                            <span className="text-2xl font-black text-rose-400">{timeLeft}s</span>
                        </div>
                    )}
                </div>

                {/* GAME BOARD 
                    Note: touch-none prevents page scrolling on mobile while swiping 
                */}
                <div className="relative w-full aspect-square bg-black/40 rounded-2xl p-2 border border-white/5 shadow-inner touch-none">
                    
                    {/* Floating Messages */}
                    {message && (
                        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                            <span className="bg-slate-900/90 text-white px-6 py-3 rounded-full font-bold text-xl tracking-wider shadow-2xl animate-bounce border border-white/10">
                                {message}
                            </span>
                        </div>
                    )}
                    {combo > 1 && (
                        <div className="absolute -top-4 -right-4 z-50 animate-pulse pointer-events-none">
                            <div className="bg-yellow-400 text-slate-900 font-black text-2xl px-4 py-2 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.6)] transform rotate-12">
                                x{combo}
                            </div>
                        </div>
                    )}

                    <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-1">
                        {board.map((row, r) => row.map((tile, c) => {
                            if (!tile) return <div key={`empty-${r}-${c}`} className="w-full h-full"></div>;
                            
                            const isSelected = selected?.r === r && selected?.c === c;
                            const IconComponent = ICON_MAP[tile.type.icon];

                            return (
                                <div 
                                    key={tile.id}
                                    
                                    /* Click interactions */
                                    onClick={() => handleTileClick(r, c)}
                                    
                                    /* Desktop HTML5 Drag Interactions */
                                    draggable={!activePowerUp && !isProcessing}
                                    onDragStart={(e) => handleDragStart(e, r, c)}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, r, c)}
                                    
                                    /* Mobile Swipe Interactions */
                                    onTouchStart={(e) => handleTouchStart(e, r, c)}
                                    onTouchEnd={handleTouchEnd}

                                    className={`
                                        relative w-full h-full flex items-center justify-center rounded-xl cursor-pointer
                                        transition-all duration-300 ease-in-out transform
                                        ${tile.type.color} ${tile.type.shadow}
                                        ${isSelected ? 'ring-4 ring-white scale-110 z-20 brightness-125' : 'hover:brightness-110'}
                                        ${tile.isMatched ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
                                        ${activePowerUp ? 'hover:ring-4 hover:ring-rose-500' : ''}
                                        border border-white/20
                                    `}
                                >
                                    {IconComponent && <IconComponent size={24} className="text-white drop-shadow-md pointer-events-none" />}
                                </div>
                            );
                        }))}
                    </div>
                </div>

                {/* POWER UPS */}
                <div className="w-full mt-6 bg-slate-800/50 rounded-2xl p-4 border border-white/5">
                    <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Ministry Items</div>
                    <div className="flex justify-center gap-6">
                        <PowerUpBtn 
                            icon={Hammer} label="Shatter" count={powerUps.hammer} 
                            active={activePowerUp === 'hammer'} color="blue" onClick={() => togglePowerUp('hammer')}
                        />
                        <PowerUpBtn 
                            icon={Zap} label="Row Blast" count={powerUps.row} 
                            active={activePowerUp === 'row'} color="yellow" onClick={() => togglePowerUp('row')}
                        />
                        <PowerUpBtn 
                            icon={Bomb} label="Supernova" count={powerUps.color} 
                            active={activePowerUp === 'color'} color="purple" onClick={() => togglePowerUp('color')}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

// Subcomponent for powerup buttons
const PowerUpBtn = ({ icon: Icon, count, active, onClick, color, label }) => {
    const colors = {
        blue: 'border-blue-500 bg-blue-500/20 text-blue-400',
        yellow: 'border-yellow-400 bg-yellow-400/20 text-yellow-400',
        purple: 'border-purple-500 bg-purple-500/20 text-purple-400',
        inactive: 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700'
    };
    
    const isActive = active && count > 0;
    const styleClass = isActive ? colors[color] : colors.inactive;

    return (
        <button 
            onClick={onClick}
            disabled={count <= 0 && !active}
            className={`relative p-4 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${styleClass} ${count <= 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
            title={label}
        >
            <Icon size={24} />
            <span className="absolute -top-3 -right-3 w-7 h-7 bg-white text-slate-900 text-xs font-black rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg">
                {count}
            </span>
        </button>
    );
};


