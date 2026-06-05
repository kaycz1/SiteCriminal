/**
 * Jogo Investigativo: A Rosa Negra
 * Módulo de Efeitos Sonoros Dinâmicos (Web Audio API Synthesizer)
 * 
 * Gera efeitos de áudio no estilo terminal retrô-futurista de alta fidelidade
 * sem depender de arquivos externos de áudio (evitando problemas de CORS e arquivos ausentes).
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  // Inicializa o AudioContext de forma preguiçosa (Lazy Load) devido a restrições de Autoplay do navegador
  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    // Retoma se estiver suspenso (comum em navegadores que bloqueiam autoplay)
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Verifica se pode reproduzir
  canPlay() {
    if (this.isMuted) return false;
    this.initContext();
    return this.ctx !== null;
  }

  // Define o estado de mute
  setMute(isMuted) {
    this.isMuted = isMuted;
    if (isMuted && this.ctx && this.ctx.state === "running") {
      this.ctx.suspend();
    } else if (!isMuted && this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  /**
   * Som de Clique Mecânico (Teclado / Transição de Terminal)
   * Simula um interruptor de teclado de alta resposta e fidelidade retrô.
   */
  playKeypress() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Criar oscilador de clique estalado (suave e com frequência mais baixa)
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(750, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.015);

    gainNode.gain.setValueAtTime(0.02, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);

    // Efeito de ruído tátil de clique de fundo (muito curto e suave)
    try {
      const bufferSize = ctx.sampleRate * 0.004; // 4ms de ruído
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "highpass";
      noiseFilter.frequency.setValueAtTime(1500, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.003, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.004);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      gainNode.connect(ctx.destination); // Connect to gainNode instead for master gain control or destination

      noise.start(now);
      noise.stop(now + 0.005);
    } catch (e) {
      // Fallback silencioso se falhar ao criar o buffer de ruído
    }
  }

  /**
   * Som de Notificação / Beep de Alerta de Terminal
   * Um som limpo de ficção científica para botões e confirmações menores.
   */
  playBeep() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(500, now + 0.08);

    gainNode.gain.setValueAtTime(0.12, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Som de Sucesso / Descoberta de Pista
   * Um arpejo eletrônico cibernético ascendente extremamente satisfatório e recompensador.
   */
  playSuccess() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Arpejo de sucesso futurista (D6 -> F#6 -> A6 -> D7)
    const notes = [587.33, 739.99, 880.00, 1174.66];
    const duration = 0.07;

    notes.forEach((freq, index) => {
      const startTime = now + (index * 0.05);
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      
      gainNode.gain.setValueAtTime(0.0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.1, startTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.01);
    });
  }

  /**
   * Som de Erro / Acesso Negado
   * Som digital de zumbido analógico descendente de aviso policial.
   */
  playError() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.linearRampToValueAtTime(65, now + 0.25);

    osc2.type = "square";
    osc2.frequency.setValueAtTime(138, now); // Ligeiramente desafinado para efeito chorus de tensão
    osc2.frequency.linearRampToValueAtTime(63, now + 0.25);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.15);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    
    osc1.stop(now + 0.26);
    osc2.stop(now + 0.26);
  }

  /**
   * Som de Glitch / Instabilidade de Sinal / Decodificação Forense
   * Simula ruídos elétricos, interferência estática digital e flutuações cibernéticas de CRT.
   */
  playGlitch() {
    if (!this.canPlay()) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // Criar um glitch composto de rajadas de microondas e beeps dissonantes super rápidos
    const glitchDuration = 0.2;
    const segments = 6;
    const step = glitchDuration / segments;

    for (let i = 0; i < segments; i++) {
      const startTime = now + (i * step);
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Alternar tipo de onda para dar textura áspera e caótica
      osc.type = i % 2 === 0 ? "sawtooth" : "square";
      
      // Frequências ultra-desafinadas de alta voltagem
      const randomFreq = 3000 + Math.random() * 4000;
      osc.frequency.setValueAtTime(randomFreq, startTime);
      osc.frequency.linearRampToValueAtTime(randomFreq - 2000, startTime + step);

      // Volume caótico e trêmulo
      gainNode.gain.setValueAtTime(0.04, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + step);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + step + 0.005);
    }
  }
}

// Expõe globalmente como window.Sound
window.Sound = new SoundManager();

// Listener para desbloquear áudio na primeira interação do usuário (evita bloqueios de navegadores)
document.addEventListener("click", () => {
  if (window.Sound) {
    window.Sound.initContext();
  }
}, { once: false });
