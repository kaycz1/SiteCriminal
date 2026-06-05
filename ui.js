  /**
   * Jogo Investigativo: A Rosa Negra
   * Controlador de Interface (UI Module) - Versão Híbrida 3D
   */

  class InvestiUI {
    constructor() {
      this.typingTimer = null;
      
      // Estados do Three.js para Cozinha 3D
      this.kitchenScene = null;
      this.kitchenCamera = null;
      this.kitchenRenderer = null;
      this.kitchenClues = [];
      
      // Estados do Three.js para Autópsia 3D
      this.bodyScene = null;
      this.bodyCamera = null;
      this.bodyRenderer = null;
      this.bodyMannequin = null;
      this.bodyMarkers = [];

      // Estados do Close-up 3D de Pistas
      this.inspectScene = null;
      this.inspectCamera = null;
      this.inspectRenderer = null;
      this.inspectMesh = null;
    }

    init() {
      this.renderNavigation();
      this.bindGlobalEvents();
      this.updateHUD();
      this.syncAvatar();
      this.switchStage(Engine.state.currentStage);
      this.initTerminalEffects();
    }

    syncAvatar() {
      const skinColor = Engine.state.charSkinColor || "#f5cba7";
      const outfit = Engine.state.charOutfit || "trenchcoat";
      const hat = Engine.state.charHat !== false;
      const glasses = Engine.state.charGlasses !== false;
      const mustache = !!Engine.state.charMustache;
      const gender = Engine.state.charGender || "masculino";
      const hairType = Engine.state.charHairType || "cabelo";
      
      const nameInput = document.getElementById("char-name");
      const ageInput = document.getElementById("char-age");
      const hatCheckbox = document.getElementById("char-acc-hat");
      const glassesCheckbox = document.getElementById("char-acc-glasses");
      const mustacheCheckbox = document.getElementById("char-acc-mustache");

      const nameVal = nameInput ? nameInput.value.trim() : (Engine.state.investigatorName || "");
      const ageVal = ageInput ? ageInput.value : (Engine.state.charAge || "28");
      
      const currentHat = hatCheckbox ? hatCheckbox.checked : hat;
      const currentGlasses = glassesCheckbox ? glassesCheckbox.checked : glasses;
      const currentMustache = mustacheCheckbox ? mustacheCheckbox.checked : mustache;

      const mainSVG = document.getElementById("avatar-svg");
      if (mainSVG) {
        const skinGroup = mainSVG.querySelector(".skin-element");
        if (skinGroup) {
          skinGroup.querySelectorAll("circle, rect").forEach(el => {
            el.setAttribute("fill", skinColor);
          });
        }

        ["trenchcoat", "suit", "leather", "tactical"].forEach(o => {
          const el = mainSVG.querySelector(`#svg-outfit-${o}`);
          if (el) el.style.display = (o === outfit) ? "block" : "none";
        });

        const hatEl = mainSVG.querySelector("#svg-acc-hat");
        if (hatEl) hatEl.style.display = currentHat ? "block" : "none";

        const glassesEl = mainSVG.querySelector("#svg-acc-glasses");
        if (glassesEl) glassesEl.style.display = currentGlasses ? "block" : "none";

        const mustacheEl = mainSVG.querySelector("#svg-acc-mustache");
        if (mustacheEl) mustacheEl.style.display = currentMustache ? "block" : "none";

        const hairSection = document.getElementById("hair-section");
        if (hairSection) {
          hairSection.style.display = currentHat ? "none" : "block";
        }

        const hairGroup = mainSVG.querySelector("#svg-hair");
        if (hairGroup) {
          hairGroup.style.display = currentHat ? "none" : "block";

          ["short", "long", "curly", "bald"].forEach(h => {
            const el = mainSVG.querySelector(`#svg-hair-${h}`);
            if (el) el.style.display = "none";
          });

          if (hairType === "cabelo") {
            const activeStyle = (gender === "feminino") ? "long" : "short";
            const el = mainSVG.querySelector(`#svg-hair-${activeStyle}`);
            if (el) el.style.display = "block";
          }
        }

        // Clone and distribute to header and intro tab
        const svgHTML = mainSVG.outerHTML;
        const cleanedHTML = svgHTML.replace(/id="avatar-svg"/g, 'class="detective-avatar-svg" style="width: 100%; height: 100%; max-width: 100%; max-height: 100%; display: block;"').replace(/id="svg-/g, 'class="svg-');

        const headerAvatar = document.getElementById("header-avatar-container");
        if (headerAvatar) {
          headerAvatar.innerHTML = cleanedHTML;
        }

        const introAvatar = document.getElementById("intro-avatar-container");
        if (introAvatar) {
          introAvatar.innerHTML = cleanedHTML;
        }
      }

      const badgeName = document.getElementById("badge-name-display");
      if (badgeName) badgeName.innerText = (nameVal || "AGENTE ANÔNIMO").toUpperCase();

      const badgeAge = document.getElementById("badge-age-display");
      if (badgeAge) badgeAge.innerText = ageVal ? `IDADE: ${ageVal} ANOS` : "IDADE: -- ANOS";

      const cargoEl = document.querySelector(".police-badge-frame .badge-title");
      if (cargoEl) cargoEl.innerText = "CARGO: DETETIVE";

      const headerName = document.getElementById("header-detective-name");
      if (headerName) {
        headerName.innerText = `DETETIVE: ${(nameVal || "ANÔNIMO").toUpperCase()}`;
      }
    }

    // Abas superiores de navegação
    renderNavigation() {
      const navContainer = document.getElementById("hud-nav-list");
      if (!navContainer) return;

      navContainer.innerHTML = "";
      GAME_DATA.stages.forEach(stage => {
        let label = stage.name;
        if (stage.id === 1 && Engine.state.investigatorName && Engine.state.investigatorNameSaved) {
          label = `DETETIVE ${Engine.state.investigatorName}`.toUpperCase();
        }

        const li = document.createElement("li");
        li.className = `nav-item stage-btn-${stage.id}`;
        li.innerHTML = `
          <button onclick="Engine.setStage(${stage.id})" class="nav-button">
            <span class="nav-num">0${stage.id}</span>
            <span class="nav-label">${label}</span>
          </button>
        `;
        navContainer.appendChild(li);
      });
    }

    bindGlobalEvents() {
      document.addEventListener("stageChanged", (e) => {
        this.switchStage(e.detail.stage);
      });

      document.addEventListener("clueUnlocked", () => {
        this.renderInventory();
        this.updateHUD();
      });

      document.addEventListener("bodyMarkerExamined", () => {
        this.updateHUD();
      });

      document.addEventListener("phoneUnlocked", () => {
        this.renderSmartphoneUI();
        this.updateHUD();
      });

      const muteBtn = document.getElementById("hud-mute");
      if (muteBtn) {
        muteBtn.addEventListener("click", () => {
          const isMuted = Engine.toggleMute();
          muteBtn.innerHTML = isMuted ? "🔇 MUDO" : "🔊 SOM";
          muteBtn.classList.toggle("muted", isMuted);
        });
        muteBtn.innerHTML = Engine.state.isMuted ? "🔇 MUDO" : "🔊 SOM";
      }

      const resetBtn = document.getElementById("hud-reset");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          if (confirm("🚨 APAGAR DADOS FORENSES? Todos os registros, pistas e notas digitais serão resetados.")) {
            Engine.resetGame();
          }
        });
      }

      // Initialize investigator details on page load if saved
      const cargoLabel = document.getElementById("intro-cargo-label");
      if (cargoLabel && Engine.state.investigatorName && Engine.state.investigatorNameSaved) {
        cargoLabel.innerText = `DETETIVE: ${Engine.state.investigatorName}`.toUpperCase();
      }
    }

    updateHUD() {
      const progressText = document.getElementById("hud-clue-progress");
      if (progressText) {
        const total = Object.keys(GAME_DATA.clues).length;
        const unlocked = Engine.state.unlockedClues.length;
        progressText.innerText = `PISTAS 3D: ${unlocked}/${total}`;
      }

      const caseTag = document.getElementById("hud-case-tag");
      if (caseTag) {
        if (Engine.state.investigatorName && Engine.state.investigatorNameSaved) {
          caseTag.innerText = `DETETIVE ${Engine.state.investigatorName}`.toUpperCase();
        } else {
          caseTag.innerText = "CONEXÃO ATIVA";
        }
      }

      const progressBar = document.getElementById("hud-progress-fill");
      if (progressBar) {
        const maxStage = Engine.getMaxStageReached();
        const pct = (maxStage / 8) * 100;
        progressBar.style.width = `${pct}%`;
      }

      const maxUnlockedStage = Engine.getMaxStageReached();
      GAME_DATA.stages.forEach(stage => {
        const btn = document.querySelector(`.stage-btn-${stage.id}`);
        if (btn) {
          btn.classList.remove("active", "locked");
          if (stage.id === Engine.state.currentStage) btn.classList.add("active");
          if (stage.id > maxUnlockedStage + 1) btn.classList.add("locked");
        }
      });

      this.renderInventory();
    }

    switchStage(stageNum) {
      if (window.Sound) window.Sound.playKeypress();
      
      document.querySelectorAll(".stage-container").forEach(c => c.classList.remove("active"));

      const activeStageKey = GAME_DATA.stages.find(s => s.id === stageNum)?.key;
      const activeContainer = document.getElementById(`stage-${activeStageKey}`);
      if (activeContainer) {
        activeContainer.classList.add("active");
        activeContainer.scrollTop = 0;
      }

      this.updateHUD();

      // Remove loops e renderizadores anteriores para economizar GPU
      this.destroyThreeJS();

      switch (stageNum) {
        case 1: this.initStageIdentification(); break;
        case 2: this.initStageIntro(); break;
        case 3: this.initStageCrimeScene3D(); break;
        case 4: this.initStageAutopsy3D(); break;
        case 5: this.initStageSuspects(); break;
        case 6: this.initStageInterrogations(); break;
        case 7: this.initStagePhoneBypass(); break;
        case 8: this.initStageAccusation(); break;
      }
    }

    destroyThreeJS() {
      this.kitchenRenderer = null;
      this.bodyRenderer = null;
      this._bodyAnimActive = false;
      this._bodyControls = null;
    }

    // ==============================================================
    // 0. IDENTIFICAÇÃO (Etapa 1)
    // ==============================================================
    initStageIdentification() {
      const nameInput = document.getElementById("char-name");
      const ageInput = document.getElementById("char-age");
      const saveBtn = document.getElementById("create-char-btn");
      const hatCheckbox = document.getElementById("char-acc-hat");
      const glassesCheckbox = document.getElementById("char-acc-glasses");
      const mustacheCheckbox = document.getElementById("char-acc-mustache");
      const skinBtns = document.querySelectorAll(".skin-btn");
      const outfitBtns = document.querySelectorAll(".outfit-picker-grid .outfit-btn");
      const genderBtns = document.querySelectorAll(".gender-picker .gender-btn");
      const hairTypeBtns = document.querySelectorAll(".hair-type-picker .hair-type-btn");

      if (!nameInput || !ageInput) return;

      const updateAvatarPreview = () => {
        this.syncAvatar();
      };

      // Set initial values from state
      nameInput.value = Engine.state.investigatorName || "";
      ageInput.value = Engine.state.charAge || "28";
      hatCheckbox.checked = Engine.state.charHat !== false;
      glassesCheckbox.checked = Engine.state.charGlasses !== false;
      mustacheCheckbox.checked = !!Engine.state.charMustache;

      // Set active button highlights from state
      skinBtns.forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-color") === Engine.state.charSkinColor);
      });
      outfitBtns.forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-outfit") === Engine.state.charOutfit);
      });
      genderBtns.forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-gender") === Engine.state.charGender);
      });
      hairTypeBtns.forEach(btn => {
        btn.classList.toggle("active", btn.getAttribute("data-hair-type") === Engine.state.charHairType);
      });

      // Bind skin color button clicks
      skinBtns.forEach(btn => {
        btn.onclick = () => {
          if (Engine.state.investigatorNameSaved) return;
          Engine.state.charSkinColor = btn.getAttribute("data-color");
          skinBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          updateAvatarPreview();
          if (window.Sound) window.Sound.playKeypress();
        };
      });

      // Bind outfit button clicks
      outfitBtns.forEach(btn => {
        btn.onclick = () => {
          if (Engine.state.investigatorNameSaved) return;
          Engine.state.charOutfit = btn.getAttribute("data-outfit");
          outfitBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          updateAvatarPreview();
          if (window.Sound) window.Sound.playKeypress();
        };
      });

      // Bind gender button clicks
      genderBtns.forEach(btn => {
        btn.onclick = () => {
          if (Engine.state.investigatorNameSaved) return;
          Engine.state.charGender = btn.getAttribute("data-gender");
          genderBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          updateAvatarPreview();
          if (window.Sound) window.Sound.playKeypress();
        };
      });

      // Bind hair type button clicks
      hairTypeBtns.forEach(btn => {
        btn.onclick = () => {
          if (Engine.state.investigatorNameSaved) return;
          Engine.state.charHairType = btn.getAttribute("data-hair-type");
          hairTypeBtns.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          updateAvatarPreview();
          if (window.Sound) window.Sound.playKeypress();
        };
      });

      // Bind accessory checkbox changes
      [hatCheckbox, glassesCheckbox, mustacheCheckbox].forEach(cb => {
        cb.onchange = () => {
          if (Engine.state.investigatorNameSaved) {
            cb.checked = !cb.checked; // Revert
            return;
          }
          Engine.state.charHat = hatCheckbox.checked;
          Engine.state.charGlasses = glassesCheckbox.checked;
          Engine.state.charMustache = mustacheCheckbox.checked;
          updateAvatarPreview();
          if (window.Sound) window.Sound.playKeypress();
        };
      });

      // Bind text and number changes
      nameInput.oninput = () => {
        if (Engine.state.investigatorNameSaved) return;
        nameInput.value = nameInput.value.substring(0, 12);
        Engine.state.investigatorName = nameInput.value;
        updateAvatarPreview();
      };

      ageInput.oninput = () => {
        if (Engine.state.investigatorNameSaved) return;
        Engine.state.charAge = ageInput.value;
        updateAvatarPreview();
      };

      // Handle Save click
      if (saveBtn) {
        saveBtn.onclick = () => {
          const typedName = nameInput.value.trim().substring(0, 12);
          const typedAge = parseInt(ageInput.value);

          if (!typedName) {
            if (window.Sound) window.Sound.playError();
            alert("Por favor, digite seu nome de detetive.");
            return;
          }

          if (isNaN(typedAge) || typedAge < 1 || typedAge > 99) {
            if (window.Sound) window.Sound.playError();
            alert("Por favor, digite uma idade válida (entre 1 e 99 anos).");
            return;
          }

          // Lock choices
          Engine.state.investigatorName = typedName;
          Engine.state.charAge = typedAge.toString();
          Engine.state.investigatorNameSaved = true;
          Engine.saveGame();

          // Disable form elements
          nameInput.readOnly = true;
          ageInput.readOnly = true;
          hatCheckbox.disabled = true;
          glassesCheckbox.disabled = true;
          mustacheCheckbox.disabled = true;
          skinBtns.forEach(btn => btn.disabled = true);
          outfitBtns.forEach(btn => btn.disabled = true);
          genderBtns.forEach(btn => btn.disabled = true);
          hairTypeBtns.forEach(btn => btn.disabled = true);
          saveBtn.style.display = "none";

          // Update HUD headers
          this.renderNavigation();
          this.updateHUD();

          const cargoLabel = document.getElementById("intro-cargo-label");
          if (cargoLabel) {
            cargoLabel.innerText = `DETETIVE: ${typedName}`.toUpperCase();
          }

          if (window.Sound) window.Sound.playSuccess();
          Engine.notify("Distintivo emitido! Bem-vindo ao caso, Detetive.", "success");

          // Advance to Introduction automatically
          setTimeout(() => {
            Engine.setStage(2);
          }, 1000);
        };
      }

      // Initial render of preview
      updateAvatarPreview();

      // If already saved, lock everything
      if (Engine.state.investigatorNameSaved) {
        nameInput.readOnly = true;
        ageInput.readOnly = true;
        hatCheckbox.disabled = true;
        glassesCheckbox.disabled = true;
        mustacheCheckbox.disabled = true;
        skinBtns.forEach(btn => btn.disabled = true);
        outfitBtns.forEach(btn => btn.disabled = true);
        genderBtns.forEach(btn => btn.disabled = true);
        hairTypeBtns.forEach(btn => btn.disabled = true);
        if (saveBtn) saveBtn.style.display = "none";
      }
    }

    // ==============================================================
    // 1. INTRODUÇÃO (Etapa 2)
    // ==============================================================
    initStageIntro() {
      const textTarget = document.getElementById("intro-narrative-text");
      if (!textTarget) return;

      if (textTarget.innerHTML !== "") return;

      const narrative = `"Fui acionado às 03h27 da madrugada do dia 11 de setembro de 2023 para atender uma ocorrência de possível homicídio em um apartamento localizado no bairro Cidade Jardim.\n\n` +
        `Ao chegar ao local juntamente com a equipe pericial, encontramos a vítima, Daniela Alborghetti, de 23 anos, caída no chão da cozinha. O corpo encontrava-se em posição incomum, cuidadosamente alinhado, sem sinais aparentes de movimentação posterior ao óbito.\n\n` +
        `Chamou a atenção da equipe a presença de uma rosa negra posicionada sobre o peito da vítima. Também foi constatada a ausência de sinais de arrombamento, indicando inicialmente que a vítima provavelmente conhecia o autor ou autores do crime.\n\n` +
        `Durante a inspeção preliminar foram identificados vestígios de sangue próximos ao corpo, além de fragmentos de uma taça de vidro quebrada encontrados na cozinha.\n\n` +
        `As primeiras diligências incluíram o isolamento da área, coleta de evidências, identificação de testemunhas e o encaminhamento do corpo ao Instituto Médico Legal.\n\n` +
        `Ao longo das investigações foram ouvidas diversas pessoas próximas à vítima, incluindo familiares, amigos e pessoas com quem ela mantinha relacionamento recente ou anterior.\n\n` +
        `Os depoimentos apresentaram divergências relevantes, especialmente quanto aos horários, às últimas interações com a vítima e aos acontecimentos da noite do crime.\n\n` +
        `Até o presente momento, as evidências apontam para um homicídio ocorrido entre meia-noite e duas horas da manhã. A investigação permanece em andamento e novas informações poderão alterar as linhas investigativas atualmente consideradas.\n\n` +
        `Nenhuma hipótese foi descartada."`;

      this.typeWriterEffect(textTarget, narrative, 12, () => {
        const startBtn = document.getElementById("intro-start-btn");
        if (startBtn) {
          startBtn.disabled = false; // Enable start button after narrative
        }
      });
    }

    // Método utilitário para carregar arquivos 3D GLB/GLTF com suporte a fallback de erro
    loadGLBModel(path, parentGroup, scaleTarget = null, position = null, rotation = null, callback = null, errorCallback = null) {
      if (typeof THREE === "undefined" || typeof THREE.GLTFLoader === "undefined") return;
      const loader = new THREE.GLTFLoader();
      loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          if (scaleTarget) {
            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            box.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);
            if (maxDim > 0) {
              const scale = scaleTarget / maxDim;
              model.scale.set(scale, scale, scale);
            }
          }
          if (position) model.position.copy(position);
          if (rotation) model.rotation.copy(rotation);
          
          model.traverse(child => {
            if (child.isMesh) {
              if (child.material) {
                child.material.roughness = 0.6;
                child.material.metalness = 0.1;
              }
            }
          });
          
          parentGroup.add(model);
          if (callback) callback(model);
        },
        undefined,
        (error) => {
          console.error("Erro ao carregar o modelo 3D GLB:", path, error);
          if (errorCallback) errorCallback(error);
        }
      );
    }

    // ==============================================================
    // 2. CENA DO CRIME 3D (Etapa 2)
    // ==============================================================
    initStageCrimeScene3D() {
      this.renderInventory();
      const container = document.getElementById("crime-scene-3d-container");
      if (!container) return;

      container.innerHTML = ""; // Limpa anterior

      if (typeof THREE === "undefined" || typeof THREE.GLTFLoader === "undefined") {
        this.initFallback2DKitchen(container);
        return;
      }

      try {
        const width = container.clientWidth;
        const height = container.clientHeight || 280;

        // Cena, Câmera e Renderizador - Sem Sombras (Alta Performance)
        this.kitchenScene = new THREE.Scene();
        this.kitchenScene.background = new THREE.Color(0xffffea);
        this.kitchenScene.fog = new THREE.FogExp2(0xffffea, 0.05);

        this.kitchenCamera = new THREE.PerspectiveCamera(50, width / height, 0.01, 100);
        this.kitchenCamera.position.set(0.1, 1.5, 0.2); // inside the room, near the table (eye level Y=1.5)

        this.kitchenRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.kitchenRenderer.setSize(width, height);
        this.kitchenRenderer.shadowMap.enabled = false;
        container.appendChild(this.kitchenRenderer.domElement);

        // OrbitControls do Three.js (Móveis e com Zoom Habilitado)
        const controls = new THREE.OrbitControls(this.kitchenCamera, this.kitchenRenderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = true; // Zoom Habilitado
        controls.enablePan = false; 
        controls.minDistance = 0.3; // Limite de zoom aproximado
        controls.maxDistance = 5.0; // Limite de zoom afastado
        
        // Foca o ponto de rotação e zoom diretamente no corpo e na Rosa Negra
        controls.target.set(1.3, 0.1, 0.1);

        // Luzes Brilhantes Uniformes (Sem Sombras)
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
        this.kitchenScene.add(ambientLight);

        const spotlight = new THREE.SpotLight(0xffffff, 4);
        spotlight.position.set(0, 8, 2);
        spotlight.angle = Math.PI / 3;
        this.kitchenScene.add(spotlight);

        const warningLight = new THREE.PointLight(0xffcc00, 1.5, 10);
        warningLight.position.set(0, 2.5, 0);
        this.kitchenScene.add(warningLight);





        // Grupo para armazenar os modelos e hotspots
        const kitchenGroup = new THREE.Group();
        this.kitchenScene.add(kitchenGroup);

        // ==========================================================
        // CARREGAMENTO DOS ARQUIVOS GLB DO USUÁRIO
        // ==========================================================
        
        // 1. Cozinha 3D Completa (Cenário de Fundo)
        // Se falhar (por ser .skp), carrega a cozinha holográfica processual forense automatizada!
        this.loadGLBModel(
          "./cozinha_3d_modelo_completa.glb", 
          kitchenGroup, 
          10.0, 
          new THREE.Vector3(0, 0, 0), 
          new THREE.Euler(0, 0, 0),
          (model) => {
            // Auto-center the kitchen model so its floor is at y=0 and it is centered at (0, 0)
            const box = new THREE.Box3().setFromObject(model);
            const center = new THREE.Vector3();
            box.getCenter(center);
            model.position.x = -center.x;
            model.position.z = -center.z;
            model.position.y = -box.min.y; // Align floor to y=0
            console.log("Cozinha 3D real carregada e centrada com sucesso!");
          },
          (err) => {
            console.log("Cozinha em GLB ausente. Gerando ambiente forense holográfico a partir do .skp...");
            this.buildProceduralForenseKitchen(kitchenGroup);
          }
        );

        // Posicionando as pistas 3D conforme solicitado pelo Investigador:
        // As pistas já estão coletadas em segundo plano, mas apenas a Rosa Negra 3D é renderizada na cena.
        setTimeout(() => {
          Engine.unlockClue("taca_quebrada");
          Engine.unlockClue("celular_vitima");
          Engine.unlockClue("rosa_negra");
        }, 1000);

        // Adicionando o corpo 3D da vítima na horizontal na parte inferior da visão da câmera, movido para a esquerda e rotacionado 90 graus.
        this.loadGLBModel(
          "modelo_3d_de_mulher_loira.glb",
          kitchenGroup,
          1.7, 
          new THREE.Vector3(1.3, 0.1, 0.1), // Posição (no chão, mais à esquerda)
          new THREE.Euler(-Math.PI / 2, 1.4, Math.PI / 1 ) // Rotação horizontal virada em 90 graus
        );

        // Adicionando a Rosa Negra perto do corpo 3D na cena do crime, com orientação em 90 graus (escala reduzida).
        this.loadGLBModel(
          "Flor.glb",
          kitchenGroup,
          0.2, 
          new THREE.Vector3(1.3, 0.29, 0.2), // Posição (perto do corpo)
          new THREE.Euler(1, Math.PI / 1, 0), // Orientação em 90 graus
          (model) => {
            model.traverse(child => {
              if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x050505,
                  roughness: 0.95,
                  metalness: 0.0
                });
              }
            });
          }
        );

        // Adicionando o Celular na cena 3D, rotacionado em 90 graus
        this.loadGLBModel(
          "Celular.glb",
          kitchenGroup,
          0.25,
          new THREE.Vector3(-0.5, 1.01, 0),
          new THREE.Euler(0, Math.PI / 2, 0) // Rotação de 90 graus
        );

        // Adicionando o Vidro na cena 3D, rotacionado em 90 graus
        this.loadGLBModel(
          "Vidro.glb",
          kitchenGroup,
          0.25,
          new THREE.Vector3(0.7, 0.01, 1.2),
          new THREE.Euler(1, Math.PI / 1, 0) // Rotação de 90 graus
        );

        // Lógica de alternância de câmeras fixas
        const cameraButtons = document.querySelectorAll(".camera-btn");
        
        // Reset state on load
        cameraButtons.forEach(b => {
          const camType = b.getAttribute("data-camera");
          if (camType === "corpo") {
            b.classList.add("active");
            b.style.background = "rgba(255, 51, 51, 0.2)";
            b.style.borderColor = "#ff3333";
            b.style.color = "white";
          } else {
            b.classList.remove("active");
            b.style.background = "rgba(255, 255, 255, 0.05)";
            b.style.borderColor = "rgba(255, 255, 255, 0.2)";
            b.style.color = "#ccc";
          }
        });

        cameraButtons.forEach(btn => {
          btn.addEventListener("click", (e) => {
            if (window.Sound) window.Sound.playKeypress();
            
            // Remove active class from all
            cameraButtons.forEach(b => {
              b.classList.remove("active");
              b.style.background = "rgba(255, 255, 255, 0.05)";
              b.style.borderColor = "rgba(255, 255, 255, 0.2)";
              b.style.color = "#ccc";
            });

            // Add active class to clicked
            btn.classList.add("active");
            btn.style.background = "rgba(255, 51, 51, 0.2)";
            btn.style.borderColor = "#ff3333";
            btn.style.color = "white";

            const camType = btn.getAttribute("data-camera");
            if (camType === "corpo") {
              controls.target.set(1.3, 0.1, 0.1);
              this.kitchenCamera.position.set(0.1, 1.5, 0.2);
            } else if (camType === "celular") {
              controls.target.set(-0.5, 1.01, 0);
              this.kitchenCamera.position.set(-0.5, 1.6, 0.8);
            } else if (camType === "vidro") {
              controls.target.set(0.7, 0.01, 1.2);
              this.kitchenCamera.position.set(0.7, 0.8, 2.0);
            }
            controls.update();
          });
        });

        // Loop de Animação
        const animate = () => {
          if (!this.kitchenRenderer) return;
          requestAnimationFrame(animate);

          controls.update();
          this.kitchenRenderer.render(this.kitchenScene, this.kitchenCamera);
        };
        animate();

      } catch (e) {
        console.warn("Falha no WebGL do Three.js. Carregando Fallback 2D.", e);
        this.initFallback2DKitchen(container);
      }
    }

    // Cria um lindo cenário virtual de Cozinha Forense em tempo real se o GLB principal estiver ausente
    // (Compatibilidade com SketchUp .skp e prevenção de erros de renderização)
    buildProceduralForenseKitchen(parentGroup) {
      if (typeof THREE === "undefined") return;

      // 1. Piso Tecnológico da Cozinha
      const floorGeo = new THREE.PlaneGeometry(10, 10);
      const floorMat = new THREE.MeshStandardMaterial({ 
        color: 0x090c12, 
        roughness: 0.65, 
        metalness: 0.25 
      });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = 0;
      parentGroup.add(floor);

      // Radar / Grid Poligonal do Decap OS no Piso para Mapeamento Virtual
      const grid = new THREE.GridHelper(10, 20, 0xff3333, 0x1f2733);
      grid.position.y = 0.002;
      parentGroup.add(grid);

      // 2. MESA DE JANTAR FORENSE (onde o Laptop "celular_vitima" fica posicionado)
      const mesaGroup = new THREE.Group();
      mesaGroup.position.set(0, 0, 0); // Exato centro da cozinha

      // Tampo da mesa metálico forense (Y = 0.75 de altura)
      const tampoGeo = new THREE.BoxGeometry(2.0, 0.04, 1.1);
      const tampoMat = new THREE.MeshStandardMaterial({ color: 0x1a233a, roughness: 0.15, metalness: 0.85 });
      const tampo = new THREE.Mesh(tampoGeo, tampoMat);
      tampo.position.y = 0.75;
      mesaGroup.add(tampo);

      // Pernas tubulares cromadas da mesa (4 pernas)
      const pernaGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.75, 12);
      const pernaMat = new THREE.MeshStandardMaterial({ color: 0x5d6d7e, roughness: 0.2, metalness: 0.90 });
      
      const pernasCoordenadas = [
        [-0.9, 0.375, -0.45],
        [0.9, 0.375, -0.45],
        [-0.9, 0.375, 0.45],
        [0.9, 0.375, 0.45]
      ];
      
      pernasCoordenadas.forEach(coord => {
        const perna = new THREE.Mesh(pernaGeo, pernaMat);
        perna.position.set(coord[0], coord[1], coord[2]);
        mesaGroup.add(perna);
      });
      parentGroup.add(mesaGroup);

      // 3. BALCÃO DE MÁRMORE (onde a Taça "taca_quebrada" fica posicionada)
      const balcaoGroup = new THREE.Group();
      balcaoGroup.position.set(-2.0, 0, -1.8); // Ao fundo e à esquerda do centro

      // Base em MDF escuro
      const baseGeo = new THREE.BoxGeometry(1.6, 0.90, 0.8);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x0f1118, roughness: 0.70, metalness: 0.1 });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.45;
      balcaoGroup.add(baseMesh);

      // Tampo de Mármore forense brilhante
      const tampoBalcaoGeo = new THREE.BoxGeometry(1.65, 0.04, 0.85);
      const tampoBalcaoMat = new THREE.MeshStandardMaterial({ color: 0x34495e, roughness: 0.1, metalness: 0.4 });
      const tampoBalcao = new THREE.Mesh(tampoBalcaoGeo, tampoBalcaoMat);
      tampoBalcao.position.y = 0.90;
      balcaoGroup.add(tampoBalcao);
      parentGroup.add(balcaoGroup);

      // 4. Toast e Dica no Console de Desenvolvimento ensinando o Investigador
      setTimeout(() => {
        Engine.notify("📐 Arquivo '.skp' detectado! Mapeador 3D gerou a Cozinha Forense Virtual.", "info");
      }, 1500);
    }

    // Fallback 2D de Alta Resolução se Three.js quebrar
    initFallback2DKitchen(container) {

      container.innerHTML = `
        <div class="glass" style="margin:0; height:100%; border: 1px dashed var(--color-yellow); display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
          <span style="font-size:2rem; margin-bottom:10px;">📐</span>
          <strong style="color:var(--color-yellow)">CENA 2D FORENSE (FALLBACK)</strong>
          <p style="font-size:0.75rem; margin:10px 0;">O WebGL não pôde ser ativado. Use a lista abaixo para analisar as pistas coletadas fisicamente na mesa.</p>
          <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; padding:10px;">
            ${Object.keys(GAME_DATA.clues).map(key => `
              <button class="glass-btn" style="font-size:0.7rem; padding:6px 10px;" onclick="UI.inspectClue('${key}')">🔍 ${GAME_DATA.clues[key].name}</button>
            `).join("")}
          </div>
        </div>
      `;
    }

    inspectClue(clueId) {
      const clue = GAME_DATA.clues[clueId];
      if (!clue) return;

      Engine.unlockClue(clueId);

      const modal = document.getElementById("clue-modal");
      const modalTitle = document.getElementById("clue-modal-title");
      const modalCategory = document.getElementById("clue-modal-category");
      const modalDesc = document.getElementById("clue-modal-desc");
      const modalDetails = document.getElementById("clue-modal-details");
      const canvas3d = document.getElementById("clue-inspect-3d-canvas");

      if (modal && modalTitle && modalDesc) {
        modalTitle.innerText = clue.name;
        modalCategory.className = `clue-tag tag-${clue.category}`;
        modalCategory.innerText = clue.category.toUpperCase();
        modalDesc.innerText = clue.description;

        if (clue.details) {
          modalDetails.innerHTML = `<div class="unlocked-details"><strong>🔎 DIRETRIZ FORENSE DIGITAL:</strong><br>${clue.details}</div>`;
        } else {
          modalDetails.innerHTML = "";
        }

        modal.classList.add("active");

        // Inicia close-up 3D giratório no modal
        this.initInspect3DClue(clueId, canvas3d);
      }
    }

    // Modelagem e Renderização de Closeup 3D rotacionável da Pista (com GLB correspondente)
    initInspect3DClue(clueId, canvasContainer) {
      if (!canvasContainer) return;
      canvasContainer.innerHTML = "";

      if (typeof THREE === "undefined") return;

      try {
        const width = canvasContainer.clientWidth || 200;
        const height = canvasContainer.clientHeight || 200;

        this.inspectScene = new THREE.Scene();
        this.inspectScene.background = new THREE.Color(0xffffea);

        this.inspectCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 10);
        this.inspectCamera.position.set(0, 0, 3);

        this.inspectRenderer = new THREE.WebGLRenderer({ antialias: true });
        this.inspectRenderer.setSize(width, height);
        canvasContainer.appendChild(this.inspectRenderer.domElement);

        const light1 = new THREE.AmbientLight(0xffffff, 1.2);
        const light2 = new THREE.PointLight(0xffcc00, 1.8, 10);
        light2.position.set(2, 2, 2);
        this.inspectScene.add(light1, light2);

        this.inspectMesh = new THREE.Group();
        this.inspectScene.add(this.inspectMesh);

        // Carrega o GLB correspondente com base na pista para closeup rotacionável
        if (clueId === "rosa_negra") {
          this.loadGLBModel("Flor.glb", this.inspectMesh, 1.3, null, null, (model) => {
            model.traverse(child => {
              if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({
                  color: 0x050505,
                  roughness: 0.95,
                  metalness: 0.0
                });
              }
            });
          });
        } else if (clueId === "taca_quebrada") {
          this.loadGLBModel("Vidro.glb", this.inspectMesh, 1.0);
        } else if (clueId === "celular_vitima") {
          this.loadGLBModel("Celular.glb", this.inspectMesh, 1.2);
        } else {
          // Fallbacks baseados em primitivas para itens secundários
          let geom, mat;
          if (clueId === "marcas_chao") {
            geom = new THREE.BoxGeometry(0.7, 0.05, 0.7);
            mat = new THREE.MeshStandardMaterial({ color: 0x22242a, roughness: 0.9 });
            const markerMesh = new THREE.Mesh(geom, mat);
            this.inspectMesh.add(markerMesh);
          } else if (clueId === "manchas_sangue") {
            geom = new THREE.SphereGeometry(0.3, 16, 16);
            mat = new THREE.MeshStandardMaterial({ color: 0x7b0000, roughness: 0.2 });
            const markerMesh = new THREE.Mesh(geom, mat);
            markerMesh.scale.set(1.2, 0.4, 0.8);
            this.inspectMesh.add(markerMesh);
          } else {
            geom = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 16);
            mat = new THREE.MeshStandardMaterial({ color: 0x5d6d7e });
            const markerMesh = new THREE.Mesh(geom, mat);
            this.inspectMesh.add(markerMesh);
          }
        }

        // Drag para girar a pista no modal
        let isDragging = false;
        let startX = 0;
        
        canvasContainer.onmousedown = (e) => { isDragging = true; startX = e.clientX; };
        window.addEventListener("mousemove", (e) => {
          if (!isDragging || !this.inspectMesh) return;
          const dx = e.clientX - startX;
          this.inspectMesh.rotation.y += dx * 0.01;
          this.inspectMesh.rotation.x += (e.clientY - startX) * 0.001; // rotação X sutil
          startX = e.clientX;
        });
        window.addEventListener("mouseup", () => { isDragging = false; });

        // Touch
        canvasContainer.ontouchstart = (e) => { if (e.touches.length === 1) { isDragging = true; startX = e.touches[0].clientX; } };
        canvasContainer.ontouchmove = (e) => {
          if (!isDragging || !this.inspectMesh || e.touches.length !== 1) return;
          const dx = e.touches[0].clientX - startX;
          this.inspectMesh.rotation.y += dx * 0.01;
          startX = e.touches[0].clientX;
        };
        canvasContainer.ontouchend = () => { isDragging = false; };

        const anim = () => {
          if (!this.inspectRenderer) return;
          requestAnimationFrame(anim);
          
          // Rotação passiva suave
          if (!isDragging && this.inspectMesh) {
            this.inspectMesh.rotation.y += 0.006;
          }

          this.inspectRenderer.render(this.inspectScene, this.inspectCamera);
        };
        anim();

      } catch (e) {
        console.warn("Falha no closeup 3D da pista.", e);
      }
    }

    closeClueModal() {
      const modal = document.getElementById("clue-modal");
      if (modal) {
        modal.classList.remove("active");
        if (window.Sound) window.Sound.playKeypress();
        this.inspectRenderer = null; // Libera recurso do close-up
      }
    }

    toggleInventory() {
      const list = document.getElementById("inventory-list");
      const btn = document.getElementById("toggle-inventory-btn");
      if (!list || !btn) return;

      if (list.style.display === "none") {
        list.style.display = "flex";
        btn.innerText = "Ocultar";
      } else {
        list.style.display = "none";
        btn.innerText = "Mostrar";
      }
      if (window.Sound) window.Sound.playBeep();
    }

    renderInventory() {
      const invContainer = document.getElementById("inventory-list");
      if (!invContainer) return;

      invContainer.innerHTML = "";
      if (Engine.state.unlockedClues.length === 0) {
        invContainer.innerHTML = `<div class="empty-inv">Nenhuma evidência coletada na cena do crime 3D ainda.</div>`;
        return;
      }

      Engine.state.unlockedClues.forEach(clueId => {
        const clue = GAME_DATA.clues[clueId];
        if (!clue) return;

        const card = document.createElement("div");
        card.className = `clue-item-card`;
        card.innerHTML = `
          <div class="clue-item-header">
            <span class="clue-tag tag-${clue.category}">${clue.category.substring(0,3).toUpperCase()}</span>
            <strong class="clue-item-name">${clue.name}</strong>
          </div>
          <button class="clue-inspect-btn" onclick="UI.inspectClue('${clueId}')">INSPECIONAR 3D</button>
        `;
        invContainer.appendChild(card);
      });
    }

    // ==============================================================
    // 3. LAUDO DA AUTÓPSIA 3D (Etapa 3)
    // ==============================================================
    initStageAutopsy3D() {
      const reportText = document.getElementById("autopsy-general-intro");
      if (reportText) reportText.innerHTML = GAME_DATA.autopsy.general;

      const canvasContainer = document.getElementById("autopsy-3d-canvas-container");
      if (!canvasContainer) return;

      // Build tabbed layout
      canvasContainer.innerHTML = `
        <div class="autopsy-tab-bar">
          <button class="autopsy-tab active" id="tab-3d-btn" onclick="UI.switchAutopsyTab('3d')">🧬 CORPO 3D</button>
          <button class="autopsy-tab" id="tab-report-btn" onclick="UI.switchAutopsyTab('report')">📋 LAUDO TÉCNICO</button>
        </div>
        <div id="autopsy-tab-3d" class="autopsy-tab-content">
          <div id="body-3d-render" style="width:100%;height:320px;position:relative;"></div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:6px;flex-wrap:wrap;">
            <span style="color:#aaa;font-size:0.7rem;font-family:monospace;">MOVER CORPO:</span>
            <label style="color:#888;font-size:0.7rem;">X</label>
            <input type="number" id="body-pos-x" step="0.1" value="0" style="width:48px;background:#111;color:#eee;border:1px solid #444;padding:2px 4px;border-radius:4px;font-size:0.7rem;">
            <label style="color:#888;font-size:0.7rem;">Y</label>
            <input type="number" id="body-pos-y" step="0.1" value="0" style="width:48px;background:#111;color:#eee;border:1px solid #444;padding:2px 4px;border-radius:4px;font-size:0.7rem;">
            <label style="color:#888;font-size:0.7rem;">Z</label>
            <input type="number" id="body-pos-z" step="0.1" value="0" style="width:48px;background:#111;color:#eee;border:1px solid #444;padding:2px 4px;border-radius:4px;font-size:0.7rem;">
            <button class="glass-btn" onclick="UI.applyBodyPosition()" style="font-size:0.7rem;padding:4px 10px;">Aplicar</button>
          </div>
          <div style="margin-top:8px;background:rgba(255,51,51,0.07);border:1px solid rgba(255,51,51,0.2);border-radius:6px;padding:8px 12px;font-size:0.72rem;color:#ccc;line-height:1.5;">
            <strong style="color:var(--color-red-bright);">RESUMO MÉDICO-LEGAL:</strong>
            Vítima: Daniela Alborghetti, 23 anos. IML — Laudo Nº 8821/2023.<br>
            🔴 <strong>Pescoço:</strong> Lesão perfurocortante na região cervical anterior (cerca de 3,5 cm).<br>
            🔴 <strong>Coxa direita:</strong> Equimose (hematoma) na face lateral (cerca de 6,0 x 4,0 cm).<br>
            Arraste para orbitar o modelo. Clique nos marcadores para ver o laudo.
          </div>

        </div>
        <div id="autopsy-tab-report" class="autopsy-tab-content" style="display:none;">
          <div style="display:flex;flex-direction:column;gap:6px;padding:8px 0;">
            <button class="glass-btn" onclick="UI.viewAutopsyDetails('neck')">🔴 Pescoço — Lesão Perfurocortante</button>
            <button class="glass-btn" onclick="UI.viewAutopsyDetails('thigh')">🔴 Coxa — Equimose (Hematoma)</button>
          </div>
        </div>

      `;

      this._initBody3DRenderer();
    }

    switchAutopsyTab(tab) {
      const t3d = document.getElementById("autopsy-tab-3d");
      const trep = document.getElementById("autopsy-tab-report");
      const b3d = document.getElementById("tab-3d-btn");
      const brep = document.getElementById("tab-report-btn");
      if (!t3d || !trep) return;

      if (tab === "3d") {
        t3d.style.display = "block";
        trep.style.display = "none";
        if (b3d) b3d.classList.add("active");
        if (brep) brep.classList.remove("active");
        // restart render loop if renderer exists
        if (this._bodyAnimActive === false && this.bodyRenderer) {
          this._bodyAnimActive = true;
          this._bodyAnimLoop();
        }
      } else {
        t3d.style.display = "none";
        trep.style.display = "block";
        if (brep) brep.classList.add("active");
        if (b3d) b3d.classList.remove("active");
        this._bodyAnimActive = false;
      }
    }

    _initBody3DRenderer() {
      this.bodyScale = 1.8; // Novo tamanho do corpo (1.5 vezes de 0.45)
      const renderDiv = document.getElementById("body-3d-render");
      if (!renderDiv) return;

      if (typeof THREE === "undefined" || typeof THREE.GLTFLoader === "undefined") {
        renderDiv.innerHTML = `<div style="display:flex;height:320px;align-items:center;justify-content:center;color:#888;font-size:0.8rem;">⚠️ WebGL não disponível neste navegador.</div>`;
        return;
      }

      renderDiv.innerHTML = `<div style="display:flex;height:320px;align-items:center;justify-content:center;color:#aaa;font-size:0.75rem;font-family:monospace;">⏳ Carregando modelo 3D da vítima...</div>`;

      const width = renderDiv.clientWidth || 400;
      const height = 320;

      // Scene
      this.bodyScene = new THREE.Scene();
      this.bodyScene.background = new THREE.Color(0xffffea);
      this.bodyScene.fog = new THREE.FogExp2(0xffffea, 0.04);

      // Camera – far enough to see the full body head-to-toe
      this.bodyCamera = new THREE.PerspectiveCamera(38, width / height, 0.05, 50);
      this.bodyCamera.position.set(0, 1.6, 2.8);

      // Renderer - No shadows
      this.bodyRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.bodyRenderer.setSize(width, height);
      this.bodyRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.bodyRenderer.shadowMap.enabled = false;
      this.bodyRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.bodyRenderer.toneMappingExposure = 1.2;

      // Clear div and append canvas
      renderDiv.innerHTML = "";
      renderDiv.appendChild(this.bodyRenderer.domElement);

      // OrbitControls – target centre-mass of body
      const controls = new THREE.OrbitControls(this.bodyCamera, this.bodyRenderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minDistance = 2.0;
      controls.maxDistance = 10;
      controls.target.set(0, 0.9, 0);
      controls.update();
      this._bodyControls = controls;

      // Lights - 100% illuminated with bright white uniform light, no shadows
      const ambient = new THREE.AmbientLight(0xffffff, 2.2); // Muito brilhante e uniforme
      this.bodyScene.add(ambient);

      const frontLight = new THREE.DirectionalLight(0xffffff, 1.8);
      frontLight.position.set(0, 4, 6);
      this.bodyScene.add(frontLight);

      const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
      backLight.position.set(0, 4, -6);
      this.bodyScene.add(backLight);

      const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
      topLight.position.set(0, 8, 0);
      this.bodyScene.add(topLight);

      // Autopsy platform - No shadows
      const slabGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.06, 32);
      const slabMat = new THREE.MeshStandardMaterial({ color: 0x1c2f3e, roughness: 0.15, metalness: 0.85 });
      const slab = new THREE.Mesh(slabGeo, slabMat);
      slab.position.set(0, -0.03, 0);
      this.bodyScene.add(slab);

      // Floor reflection plane - No shadows
      const floorGeo = new THREE.PlaneGeometry(12, 12);
      const floorMat = new THREE.MeshStandardMaterial({ color: 0x050608, roughness: 0.9, metalness: 0.1 });
      const floor = new THREE.Mesh(floorGeo, floorMat);
      floor.rotation.x = -Math.PI / 0;
      floor.position.y = -0.12;
      this.bodyScene.add(floor);

      // Body group - Standing upright
      this.bodyMannequin = new THREE.Group();
      this.bodyMannequin.rotation.x = 0;
      this.bodyMannequin.position.set(0, 0, 0);
      this.bodyScene.add(this.bodyMannequin);

      // Load GLB model
      const loader = new THREE.GLTFLoader();
      loader.load(
        "./modelo_3d_de_mulher_loira.glb",
        (gltf) => {
          const model = gltf.scene;
          

          // Auto-scale – use the height axis so the full body (feet to head) fills 1.8 units
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          box.getSize(size);
          const heightDim = size.y > 0 ? size.y : Math.max(size.x, size.y, size.z);
          const targetHeight = this.bodyScale;
          const scale = targetHeight / heightDim;
          model.scale.set(scale, scale, scale);

          // Re-compute box after scale and move feet to y=0
          box.setFromObject(model);
          const center = new THREE.Vector3();
          box.getCenter(center);
          model.position.x = -center.x;
          model.position.z = -center.z;
          model.position.y = -box.min.y; // feet at y=0

          model.traverse(child => {
            if (child.isMesh) {
              if (child.material) {
                child.material.roughness = 0.55;
                child.material.metalness = 0.05;
              }
            }
          });


          this.bodyMannequin.add(model);

          // Add injury markers once model loads
          this._addAutopsyMarkers();
        },
        undefined,
        (err) => {
          console.warn("Erro ao carregar modelo da vítima:", err);
          renderDiv.innerHTML = `<div style="display:flex;height:320px;align-items:center;justify-content:center;flex-direction:column;color:#ff4444;font-size:0.8rem;gap:8px;"><span>⚠️ Falha ao carregar modelo GLB</span><span style="font-size:0.65rem;color:#666;">${err.message || "Verifique o arquivo 'modelo 3d de mulher loira.glb'"}</span></div>`;
        }
      );

      // Start animation loop
      this._bodyAnimActive = true;
      this._bodyAnimLoop();
    }

    _addAutopsyMarkers() {
      if (!this.bodyScene) return;
      this.bodyMarkers = [];

      /**
       * CRIAR SETAS E TEXTOS FLUTUANTES HOLOGRÁFICOS
       * ------------------------------------------------------------------
       * id: ID único da lesão ("neck" ou "thigh").
       * labelText: Nome da ferida exibido na caixinha 3D ("PERFURAÇÃO" ou "HEMATOMA").
       * targetPos: Posição exata da mancha preta no corpo (onde a seta aponta).
       * labelPos: Posição onde a caixa de texto flutuante vai ficar no ar.
       */
      const addCallout = (id, labelText, targetPos, labelPos) => {
        // 1. Criar o Canvas da etiqueta de texto retro-forense
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Fundo escuro semitransparente
        ctx.fillStyle = 'rgba(8, 10, 16, 0.85)';
        ctx.fillRect(0, 0, 256, 64);
        
        // Borda vermelha brilhante de neon
        ctx.strokeStyle = '#ff1111';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, 256, 64);
        
        // Texto
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Fira Code", "Share Tech Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ff1111';
        ctx.shadowBlur = 6;
        ctx.fillText(labelText, 128, 32);
        
        // Gerar a textura a partir do Canvas
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.copy(labelPos);
        sprite.scale.set(0.5, 0.125, 1.0); // Dimensão do box de texto flutuante
        sprite.userData = { markerId: id };
        
        this.bodyMannequin.add(sprite);
        this.bodyMarkers.push(sprite);

        // 2. Criar a seta indicativa (ArrowHelper) que aponta do Texto para o Homicídio
        const direction = new THREE.Vector3().subVectors(targetPos, labelPos).normalize();
        const distance = labelPos.distanceTo(targetPos);
        
        const headLength = 0.08;
        const headWidth = 0.05;
        
        // Criar o auxiliar de seta do ThreeJS
        const arrow = new THREE.ArrowHelper(direction, labelPos, distance, 0xff1111, headLength, headWidth);
        
        // Adiciona IDs aos componentes da seta para torná-los clicáveis
        if (arrow.line) {
          arrow.line.userData = { markerId: id };
          this.bodyMarkers.push(arrow.line);
        }
        if (arrow.cone) {
          arrow.cone.userData = { markerId: id };
          this.bodyMarkers.push(arrow.cone);
        }
        
        this.bodyMannequin.add(arrow);
      };

      // --- MAPEAMENTO E COORDENADAS ---
      // X = Esquerda(-) / Direita(+) | Y = Altura (0.0 a 1.8) | Z = Frente(+) / Costas(-)

      // Fator de escala atual do corpo em relação ao tamanho original de 1.8
      const currentScale = this.bodyScale / 1.8;

      // 🔴 LESÃO 1: PESCOÇO (PERFURAÇÃO)
      const targetPescoco = new THREE.Vector3(0.0, 1.54 * currentScale, 0.08 * currentScale);       // Na mancha do pescoço
      const labelPescoco  = new THREE.Vector3(-0.45 * currentScale, 1.62 * currentScale, 0.15 * currentScale);     // Etiqueta flutuando no ar à esquerda
      addCallout("neck", "PERFURAÇÃO", targetPescoco, labelPescoco);

      // 🔴 LESÃO 2: COXA DIREITA (HEMATOMA DE TAPA)
      const targetCoxa = new THREE.Vector3(0.09 * currentScale, 0.72 * currentScale, 0.12 * currentScale);         // Na mancha da coxa
      const labelCoxa  = new THREE.Vector3(0.55 * currentScale, 0.65 * currentScale, 0.15 * currentScale);         // Etiqueta flutuando no ar à direita
      addCallout("thigh", "HEMATOMA", targetCoxa, labelCoxa);


      // Diferenciação de Clique vs. Arrasto (Drag) para evitar disparar o laudo ao rotacionar
      let dragStartX = 0;
      let dragStartY = 0;

      this.bodyRenderer.domElement.addEventListener("pointerdown", (e) => {
        dragStartX = e.clientX;
        dragStartY = e.clientY;
      });

      this.bodyRenderer.domElement.addEventListener("pointerup", (e) => {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;
        const dragDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Se o usuário arrastou o mouse/dedo por mais de 6 pixels, consideramos
        // que ele estava apenas rotacionando/orbitando a câmera e ignoramos o laudo.
        if (dragDistance > 6) {
          return;
        }

        // Caso contrário, é um clique direto na seta ou caixa de texto!
        if (!this.bodyCamera || !this.bodyMarkers.length) return;
        const rect = this.bodyRenderer.domElement.getBoundingClientRect();
        const mouse = new THREE.Vector2(
          ((e.clientX - rect.left) / rect.width) * 2 - 1,
          -((e.clientY - rect.top) / rect.height) * 2 + 1
        );
        const ray = new THREE.Raycaster();
        ray.setFromCamera(mouse, this.bodyCamera);
        const hits = ray.intersectObjects(this.bodyMarkers);
        if (hits.length > 0) {
          const id = hits[0].object.userData.markerId;
          this.switchAutopsyTab("report");
          this.viewAutopsyDetails(id);
        }
      });
    }

    _bodyAnimLoop() {
      if (!this._bodyAnimActive || !this.bodyRenderer) return;
      requestAnimationFrame(() => this._bodyAnimLoop());

      // Pulse and update holographic markers and indicator arrows
      if (this.bodyMarkers && this.bodyMarkers.length) {
        const t = performance.now() * 0.003;
        this.bodyMarkers.forEach((m, i) => {
          const examined = Engine.state.examinedBodyMarkers?.includes(m.userData.markerId);
          const colorHex = examined ? 0x27ae60 : 0xff1111;

          if (m.isSprite) {
            // Pulse Sprite scale keeping original 0.5 x 0.125 proportion
            const s = 1.0 + Math.sin(t + i * 1.5) * 0.06;
            m.scale.set(0.5 * s, 0.125 * s, 1.0);
            
            if (m.material) {
              m.material.opacity = 0.85 + Math.sin(t * 2) * 0.15; // Suave flicker holográfico
              // Mapeia cor verde se examinado, senão mantém cor natural para ler o texto
              m.material.color.setHex(examined ? 0x27ae60 : 0xffffff);
            }
          } else {
            // Seta (Line ou Cone do ArrowHelper) - Apenas muda de cor (sem pulsar escala para não desmontar)
            if (m.material) {
              m.material.color.setHex(colorHex);
            }
          }
        });
      }


      if (this._bodyControls) this._bodyControls.update();
      if (this.bodyScene && this.bodyCamera) {
        this.bodyRenderer.render(this.bodyScene, this.bodyCamera);
      }
    }

    // Apply body position from XYZ inputs
    applyBodyPosition() {
      const x = parseFloat(document.getElementById('body-pos-x')?.value) || 0;
      const y = parseFloat(document.getElementById('body-pos-y')?.value) || 0;
      const z = parseFloat(document.getElementById('body-pos-z')?.value) || 0;
      if (this.bodyMannequin) {
        this.bodyMannequin.position.set(x, y, z);
      }
    }



    initFallback2DAutopsy(container) {
      container.innerHTML = `
        <div class="glass" style="margin:0; height:100%; border: 1px dashed var(--color-red-bright); display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
          <span style="font-size:2rem; margin-bottom:10px;">🩺</span>
          <strong style="color:var(--color-red-bright)">EXAME ANATÔMICO 2D (FALLBACK)</strong>
          <p style="font-size:0.75rem; margin:10px 0;">Clique nas zonas corporais abaixo para ler as conclusões necroscópicas.</p>
          <div style="display:flex; flex-direction:column; gap:6px; width:100%; padding:10px;">
            <button class="glass-btn" onclick="UI.viewAutopsyDetails('head')">🧠 Nuca (Contusão Traumática)</button>
            <button class="glass-btn" onclick="UI.viewAutopsyDetails('wrist')">🦾 Punho Direito (Escoriação)</button>
            <button class="glass-btn" onclick="UI.viewAutopsyDetails('lips')">👄 Extremidades e Lábios (Cianose)</button>
          </div>
        </div>
      `;
    }

    viewAutopsyDetails(markerId) {
      Engine.examineBodyMarker(markerId);

      const viewer = document.getElementById("autopsy-details-viewer");
      const data = GAME_DATA.autopsy.markers[markerId];
      if (!viewer || !data) return;

      viewer.innerHTML = `
        <div class="doc-view-header">
          <h3>${data.title}</h3>
          <span class="doc-sec-tag">LAUDO TÉCNICO REGISTRADO</span>
        </div>
        <p class="fade-in" style="font-size:0.8rem; line-height:1.5; color:#000000; margin-top:8px;">
          ${data.content}
        </p>
      `;
      if (window.Sound) window.Sound.playGlitch();
    }

    // ==============================================================
    // 4. FICHA DOS SUSPEITOS POLAROID (Etapa 4)
    // ==============================================================
    initStageSuspects() {
      const container = document.getElementById("suspects-grid");
      if (!container) return;

      container.innerHTML = "";
      Object.keys(GAME_DATA.suspects).forEach(key => {
        const suspect = GAME_DATA.suspects[key];
        const level = Engine.state.suspicionLevels[key] || 50;
        const notes = Engine.state.suspectNotes[key] || "";

        const card = document.createElement("div");
        card.className = "suspect-card glass";
        card.innerHTML = `
          <div class="suspect-header">
            <!-- Moldura Polaroid para Imagem Física ou Ator -->
            <div class="polaroid-frame">
              <div class="polaroid-image">
                ${suspect.photo 
                  ? `<img src="${suspect.photo}" style="width: 100%; height: 100%; object-fit: cover;">` 
                  : `<span class="fallback-avatar">${suspect.avatar}</span>`
                }
              </div>
              <div class="polaroid-caption">${suspect.name.split(" ")[0]}</div>
            </div>
            
            <div class="suspect-meta">
              <h3>${suspect.name}</h3>
              <span class="suspect-role">${suspect.role} - ${suspect.age} anos</span>
            </div>
          </div>
          
          <div class="suspect-body">
            <p><strong>Relação:</strong> ${suspect.relation}</p>
            <p><strong>Personalidade:</strong> ${suspect.personality}</p>
            <p><strong>Mapeamento de Motivação:</strong> ${suspect.motive}</p>
            <p><strong>Declaração de Álibi:</strong> ${suspect.alibi}</p>
            
            <div class="suspicion-control">
              <div class="suspicion-label">
                <span>PROBABILIDADE DE CULPA:</span>
                <strong id="suspicion-val-${key}" class="suspicion-percentage">${level}%</strong>
              </div>
              <input type="range" min="0" max="100" value="${level}" 
                class="suspicion-slider slider-${key}" 
                oninput="UI.handleSuspicionChange('${key}', this.value)">
            </div>

            <div class="notes-control">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                <label style="margin:0;">Anotações</label>
                <span id="char-count-${key}" style="font-size:0.6rem; color:var(--color-gray); font-family:var(--font-mono);">${notes.length}/160</span>
              </div>
              <textarea maxlength="160" placeholder="Insira contradições do suspeito com base na mesa física e site..." 
                oninput="document.getElementById('char-count-${key}').innerText = this.value.length + '/160'"
                onchange="UI.handleNoteChange('${key}', this.value)">${notes}</textarea>
            </div>
          </div>
        `;
        container.appendChild(card);
      });
    }

    handleSuspicionChange(suspectId, value) {
      Engine.updateSuspicion(suspectId, value);
      const valIndicator = document.getElementById(`suspicion-val-${suspectId}`);
      if (valIndicator) valIndicator.innerText = `${value}%`;
    }

    handleNoteChange(suspectId, value) {
      Engine.updateNote(suspectId, value);
    }

    // ==============================================================
    // 5. INTERROGATÓRIOS COM IMAGENS (Etapa 5)
    // ==============================================================
    initStageInterrogations() {
      this.renderInterrogationSuspects();
    }

    renderInterrogationSuspects() {
      const listContainer = document.getElementById("interrogation-suspects-list");
      if (!listContainer) return;

      const interrogatedList = Engine.state.interrogatedSuspects || [];
      const counterSpan = document.getElementById("interrogations-count");
      if (counterSpan) {
        counterSpan.innerText = interrogatedList.length;
      }

      listContainer.innerHTML = "";
      Object.keys(GAME_DATA.interrogations).forEach(key => {
        const suspect = GAME_DATA.suspects[key];
        const isInterrogated = interrogatedList.includes(key);
        const limitReached = interrogatedList.length >= 3;
        const isDisabled = !isInterrogated && limitReached;

        const btn = document.createElement("button");
        btn.className = `suspect-interrogate-btn glass-btn ${isInterrogated ? 'active' : ''}`;
        
        if (isDisabled) {
          btn.style.opacity = "0.35";
          btn.style.cursor = "not-allowed";
          btn.title = "Limite de 3 suspeitos atingido";
        } else {
          btn.onclick = () => this.startInterrogationSession(key);
        }

        const avatarHTML = suspect.photo 
          ? `<img src="${suspect.photo}" style="width:28px; height:28px; border-radius:50%; object-fit:cover; border: 1px solid ${isInterrogated ? 'var(--color-yellow)' : 'rgba(255,255,255,0.2)'};">`
          : `<span class="btn-avatar">${suspect.avatar}</span>`;

        const statusHTML = isInterrogated 
          ? `<span style="font-size:0.6rem; color:#27ae60; font-family:var(--font-mono); font-weight:bold;">🟢 ATIVO</span>` 
          : (limitReached ? `<span style="font-size:0.6rem; color:var(--color-gray); font-family:var(--font-mono);">🔒 BLOQUEADO</span>` : `<span style="font-size:0.6rem; color:var(--color-yellow); font-family:var(--font-mono);">⚪ DISPONÍVEL</span>`);

        btn.innerHTML = `
          ${avatarHTML}
          <div class="btn-info" style="flex:1; text-align:left; display:flex; flex-direction:column; justify-content:center; gap:2px; margin-left:8px;">
            <strong style="font-size:0.75rem; color:#000000; display:block; line-height:1.1;">${suspect.name}</strong>
            <span style="font-size:0.58rem; color:var(--color-gray); display:block; line-height:1.1;">${suspect.role}</span>
          </div>
          ${statusHTML}
        `;
        listContainer.appendChild(btn);
      });
    }

    startInterrogationSession(suspectKey) {
      const interrogatedList = Engine.state.interrogatedSuspects || [];
      if (!interrogatedList.includes(suspectKey)) {
        if (interrogatedList.length >= 3) {
          if (window.Sound) window.Sound.playError();
          Engine.notify("Limite atingido: Você só pode interrogar no máximo 3 suspeitos nesta partida.", "error");
          return;
        }
        interrogatedList.push(suspectKey);
        Engine.state.interrogatedSuspects = interrogatedList;
        Engine.saveGame();
        this.renderInterrogationSuspects(); // Re-render to update classes and lock states
      }

      if (window.Sound) window.Sound.playBeep();
      const chatContainer = document.getElementById("interrogation-chat-container");
      const questionList = document.getElementById("interrogation-questions");
      const panelTitle = document.getElementById("interrogate-title");

      if (!chatContainer || !questionList || !panelTitle) return;

      const data = GAME_DATA.interrogations[suspectKey];
      const suspect = GAME_DATA.suspects[suspectKey];

      const headerAvatarHTML = suspect.photo 
        ? `<img src="${suspect.photo}" style="width:32px; height:32px; border-radius:50%; object-fit:cover; border: 1px solid var(--color-yellow);">`
        : `<span class="header-avatar">${suspect.avatar}</span>`;

      panelTitle.innerHTML = `
        <div class="interrogate-header-user">
          ${headerAvatarHTML}
          <div>
            <strong>${suspect.name.toUpperCase()}</strong>
            <span style="font-size:0.6rem; color:var(--color-gray); display:block;">STATUS: EM DEPOIMENTO</span>
          </div>
        </div>
      `;

      chatContainer.innerHTML = `
        <div class="chat-message system">
          [DEPOIMENTO INICIADO COM O ACUSADO/TESTEMUNHA]<br>
          Selecione uma pergunta criminal no painel abaixo.
        </div>
      `;

      questionList.innerHTML = "";
      data.conversations.forEach((conv) => {
        const qBtn = document.createElement("button");
        qBtn.className = "question-btn";
        qBtn.innerText = conv.question;
        qBtn.onclick = () => {
          this.askInterrogationQuestion(chatContainer, qBtn, conv.question, conv.answer, suspect.name);
        };
        questionList.appendChild(qBtn);
      });
    }

    askInterrogationQuestion(chatContainer, btnNode, question, answer, suspectName) {
      if (window.Sound) window.Sound.playKeypress();

      btnNode.disabled = true;
      btnNode.classList.add("asked");

      const suspect = Object.values(GAME_DATA.suspects).find(s => s.name === suspectName);

      const qWrapper = document.createElement("div");
      qWrapper.className = "chat-msg-row detective-row fade-in";
      
      const mainSVG = document.getElementById("avatar-svg");
      const avatarHTML = mainSVG 
        ? mainSVG.outerHTML.replace(/id="avatar-svg"/g, 'class="detective-avatar-svg" style="width: 100%; height: 100%;"').replace(/id="svg-/g, 'class="svg-')
        : "";

      qWrapper.innerHTML = `
        <div class="chat-message detective">
          <strong>INVESTIGADOR:</strong> ${question}
        </div>
        <div class="chat-avatar-circle">
          ${avatarHTML}
        </div>
      `;
      chatContainer.appendChild(qWrapper);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      const typingWrapper = document.createElement("div");
      typingWrapper.className = "chat-msg-row suspect-row typing-row fade-in";
      
      const suspectAvatarHTML = (suspect && suspect.photo)
        ? `<img src="${suspect.photo}" style="width: 100%; height: 100%; object-fit: cover;">`
        : `<span style="font-size: 0.8rem; line-height: 28px;">${(suspect && suspect.avatar) || "👤"}</span>`;

      typingWrapper.innerHTML = `
        <div class="chat-avatar-circle">
          ${suspectAvatarHTML}
        </div>
        <div class="chat-message system typing">
          ${suspectName} está formulando a resposta...
        </div>
      `;
      chatContainer.appendChild(typingWrapper);
      chatContainer.scrollTop = chatContainer.scrollHeight;

      setTimeout(() => {
        typingWrapper.remove();

        const aWrapper = document.createElement("div");
        aWrapper.className = "chat-msg-row suspect-row fade-in";
        aWrapper.innerHTML = `
          <div class="chat-avatar-circle">
            ${suspectAvatarHTML}
          </div>
          <div class="chat-message suspect">
            <strong>${suspectName.toUpperCase()}:</strong> ${answer}
          </div>
        `;
        chatContainer.appendChild(aWrapper);

        if (window.Sound) window.Sound.playGlitch();
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 1200);
    }

    // ==============================================================
    // 6. CELULAR DA VÍTIMA & DECODIFICADOR (Etapa 6)
    // ==============================================================
    initStagePhoneBypass() {
      if (Engine.state.phoneUnlocked) {
        this.renderSmartphoneUI();
      } else {
        this.renderPhoneLockscreen();
      }
    }

    // Renderiza tela de bloqueio com teclado numérico
    renderPhoneLockscreen() {
      const container = document.getElementById("phone-bypass-wrapper");
      if (!container) return;

      container.innerHTML = `
        <div class="smartphone-shell glass fade-in">
          <div class="smartphone-top-bar">
            <span>📶 DECAP NET</span>
            <span>12:00</span>
            <span>🔒 BLOQUEADO</span>
          </div>
          
          <div class="smartphone-screen">
            <div class="lockscreen-date">Sábado, 23 de Maio</div>
            <div class="lockscreen-time">23:30</div>
            
            <div class="lockscreen-notice">
              Digite a senha de 4 dígitos
            </div>

            <div class="passcode-dots-row">
              <span class="pass-dot" id="dot-0"></span>
              <span class="pass-dot" id="dot-1"></span>
              <span class="pass-dot" id="dot-2"></span>
              <span class="pass-dot" id="dot-3"></span>
            </div>

            <!-- Teclado Numérico -->
            <div class="phone-numpad">
              ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `
                <button class="numpad-btn" onclick="UI.pressPhoneKey('${n}')">${n}</button>
              `).join("")}
              <button class="numpad-btn control-btn" onclick="UI.clearPhoneKey()">LIMPAR</button>
              <button class="numpad-btn" onclick="UI.pressPhoneKey('0')">0</button>
              <button class="numpad-btn control-btn success-btn" onclick="UI.submitPhonePasscode()">OK</button>
            </div>
          </div>
        </div>
      `;

      this.phoneInputBuffer = "";
      this.updatePasscodeDots();
    }

    pressPhoneKey(num) {
      if (this.phoneInputBuffer.length >= 6) return;
      if (window.Sound) window.Sound.playKeypress();
      this.phoneInputBuffer += num;
      this.updatePasscodeDots();
    }

    clearPhoneKey() {
      if (window.Sound) window.Sound.playKeypress();
      this.phoneInputBuffer = "";
      this.updatePasscodeDots();
    }

    updatePasscodeDots() {
      for (let i = 0; i < 6; i++) {
        const dot = document.getElementById(`dot-${i}`);
        if (dot) {
          if (i < this.phoneInputBuffer.length) {
            dot.classList.add("filled");
          } else {
            dot.classList.remove("filled");
          }
        }
      }
    }

    submitPhonePasscode() {
      const success = Engine.unlockSmartphone(this.phoneInputBuffer);
      if (!success) {
        this.phoneInputBuffer = "";
        this.updatePasscodeDots();
      }
    }

    // Renderiza a interface interna do smartphone desbloqueado de Daniela
    renderSmartphoneUI() {
      const container = document.getElementById("phone-bypass-wrapper");
      if (!container) return;

      container.innerHTML = `
        <div class="smartphone-shell glass unlocked fade-in">
          <div class="smartphone-top-bar">
            <span>📶 DECAP NET</span>
            <span>23:31</span>
            <span>🔓 DESBLOQUEADO</span>
          </div>
          
          <div class="smartphone-screen-unlocked">
            <!-- Barra de abas internas do celular (WhatsApp vs Arquivos) -->
            <div class="phone-app-nav">
              <button class="app-nav-btn active" id="phone-app-wa" onclick="UI.switchPhoneApp('whatsapp')">💬 WHATSAPP</button>
              <button class="app-nav-btn" id="phone-app-files" onclick="UI.switchPhoneApp('files')">📁 PASTA OCULTA</button>
            </div>

            <div class="phone-app-content" id="phone-app-display">
              <!-- Renderizado via app switcher -->
            </div>
          </div>
        </div>
      `;

      this.switchPhoneApp("whatsapp");
    }

    switchPhoneApp(appName) {
      if (window.Sound) window.Sound.playBeep();
      
      document.getElementById("phone-app-wa").classList.toggle("active", appName === "whatsapp");
      document.getElementById("phone-app-files").classList.toggle("active", appName === "files");

      // Restore the navigation tab bar visibility
      const nav = document.querySelector(".phone-app-nav");
      if (nav) nav.style.display = "grid";

      const display = document.getElementById("phone-app-display");
      if (!display) return;

      display.innerHTML = "";

      if (appName === "whatsapp") {
        let chatItemsHTML = "";
        Object.keys(GAME_DATA.phoneBypass.whatsapp).forEach(chatKey => {
          const suspect = GAME_DATA.suspects[chatKey];
          if (suspect || chatKey === "unknown") {
            const isYellow = (chatKey === GAME_DATA.accusationAnswers.killer) ? ' style="color:var(--color-yellow);"' : '';
            
            let displayName = "";
            let photoSrc = "";
            let role = "";
            
            if (chatKey === "unknown") {
              displayName = "Desconhecido";
              photoSrc = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238696a0'><circle cx='12' cy='8' r='4'/><path d='M12 14c-6.1 0-10 4-10 10h20c0-6-3.9-10-10-10z'/></svg>";
              role = "Número Oculto";
            } else {
              displayName = chatKey === "suspect6" ? "Michael 🖤" : (chatKey === "suspect3" ? "Mãe ❤️" : (chatKey === "suspect1" ? "Juliana 📚" : (chatKey === "suspect5" ? "Ingrid 🦋" : (chatKey === "suspect2" ? "Bianca 🌻" : suspect.name))));
              photoSrc = suspect.photo;
              role = suspect.role;
            }
            
            chatItemsHTML += `
              <div class="wa-chat-item" onclick="UI.openWaChatDetails('${chatKey}')">
                <div class="wa-avatar-circle">
                  <img src="${photoSrc}" alt="${displayName}">
                </div>
                <div class="wa-chat-item-info">
                  <strong${isYellow}>${displayName}</strong>
                  <p>${role}</p>
                </div>
              </div>
            `;
          }
        });

        display.innerHTML = `
          <div class="wa-chat-list">
            ${chatItemsHTML}
          </div>
        `;
      } else {
        display.innerHTML = `
          <div class="phone-files-list">
            <button class="file-item-btn" onclick="UI.openPhoneFile('ocorrencia')">📄 OCORRENCIA_POLICIAL_AMEACAS.PDF</button>
            <button class="file-item-btn" onclick="UI.openPhoneFile('laudo_botanica')">📄 RELATÓRIO_QUÍMICO_EVIDENCIA_ROSA.PDF</button>
            <button class="file-item-btn" onclick="UI.openPhoneFile('logs_geolocalizacao')">📄 LOGS_GEOLOCALIZACAO_GPS.TXT</button>
          </div>
          <div class="phone-file-details-panel" id="phone-file-details">
            <div class="empty-viewer" style="height:140px; font-size:0.65rem;">Selecione um arquivo confidencial para abrir a perícia forense.</div>
          </div>
        `;
      }
    }

    openWaChatDetails(chatKey) {
      if (window.Sound) window.Sound.playKeypress();
      
      // Hide the navigation tab bar
      const nav = document.querySelector(".phone-app-nav");
      if (nav) nav.style.display = "none";

      const display = document.getElementById("phone-app-display");
      if (!display) return;

      const suspect = GAME_DATA.suspects[chatKey];
      const displayName = chatKey === "unknown" ? "Desconhecido" : (chatKey === "suspect6" ? "Michael 🖤" : (chatKey === "suspect3" ? "Mãe ❤️" : (chatKey === "suspect1" ? "Juliana 📚" : (chatKey === "suspect5" ? "Ingrid 🦋" : (chatKey === "suspect2" ? "Bianca 🌻" : (suspect ? suspect.name : chatKey))))));
      const photoSrc = chatKey === "unknown" ? "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%238696a0'><circle cx='12' cy='8' r='4'/><path d='M12 14c-6.1 0-10 4-10 10h20c0-6-3.9-10-10-10z'/></svg>" : (suspect ? suspect.photo : "img/default-avatar.png");

      let chatContentHTML = "";
      const messages = GAME_DATA.phoneBypass.whatsapp[chatKey] || [];

      messages.forEach(msg => {
        if (msg.type === "date") {
          chatContentHTML += `<div class="wa-chat-date-badge">${msg.text}</div>`;
        } else {
          const bubbleClass = msg.isMe ? "sent" : "received";
          const statusHTML = msg.isMe ? '<span class="wa-msg-status">✓✓</span>' : '';
          chatContentHTML += `
            <div class="wa-msg-bubble ${bubbleClass}">
              <div class="wa-msg-text">${msg.text}</div>
              <div class="wa-msg-meta">
                <span class="wa-msg-time">${msg.time}</span>
                ${statusHTML}
              </div>
            </div>
          `;
        }
      });

      display.innerHTML = `
        <div class="wa-chat-view fade-in">
          <div class="wa-chat-header">
            <button class="wa-back-btn" onclick="UI.switchPhoneApp('whatsapp')">←</button>
            <div class="wa-avatar-circle">
              <img src="${photoSrc}" alt="${displayName}">
            </div>
            <div class="wa-header-info">
              <strong>${displayName}</strong>
              <span>online</span>
            </div>
          </div>
          <div class="chat-details-body" id="wa-chat-body">
            ${chatContentHTML}
          </div>
          <div class="wa-chat-footer">
            <div class="wa-input-container">
              <span class="wa-emoji-icon">😊</span>
              <input type="text" placeholder="Mensagem" readonly>
              <span class="wa-attach-icon">📎</span>
              <span class="wa-camera-icon">📷</span>
            </div>
            <button class="wa-mic-btn">🎤</button>
          </div>
        </div>
      `;

      setTimeout(() => {
        const chatBody = document.getElementById("wa-chat-body");
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      }, 50);
    }

    openPhoneFile(fileKey) {
      if (window.Sound) window.Sound.playKeypress();
      const panel = document.getElementById("phone-file-details");
      if (panel) {
        panel.innerHTML = `
          <div class="file-details-body fade-in">
            ${GAME_DATA.phoneBypass.files[fileKey]}
          </div>
        `;
      }
    }


    // ==============================================================
    // 9. ACUSAÇÃO FINAL & REVELAÇÃO CINEMATOGRÁFICA (Etapa 9)
    // ==============================================================

    initStageAccusation() {
      const form = document.getElementById("accusation-form");
      const revContainer = document.getElementById("revelation-container");

      if (!form || !revContainer) return;

      if (Engine.state.gameCompleted) {
        form.style.display = "none";
        revContainer.style.display = "block";
        this.renderRevelationCinematic(false);
        return;
      }

      form.style.display = "block";
      revContainer.style.display = "none";

      const select = document.getElementById("accuse-killer");
      if (select && select.children.length <= 1) {
        select.innerHTML = `<option value="">-- SELECIONE O PRINCIPAL SUSPEITO --</option>`;
        Object.keys(GAME_DATA.suspects).forEach(key => {
          const s = GAME_DATA.suspects[key];
          const opt = document.createElement("option");
          opt.value = key;
          opt.innerText = `${s.name} (${s.role})`;
          select.appendChild(opt);
        });
      }

      form.onsubmit = (e) => {
        e.preventDefault();
        
        const killer = document.getElementById("accuse-killer").value;

        if (!killer) {
          if (window.Sound) window.Sound.playError();
          Engine.notify("Erro: Por favor, selecione o principal suspeito.", "error");
          return;
        }

        Engine.submitAccusation(killer);
        
        // Transiciona visualmente
        form.style.display = "none";
        revContainer.style.display = "block";
        this.renderRevelationCinematic(true);
      };
    }

    renderRevelationCinematic(playAnim = false) {
      const revContainer = document.getElementById("revelation-container");
      if (!revContainer) return;

      revContainer.innerHTML = "";

      const acc = Engine.state.accusation;
      const isCorrect = (acc.killer === GAME_DATA.accusationAnswers.killer);

      if (playAnim) {
        // Exibir tela de scanner cibernético forense
        revContainer.innerHTML = `
          <div class="forensic-cinematic-intro" id="cinematic-intro">
            <div class="cinematic-radar">
              <svg viewBox="0 0 100 100" class="radar-circle">
                <circle cx="50" cy="50" r="45" stroke="rgba(0, 255, 204, 0.15)" stroke-width="0.5" fill="none" />
                <circle cx="50" cy="50" r="30" stroke="rgba(0, 255, 204, 0.2)" stroke-width="0.5" fill="none" />
                <circle cx="50" cy="50" r="15" stroke="rgba(0, 255, 204, 0.2)" stroke-width="0.5" fill="none" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(0, 255, 204, 0.15)" stroke-width="0.5" />
                <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(0, 255, 204, 0.15)" stroke-width="0.5" />
                <path d="M50 50 L85 20" stroke="#00ffcc" stroke-width="1.5" class="radar-sweep" />
              </svg>
            </div>
            <div class="forensic-status-ticker" id="cinematic-ticker"></div>
            <div id="cinematic-stamp-container"></div>
          </div>
        `;

        const ticker = document.getElementById("cinematic-ticker");
        const lines = [
          "🔒 CONECTANDO AO SISTEMA DE DADOS DA PORTARIA...",
          "📡 CALCULANDO TRIANGULAÇÃO DE ANTENA (GPS) DO APALHO...",
          "🔬 RASTREANDO RESÍDUOS QUÍMICOS E COMPATIBILIDADE BIO-MÉDICA...",
          "⚖️ CONCLUINDO PARECER DA DELEGACIA DE HOMICÍDIOS..."
        ];

        lines.forEach((line, index) => {
          setTimeout(() => {
            const intro = document.getElementById("cinematic-intro");
            if (!intro) return; // Se o usuário navegar para fora
            if (window.Sound) window.Sound.playKeypress();
            const p = document.createElement("div");
            p.className = "ticker-line";
            p.textContent = line;
            ticker.innerHTML = "";
            ticker.appendChild(p);
          }, index * 1200);
        });

        // Revela o carimbo (Deferido / Indeferido)
        setTimeout(() => {
          const intro = document.getElementById("cinematic-intro");
          if (!intro) return;
          const stampContainer = document.getElementById("cinematic-stamp-container");
          if (stampContainer) {
            if (window.Sound) {
              window.Sound.playGlitch();
              setTimeout(() => {
                if (isCorrect) window.Sound.playSuccess();
                else window.Sound.playError();
              }, 150);
            }
            stampContainer.innerHTML = isCorrect ? 
              `<div class="verdict-stamp correct">INQUÉRITO DEFERIDO</div>` :
              `<div class="verdict-stamp incorrect">INQUÉRITO RECUSADO</div>`;
          }
        }, lines.length * 1200);

        // Transiciona para o veredito final detalhado
        setTimeout(() => {
          const intro = document.getElementById("cinematic-intro");
          if (intro) {
            intro.classList.add("fade-out-cinematic");
            setTimeout(() => {
              this.renderFinalScreenContent(revContainer, isCorrect, acc);
            }, 800);
          } else {
            this.renderFinalScreenContent(revContainer, isCorrect, acc);
          }
        }, lines.length * 1200 + 2200);

      } else {
        // Exibir imediatamente sem animação se já completado
        this.renderFinalScreenContent(revContainer, isCorrect, acc);
      }
    }

    renderFinalScreenContent(container, isCorrect, acc) {
      container.innerHTML = "";
      
      const resultsWrapper = document.createElement("div");
      resultsWrapper.className = "cinematic-fade-in-results";

      const banner = document.createElement("div");
      banner.className = `veredict-banner ${isCorrect ? "correct" : "incorrect"}`;
      banner.innerHTML = isCorrect ? 
        `<h2>✅ VEREDITO DA CORREGEDORIA: ACUSAÇÃO CORRETA!</h2><p>Você refutou perfeitamente o álibi tecnológico e desmascarou o ex-namorado Michel Newton.</p>` :
        `<h2>❌ VEREDITO DA CORREGEDORIA: INQUÉRITO REJEITADO!</h2><p>O mandado de prisão foi rejeitado por contradições nas provas. O assassino conseguiu fugir do país!</p>`;
      
      resultsWrapper.appendChild(banner);

      const userTheory = document.createElement("div");
      userTheory.className = "user-theory-box glass";
      userTheory.innerHTML = `
        <h3>Mandado de Prisão Emitido:</h3>
        <div class="theory-meta">
          Acusado: <b>${GAME_DATA.suspects[acc.killer]?.name || acc.killer}</b>
        </div>
      `;
      resultsWrapper.appendChild(userTheory);

      const cronTitle = document.createElement("h2");
      cronTitle.className = "cron-section-title";
      cronTitle.innerText = "📁 RECONSTRUÇÃO CRONOLÓGICA FORENSE";
      resultsWrapper.appendChild(cronTitle);

      const wrapper = document.createElement("div");
      wrapper.className = "revelation-steps-wrapper";
      
      GAME_DATA.revelation.textSteps.forEach((step, index) => {
        const stepDiv = document.createElement("div");
        stepDiv.className = "rev-step-slide glass fade-in";
        stepDiv.style.animationDelay = `${index * 0.25}s`;
        stepDiv.innerHTML = `
          <div class="rev-step-num">FATO #${index + 1}</div>
          <h3>${step.title}</h3>
          <p>${step.content}</p>
        `;
        wrapper.appendChild(stepDiv);
      });
      resultsWrapper.appendChild(wrapper);

      const restartBtn = document.createElement("button");
      restartBtn.className = "restart-game-btn glass-btn yellow-glow";
      restartBtn.innerText = "🔄 ZERAR SISTEMA E TENTAR OUTRO CURSO";
      restartBtn.onclick = () => {
        if (confirm("Quer deletar todo o banco digital de provas e reiniciar a simulação?")) {
          Engine.resetGame();
        }
      };
      resultsWrapper.appendChild(restartBtn);
      
      container.appendChild(resultsWrapper);
    }

    // AUXILIAR: Efeito de digitação no terminal
    typeWriterEffect(element, text, speed = 25, callback = null) {
      if (this.typingTimer) clearInterval(this.typingTimer);
      
      element.innerHTML = "";
      let i = 0;
      
      this.typingTimer = setInterval(() => {
        if (i < text.length) {
          const char = text.charAt(i);
          if (char === "\n") {
            element.innerHTML += "<br>";
          } else {
            element.innerHTML += char;
          }
          
          // Toca som de digitação muito sutil e esparso (apenas em alguns espaços entre palavras) para não ser repetitivo na escrita rápida
          if (char === ' ' && Math.random() < 0.3 && window.Sound) {
            window.Sound.playKeypress();
          }
          i++;
        } else {
          clearInterval(this.typingTimer);
          this.typingTimer = null;
          if (callback) callback();
        }
      }, speed);
    }

    initTerminalEffects() {
      setInterval(() => {
        if (Math.random() < 0.03) {
          const hud = document.getElementById("hud-container");
          if (hud) {
            hud.classList.add("glitch-shake");
            if (window.Sound) window.Sound.playGlitch();
            setTimeout(() => { hud.classList.remove("glitch-shake"); }, 180);
          }
        }
      }, 15000);
    }
  }

  const UI = new InvestiUI();
  window.UI = UI;

  document.addEventListener("DOMContentLoaded", () => {
    Engine.init();
    UI.init();
  });
