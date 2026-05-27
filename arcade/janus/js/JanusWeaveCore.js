/**
 * JanusWeaveCore.js - The dual-phase superposition engine.
 * (c) 2026 NicholaiMadias — MIT License
 */

import { WhiteThreadEngine } from './WhiteThreadEngine.js';
import { ScarletLatticeEngine } from './ScarletLatticeEngine.js';
import { ProphecyWheel } from './ProphecyWheel.js';
import { AscendantDialogue } from './AscendantDialogue.js';

export class JanusWeaveCore {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.phase = 1; // 1 = White (Harmonic), -1 = Scarlet (Anti-Harmonic)
    this.oscillationSpeed = 0.005;
    this.superposition = 0; // -1 to 1 based on phase
    
    this.whiteEngine = new WhiteThreadEngine();
    this.scarletEngine = new ScarletLatticeEngine();
    this.prophecyWheel = new ProphecyWheel();
    this.dialogue = new AscendantDialogue();

    this.lastTime = 0;
    this.isRunning = false;
  }

  start() {
    this.isRunning = true;
    requestAnimationFrame((t) => this.loop(t));
    this.logSystem('JANUS_WEAVE_CORE initialized. Superposition stabilized.');
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // Oscillate superposition
    this.superposition = Math.sin(Date.now() * this.oscillationSpeed);
    this.phase = this.superposition > 0 ? 1 : -1;

    this.whiteEngine.update(dt, this.superposition);
    this.scarletEngine.update(dt, this.superposition);
    this.prophecyWheel.update(dt, this.superposition);
    this.dialogue.update(dt);
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Global background depth
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render layers in order of metaphysical priority
    this.prophecyWheel.draw(ctx);
    this.whiteEngine.draw(ctx, this.superposition);
    this.scarletEngine.draw(ctx, this.superposition);
    
    // Convergence Vignette
    const alpha = Math.abs(this.superposition) * 0.1;
    const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, this.phase > 0 ? `rgba(255,255,255,${alpha})` : `rgba(255,0,64,${alpha})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  logSystem(msg) {
    const consoleEl = document.getElementById('janus-console-log');
    if (consoleEl) {
      const line = document.createElement('div');
      line.textContent = `> [${new Date().toLocaleTimeString()}] ${msg}`;
      consoleEl.appendChild(line);
      consoleEl.scrollTop = consoleEl.scrollHeight;
    }
  }

  handleInteraction(x, y) {
    // Trigger psionic interference based on current phase
    if (this.phase > 0) {
      this.whiteEngine.triggerFilament(x, y);
    } else {
      this.scarletEngine.triggerRecursion(x, y);
    }
    this.prophecyWheel.rotate(this.phase * 5);
  }
}
