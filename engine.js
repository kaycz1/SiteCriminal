/**
 * Jogo Investigativo: A Rosa Negra
 * Motor do Jogo (State Engine) - Versão Híbrida 3D
 */

class InvestiEngine {
  constructor() {
    this.state = {
      currentStage: 1, // Começa no 1 (Introdução)
      unlockedClues: [], // IDs de pistas encontradas na cozinha
      examinedBodyMarkers: [], // Marcadores da autópsia clicados (lips, wrist, head)
      suspicionLevels: {},
      suspectNotes: {},
      phoneUnlocked: false, // Se a senha 201812 do celular foi decifrada
      investigatorName: "", // Nome do investigador
      investigatorNameSaved: false, // Se o nome do investigador foi salvo
      charSkinColor: "#f5cba7", // Cor da pele do personagem
      charOutfit: "trenchcoat", // Roupa do personagem
      charHat: true, // Se usa chapéu fedora
      charGlasses: true, // Se usa óculos escuros
      charMustache: false, // Se usa bigode
      charAge: "28", // Idade do personagem
      charGender: "masculino", // Gênero do personagem
      charHairType: "cabelo", // Tipo de cabelo (cabelo ou careca)
      charHairStyle: "short", // Estilo de cabelo
      charHairColor: "#111111", // Cor do cabelo
      accusation: {
        killer: "",
        motive: "",
        method: "",
        theory: ""
      },
      isMuted: false,
      gameCompleted: false,
      interrogatedSuspects: [] // IDs de suspeitos interrogados
    };
  }

  // Inicializa o jogo e restaura salvamentos do navegador
  init() {
    this.loadGame();
    if (window.GAME_DATA && window.GAME_DATA.suspects) {
      Object.keys(window.GAME_DATA.suspects).forEach(key => {
        if (this.state.suspicionLevels[key] === undefined) {
          this.state.suspicionLevels[key] = window.GAME_DATA.suspects[key].initialSuspicion || 50;
        }
        if (this.state.suspectNotes[key] === undefined) {
          this.state.suspectNotes[key] = "";
        }
      });
    }
    if (window.Sound) {
      window.Sound.isMuted = this.state.isMuted;
    }
  }

  // Salva no LocalStorage
  saveGame() {
    try {
      localStorage.setItem("a_rosa_negra_hibrido_state", JSON.stringify(this.state));
    } catch (e) {
      console.error("Erro ao salvar progresso:", e);
    }
  }

  // Carrega do LocalStorage
  loadGame() {
    try {
      const saved = localStorage.getItem("a_rosa_negra_hibrido_state");
      if (saved) {
        const loadedState = JSON.parse(saved);
        this.state = { ...this.state, ...loadedState };
        console.log("Progresso restaurado. Etapa atual:", this.state.currentStage);
      }
    } catch (e) {
      console.error("Erro ao carregar progresso:", e);
    }
  }

  // Reseta a investigação inteira
  resetGame() {
    try {
      localStorage.removeItem("a_rosa_negra_hibrido_state");
      window.location.reload();
    } catch (e) {
      console.error("Erro ao reiniciar:", e);
    }
  }

  // Altera a etapa e valida limites
  setStage(stageNum) {
    if (stageNum < 1 || stageNum > 8) return;

    const maxReached = this.getMaxStageReached();
    if (stageNum > maxReached + 1) {
      if (window.Sound) window.Sound.playError();
      this.notify("Acesso negado: Conclua os objetivos das etapas anteriores primeiro.", "error");
      return;
    }

    this.state.currentStage = stageNum;
    this.saveGame();
    if (window.Sound) window.Sound.playBeep();

    document.dispatchEvent(new CustomEvent("stageChanged", { detail: { stage: stageNum } }));
  }

  // Retorna a maior etapa liberada baseada na lógica de descoberta
  getMaxStageReached() {
    let max = 1;

    // Etapa 1 (Identificação) -> Etapa 2 (Introdução) se o nome estiver salvo
    if (this.state.investigatorNameSaved) max = 2;

    // Etapa 2 -> Etapa 3 liberada após Introdução
    if (this.state.currentStage >= 2) max = 3;

    // Etapa 3 (Cozinha 3D) -> Precisa achar pelo menos 3 pistas para liberar Autópsia
    if (this.state.unlockedClues.length >= 3) max = 4;

    // Etapa 4 (Autópsia 3D) -> Precisa examinar os 3 pontos do corpo para liberar Suspeitos
    if (this.state.examinedBodyMarkers.length >= 3) max = 5;

    // Etapa 5 (Suspeitos) -> Uma vez acessada, abre Interrogatórios
    if (this.state.currentStage >= 5) max = 6;

    // Etapa 6 (Interrogatórios) -> Uma vez acessada, abre Celular
    if (this.state.currentStage >= 6) max = 7;

    // Etapa 7 (Celular da Vítima) → Acusação acessível após desbloqueio do telefone
    if (this.state.phoneUnlocked) max = 8;

    return Math.max(max, this.state.currentStage);
  }

  // Coleta de pistas na Cozinha 3D
  unlockClue(clueId) {
    if (!this.state.unlockedClues.includes(clueId)) {
      this.state.unlockedClues.push(clueId);
      this.saveGame();
      if (window.Sound) window.Sound.playSuccess();
      this.notify(`Evidência 3D analisada: ${GAME_DATA.clues[clueId].name}`, "success");
      
      document.dispatchEvent(new CustomEvent("clueUnlocked", { detail: { clueId } }));

      // Notifica quando atinge o limiar de pistas
      if (this.state.unlockedClues.length === 3) {
        this.notify("Laudo de Autópsia 3D disponível para liberação (Etapa 3)!", "info");
      }
    }
  }

  // Exame de marcadores no Boneco 3D
  examineBodyMarker(markerId) {
    if (!this.state.examinedBodyMarkers.includes(markerId)) {
      this.state.examinedBodyMarkers.push(markerId);
      this.saveGame();
      if (window.Sound) window.Sound.playSuccess();
      document.dispatchEvent(new CustomEvent("bodyMarkerExamined", { detail: { markerId } }));

      if (this.state.examinedBodyMarkers.length === 3) {
        this.notify("Exame Necroscópico Concluído! Fichas de Suspeitos Liberadas (Etapa 4)!", "info");
      }
    }
  }

  // Atualizações de fichas de suspeitos
  updateSuspicion(suspectId, level) {
    if (this.state.suspicionLevels[suspectId] !== undefined) {
      this.state.suspicionLevels[suspectId] = parseInt(level);
      this.saveGame();
      document.dispatchEvent(new CustomEvent("suspicionUpdated", { detail: { suspectId, level } }));
    }
  }

  updateNote(suspectId, noteText) {
    if (this.state.suspectNotes[suspectId] !== undefined) {
      this.state.suspectNotes[suspectId] = noteText;
      this.saveGame();
    }
  }

  // Validação da Senha do Celular (201812)
  unlockSmartphone(passcode) {
    if (passcode.trim() === GAME_DATA.phoneBypass.solution) {
      this.state.phoneUnlocked = true;
      this.saveGame();
      if (window.Sound) window.Sound.playSuccess();
      this.notify("Smartphone desbloqueado com sucesso! Acesso aos logs e arquivos concedido.", "success");
      document.dispatchEvent(new CustomEvent("phoneUnlocked"));
      return true;
    } else {
      if (window.Sound) window.Sound.playError();
      this.notify("Código incorreto. Acesso negado pelo sistema do celular.", "error");
      return false;
    }
  }

  // Submissão final do Veredito Policial
  submitAccusation(killer) {
    this.state.accusation = { killer };
    this.state.gameCompleted = true;
    this.saveGame();
    
    const isCorrect = (killer === GAME_DATA.accusationAnswers.killer);

    document.dispatchEvent(new CustomEvent("accusationSubmitted", { detail: { isCorrect, data: this.state.accusation } }));
    return isCorrect;
  }

  toggleMute() {
    this.state.isMuted = !this.state.isMuted;
    this.saveGame();
    if (window.Sound) {
      window.Sound.setMute(this.state.isMuted);
    }
    return this.state.isMuted;
  }

  notify(message, type = "info") {
    console.log(`[NOTIFY ${type}] ${message}`);
    const container = document.getElementById("hud-notifications");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} fade-in`;
    
    let icon = "📂";
    if (type === "success") icon = "✅";
    if (type === "error") icon = "🚨";

    toast.innerHTML = `<span class="toast-icon">${icon}</span> <span class="toast-text">${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("fade-out");
      setTimeout(() => { toast.remove(); }, 500);
    }, 4500);

    if (navigator.vibrate) {
      if (type === "error") navigator.vibrate([100, 50, 100]);
      else if (type === "success") navigator.vibrate(80);
      else navigator.vibrate(40);
    }
  }
}

const Engine = new InvestiEngine();
window.Engine = Engine;