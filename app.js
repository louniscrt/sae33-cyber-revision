/* ==========================================================================
   app.js — Moteur interactif complet SAE3.CYBER.03 (100 % hors-ligne)
   ========================================================================== */
(function () {
  "use strict";

  const DATA = window.SAE33 || {};
  const STORAGE_KEY = "sae33_revision_state_v1";

  const DEFAULT_STATE = {
    masteredChapters: {},
    masteredCards: {},
    dstpChecks: {},
    bestDsScore: null,
    quizStats: { answered: 0, correct: 0 }
  };

  let state = loadState();
  let currentRoute = "dashboard";
  let dsTimerInterval = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      return { ...structuredClone(DEFAULT_STATE), ...JSON.parse(raw) };
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
    updateProgressUI();
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toast(msg) {
    const region = document.getElementById("toast-region");
    if (!region) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    region.appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  /* ========================================================================
     1. DARK MODE TOGGLE (Conforme modern-web-guidance: dark-mode-toggle)
     ======================================================================== */
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  const osDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function getStoredScheme() {
    try {
      const v = localStorage.getItem("color-scheme");
      return v === "light" || v === "dark" ? v : null;
    } catch {
      return null;
    }
  }

  function applyColorScheme(pref) {
    // pref: "light" | "dark" | null (system)
    metaColorScheme.content = pref ?? "light dark";
    syncSettingsThemeRadios();
  }

  function setStoredScheme(pref) {
    try {
      if (pref) localStorage.setItem("color-scheme", pref);
      else localStorage.removeItem("color-scheme");
    } catch {}
    applyColorScheme(pref);
  }

  function toggleTwoStateTheme() {
    const osScheme = osDarkQuery.matches ? "dark" : "light";
    const rendered = getStoredScheme() ?? osScheme;
    const target = rendered === "dark" ? "light" : "dark";
    // Divergence checked only at storage time: if target matches OS, remove stored value
    if (target === osScheme) {
      setStoredScheme(null);
      toast(`Thème aligné sur le système (${osScheme === "dark" ? "sombre" : "clair"})`);
    } else {
      setStoredScheme(target);
      toast(`Thème forcé en mode ${target === "dark" ? "sombre" : "clair"}`);
    }
  }

  function syncSettingsThemeRadios() {
    const stored = getStoredScheme();
    const val = stored ?? "system";
    const radio = document.querySelector(`input[name="theme-pref"][value="${val}"]`);
    if (radio) radio.checked = true;
    const status = document.getElementById("system-theme-status");
    if (status) {
      status.textContent = `Actuellement ${osDarkQuery.matches ? "sombre" : "clair"}`;
    }
  }

  osDarkQuery.addEventListener("change", () => {
    // Never delete stored value on OS change; only update system status text
    syncSettingsThemeRadios();
  });

  window.addEventListener("storage", (e) => {
    if (e.key === "color-scheme") {
      applyColorScheme(getStoredScheme());
    }
  });

  /* ========================================================================
     2. MODERN WEB GUIDANCE FALLBACKS (Dialog light-dismiss, Invoker commands)
     ======================================================================== */
  function initModernWebFallbacks() {
    // Fallback for <dialog closedby="any">
    if (!("closedBy" in HTMLDialogElement.prototype)) {
      const outside = (e, dialog) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      for (const dialog of document.querySelectorAll('dialog[closedby="any"]')) {
        let pressedOutside = false;
        dialog.addEventListener("pointerdown", (e) => {
          pressedOutside = outside(e, dialog);
        });
        dialog.addEventListener("pointerup", (e) => {
          if (pressedOutside && outside(e, dialog)) dialog.close();
        });
      }
    }

    // Invoker commands: native "command" listener + fallback if unsupported
    document.addEventListener(
      "command",
      (event) => {
        if (event.command === "--toggle-all") {
          handleToggleAllAccordion(event.source, event.target);
        }
      },
      { capture: true }
    );

    if (!Object.hasOwn(HTMLButtonElement.prototype, "commandForElement")) {
      document.addEventListener("click", (e) => {
        const btn = e.target.closest("button[command][commandfor]");
        if (!btn) return;
        const target = document.getElementById(btn.getAttribute("commandfor"));
        if (!target) return;
        const cmd = btn.getAttribute("command");
        if (cmd === "show-modal" && typeof target.showModal === "function") {
          target.showModal();
        } else if (cmd === "--toggle-all") {
          handleToggleAllAccordion(btn, target);
        }
      });
    }

    // Keep toggle-all accordion button aria-expanded synced on individual toggle
    document.addEventListener(
      "toggle",
      (event) => {
        if (!event.target.matches(".accordion > details")) return;
        const acc = event.target.parentElement;
        const btn = document.querySelector(`[command="--toggle-all"][commandfor="${CSS.escape(acc.id)}"]`);
        if (!btn) return;
        const items = acc.querySelectorAll(":scope > details");
        const allOpen = Array.prototype.every.call(items, (d) => d.open);
        btn.setAttribute("aria-expanded", String(allOpen));
      },
      { capture: true }
    );
  }

  function handleToggleAllAccordion(btn, container) {
    const expand = btn.getAttribute("aria-expanded") !== "true";
    for (const d of container.querySelectorAll(":scope > details")) {
      d.open = expand;
    }
    btn.setAttribute("aria-expanded", String(expand));
  }

  /* ========================================================================
     3. GLOBAL PROGRESS & NAVIGATION
     ======================================================================== */
  function updateProgressUI() {
    const chapters = ["internet", "ospf", "bgp", "redistribution"];
    const masteredCh = chapters.filter((c) => state.masteredChapters[c]).length;
    const totalCards = (DATA.FLASHCARDS || []).length;
    const masteredCards = Object.values(state.masteredCards).filter(Boolean).length;
    const totalChecks = 7;
    const doneChecks = Object.values(state.dstpChecks).filter(Boolean).length;

    const pct = Math.round(
      ((masteredCh / chapters.length) * 40 +
        (totalCards ? (masteredCards / totalCards) * 40 : 0) +
        (doneChecks / totalChecks) * 20)
    );

    const topTxt = document.getElementById("topbar-progress-text");
    const topFill = document.getElementById("topbar-progress-fill");
    if (topTxt) topTxt.textContent = `${pct}%`;
    if (topFill) topFill.style.width = `${pct}%`;

    const sCh = document.getElementById("sidebar-mastered-count");
    const sCards = document.getElementById("sidebar-cards-count");
    const sBest = document.getElementById("sidebar-best-ds");
    if (sCh) sCh.textContent = `${masteredCh} / ${chapters.length}`;
    if (sCards) sCards.textContent = `${masteredCards} / ${totalCards}`;
    if (sBest) sBest.textContent = state.bestDsScore !== null ? `${state.bestDsScore} / 20` : "—";

    chapters.forEach((c) => {
      const badge = document.querySelector(`[data-status-for="${c}"]`);
      if (badge) badge.textContent = state.masteredChapters[c] ? "✅" : "";
    });
  }

  function closeMobileSidebar() {
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    const btn = document.getElementById("mobile-menu-btn");
    sidebar?.classList.remove("open");
    if (backdrop) backdrop.hidden = true;
    btn?.setAttribute("aria-expanded", "false");
  }

  function navigate(route, anchorId) {
    if (dsTimerInterval) {
      clearInterval(dsTimerInterval);
      dsTimerInterval = null;
    }
    const valid = [
      "dashboard",
      "internet",
      "ospf",
      "bgp",
      "redistribution",
      "labs",
      "simulators",
      "troubleshooting",
      "quiz",
      "glossary"
    ];
    if (!valid.includes(route)) route = "dashboard";
    currentRoute = route;

    document.querySelectorAll(".nav-item").forEach((a) => {
      if (a.dataset.nav === route) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    const container = document.getElementById("view-container");
    if (route === "dashboard") renderDashboard(container);
    else if (["internet", "ospf", "bgp", "redistribution"].includes(route)) renderCourseModule(container, route);
    else if (route === "labs") renderLabs(container);
    else if (route === "simulators") renderSimulators(container);
    else if (route === "troubleshooting") renderTroubleshooting(container);
    else if (route === "quiz") renderQuizHub(container);
    else if (route === "glossary") renderGlossary(container);

    closeMobileSidebar();
    updateProgressUI();

    if (anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }

  /* ========================================================================
     4. VIEW: DASHBOARD & PARCOURS EXAMEN
     ======================================================================== */
  function renderDashboard(container) {
    const chapters = ["internet", "ospf", "bgp", "redistribution"];
    const masteredCh = chapters.filter((c) => state.masteredChapters[c]).length;
    const masteredCards = Object.values(state.masteredCards).filter(Boolean).length;
    const totalCards = DATA.FLASHCARDS.length;
    const totalQuiz = DATA.QUIZ.length;

    const dstpSteps = [
      "Lire le sujet en entier : repérer les AS, aires OSPF, ABR, ASBR, ports et réseaux.",
      "Activer 'Always Show Port Labels' dans PT, câbler et vérifier les vrais noms d'interfaces (show ip interface brief).",
      "Configurer toutes les IP + no shutdown + passerelles des PC, puis tester les pings directs (voisin à voisin).",
      "Activer OSPF (wildcard correct + bonne aire des 2 côtés + passive-interface côté PC) et vérifier 'FULL'.",
      "Activer eBGP/iBGP (remote-as miroir, network + mask exact, next-hop-self si iBGP) et vérifier 'Established'.",
      "Ajouter les options une par une : MD5, coût, Stub/Totally Stub/NSSA (no-summary sur ABR seul), Redistribution 2 sens (subnets).",
      "Tester les pings ALLER + RETOUR depuis les PC (Desktop → Command Prompt) et enregistrer le .pkt (Save As)."
    ];

    container.innerHTML = `
      <header class="page-hero">
        <div class="hero-meta">
          <span class="eyebrow">BUT R&amp;T 2e Année · Ressource R3.01 · SAE3.CYBER.03</span>
          <span class="badge badge-green">100 % Hors-Ligne · Tous les 26 documents synthétisés</span>
        </div>
        <h1>Portail Ultime de Révision — Réseaux Multi-Sites</h1>
        <p class="lead">Tout le programme de <strong>SAE3.CYBER.03</strong> (3 polycopiés, 3 sujets de TP, tous les CR, TD2, TD3, 5 configs Packet Tracer) rassemblé en fiches ultra-pédagogiques, schémas SVG, 6 simulateurs vivants, 56 QCM et 54 flashcards pour cartonner au <strong>DS (1h)</strong> et au <strong>DSTP (2h)</strong>.</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.6rem;margin-block-start:1rem;">
          <a href="#internet" class="btn btn-primary" data-nav="internet">🚀 Commencer le cours</a>
          <a href="#simulators" class="btn btn-secondary" data-nav="simulators">⚡ Ouvrir les 6 simulateurs</a>
          <a href="#quiz" class="btn btn-secondary" data-nav="quiz">🏆 Lancer un DS Blanc (20 min)</a>
          <a href="#labs" class="btn btn-secondary" data-nav="labs">🛠️ Voir les 8 TP / TD corrigés</a>
        </div>
      </header>

      <div class="grid-4" style="margin-block-end:1.35rem;">
        <div class="kpi-card">
          <span class="kpi-label">Cours Maîtrisés</span>
          <span class="kpi-value">${masteredCh} / 4</span>
          <span class="kpi-sub">Poly 1, 2, 3 + Redistribution</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Banque d'Entraînement</span>
          <span class="kpi-value">${totalQuiz + totalCards}</span>
          <span class="kpi-sub">${totalQuiz} QCM · ${totalCards} Flashcards · ${DATA.EXERCISES.length} Exos</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Flashcards Validées</span>
          <span class="kpi-value">${masteredCards} / ${totalCards}</span>
          <span class="kpi-sub">Suivi sauvegardé localement</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">Meilleur DS Blanc</span>
          <span class="kpi-value">${state.bestDsScore !== null ? state.bestDsScore + " / 20" : "À tenter"}</span>
          <span class="kpi-sub">Objectif ≥ 16 / 20</span>
        </div>
      </div>

      <section class="section-block">
        <h2>🧭 Parcours recommandé selon ton objectif</h2>
        <div class="grid-2">
          <div class="card">
            <span class="badge badge-blue">DS Écrit (1h)</span>
            <h4>Théorie, Calculs &amp; Analyses de Tables / Paquets</h4>
            <ol class="small">
              <li>Revoir <strong>Module 1</strong> : Gouvernance (ISOC/ICANN/IANA/IETF/IRTF), RFC, Tier 1/2/3, RENATER, RIR/LIR, 4 types d'AS.</li>
              <li>Maîtriser <strong>Module 2 (OSPF)</strong> : IP 89, 224.0.0.5/.6, 5 paquets ≠ LSA 1–7, E1 vs E2, Stub/Totally Stub/NSSA, DR/BDR, MD5.</li>
              <li>Maîtriser <strong>Module 3 (BGP)</strong> : TCP 179, eBGP vs iBGP, 4 classes d'attributs, <strong>10 critères de sélection</strong>, AS_PATH, Communities, RR/Confédérations.</li>
              <li>Faire 2 sessions de <strong>DS Blanc (Module 8)</strong> + relire le <strong>Top 15 Anti-Pièges (Module 9)</strong>.</li>
            </ol>
          </div>
          <div class="card">
            <span class="badge badge-purple">DSTP Pratique Packet Tracer (2h)</span>
            <h4>Configuration CLI, Simulation &amp; Dépannage Rapide</h4>
            <ol class="small">
              <li>Revoir <strong>Module 4 (Redistribution)</strong> et les différences Packet Tracer (<code>Gi0/0</code> vs <code>Gi0/0/0</code>, mode Simulation).</li>
              <li>Parcourir les topologies <strong>TD2</strong>, <strong>TD3</strong> et <strong>TP3</strong> dans le <strong>Module 5</strong>.</li>
              <li>S'entraîner sur le <strong>Calculateur Wildcard</strong>, le <strong>Décodeur show ip route</strong> et le <strong>Générateur IOS (Module 6)</strong>.</li>
              <li>Garder en tête l'arbre de dépannage du <strong>Module 7</strong> (Idle/Active, PfxRcd=0, next-hop-self, subnets).</li>
            </ol>
          </div>
        </div>
      </section>

      <section class="section-block">
        <h2>✅ Check-list interactive du Jour J (DSTP Packet Tracer)</h2>
        <p class="small muted">Coche chaque réflexe une fois que tu le maîtrises parfaitement :</p>
        <div style="display:flex;flex-direction:column;gap:0.5rem;">
          ${dstpSteps
            .map(
              (s, i) => `
            <label class="card" style="display:flex;align-items:flex-start;gap:0.65rem;padding:0.7rem 0.9rem;cursor:pointer;">
              <input type="checkbox" data-dstp-check="${i}" ${state.dstpChecks[i] ? "checked" : ""} style="margin-top:0.25rem;">
              <span class="small"><strong>Étape ${i + 1} :</strong> ${esc(s)}</span>
            </label>`
            )
            .join("")}
        </div>
      </section>

      <section class="section-block">
        <h2>⚡ Fiche Express Ultra-Condensée (les chiffres vitaux)</h2>
        <div class="grid-3">
          <div class="card">
            <h4>OSPF en 5 chiffres</h4>
            <ul class="small">
              <li>Protocole <strong>IP 89 (0x59)</strong> — AD = <strong>110</strong></li>
              <li>Multicast <strong>224.0.0.5</strong> / <strong>224.0.0.6</strong> (TTL 1)</li>
              <li>Timers Ethernet : Hello <strong>10 s</strong> / Dead <strong>40 s</strong></li>
              <li>Coût Cisco : <code>10⁸ / BW</code> (min 1)</li>
              <li>Externe E2 défaut : <strong>20</strong> (static/conn) · <strong>1</strong> (BGP)</li>
            </ul>
          </div>
          <div class="card">
            <h4>BGP en 5 chiffres</h4>
            <ul class="small">
              <li>Transport <strong>TCP port 179</strong></li>
              <li>AD : eBGP = <strong>20</strong> · iBGP = <strong>200</strong></li>
              <li>Timers : <strong>30/90 s</strong> (cours) · <strong>60/180 s</strong> (Cisco IOS)</li>
              <li>En-tête BGP : <strong>19 octets</strong> (16+2+1)</li>
              <li>Défauts : Weight local <strong>32768</strong> · LocPrf <strong>100</strong> · MED <strong>0</strong></li>
            </ul>
          </div>
          <div class="card">
            <h4>Formules à connaître</h4>
            <ul class="small">
              <li>Maillage complet (DR / iBGP) : <strong>n(n − 1) / 2</strong></li>
              <li>Wildcard OSPF : <strong>255.255.255.255 − masque</strong></li>
              <li>/30 → <code>255.255.255.252</code> → Wildcard <code>0.0.0.3</code> (2 hôtes)</li>
              <li>/24 → <code>255.255.255.0</code> → Wildcard <code>0.0.0.255</code> (254 hôtes)</li>
              <li>Routeurs traversés = <strong>TTL initial (64/128) − TTL reçu</strong></li>
            </ul>
          </div>
        </div>
      </section>
    `;

    container.querySelectorAll("[data-dstp-check]").forEach((cb) => {
      cb.addEventListener("change", () => {
        state.dstpChecks[cb.dataset.dstpCheck] = cb.checked;
        saveState();
      });
    });
  }

  /* ========================================================================
     5. VIEW: COURSE MODULES (Internet, OSPF, BGP, Redistribution)
     ======================================================================== */
  const OSPF_STATES_DESC = [
    "<strong>1. DOWN :</strong> Aucun Hello reçu. Le routeur envoie ses propres paquets Hello sur <code>224.0.0.5</code> toutes les 10 s.",
    "<strong>2. INIT :</strong> Un Hello a été reçu du voisin, mais le Router-ID local n'apparaît pas encore dans le champ <em>Active Neighbors</em> du voisin (communication unidirectionnelle).",
    "<strong>3. 2-WAY :</strong> Communication bidirectionnelle confirmée (chaque routeur voit son propre Router-ID dans le Hello de l'autre). Élection DR / BDR sur les liens broadcast/NBMA. <strong>Les routeurs DROTHER restent normalement en 2-WAY entre eux !</strong>",
    "<strong>4. EXSTART :</strong> Négociation du rôle Maître / Esclave (flags I/M/MS dans un DBD vide) selon le plus grand Router-ID pour fixer le numéro de séquence initial.",
    "<strong>5. EXCHANGE :</strong> Échange des paquets <strong>DBD (Type 2)</strong> contenant les résumés (en-têtes) des LSA de chaque LSDB.",
    "<strong>6. LOADING :</strong> Demande des LSA manquantes ou plus récentes par <strong>LSR (Type 3)</strong>, réception via <strong>LSU (Type 4)</strong>, et acquittement par <strong>LSAck (Type 5)</strong>.",
    "<strong>7. FULL :</strong> Adjacence complète ! Les deux routeurs possèdent une <strong>LSDB strictement identique</strong> et calculent leurs routes avec Dijkstra (SPF)."
  ];

  const BGP_STATES_DESC = [
    "<strong>1. Idle :</strong> État initial. BGP attend le démarrage (ou attend après une erreur/reset) et refuse les connexions entrantes.",
    "<strong>2. Connect :</strong> Le routeur tente d'établir la connexion <strong>TCP vers le port 179</strong> du voisin (SYN / SYN-ACK / ACK).",
    "<strong>3. Active :</strong> La connexion TCP a échoué ; le routeur réessaie périodiquement. <em>Signe classique d'une IP voisin injoignable, d'un firewall, d'un remote-as oublié ou d'un TTL=1 en multihop !</em>",
    "<strong>4. OpenSent :</strong> Connexion TCP établie ! Le routeur a envoyé son message <strong>OPEN</strong> (Version 4, My AS, Hold Time, BGP ID) et attend celui du pair.",
    "<strong>5. OpenConfirm :</strong> OPEN du voisin reçu et validé (AS concordant). Un <strong>KEEPALIVE</strong> est envoyé en confirmation, en attente du KEEPALIVE du voisin.",
    "<strong>6. Established :</strong> Session opérationnelle ! Les pairs échangent leurs routes par <strong>UPDATE</strong> puis maintiennent la session par <strong>KEEPALIVE</strong>. Dans <code>show ip bgp summary</code>, un <strong>entier</strong> (nb de préfixes reçus) remplace le nom d'état !"
  ];

  function renderCourseModule(container, key) {
    const mod = DATA.COURS[key];
    const isMastered = !!state.masteredChapters[key];
    const order = ["internet", "ospf", "bgp", "redistribution"];
    const idx = order.indexOf(key);
    const prev = idx > 0 ? order[idx - 1] : null;
    const next = idx < order.length - 1 ? order[idx + 1] : "labs";

    container.innerHTML = `
      <header class="page-hero">
        <div class="hero-meta">
          <span class="eyebrow">${esc(mod.eyebrow)}</span>
          <button type="button" class="mastery-btn" id="toggle-mastery-btn" aria-pressed="${isMastered}">
            ${isMastered ? "✅ Chapitre maîtrisé" : "☆ Marquer comme maîtrisé"}
          </button>
        </div>
        <h1>${esc(mod.title)}</h1>
        <p class="lead">${esc(mod.lead)}</p>
        <nav class="toc-inline" aria-label="Sommaire du chapitre">
          ${mod.toc.map((t) => `<a href="#${t.id}" data-scroll-target="${t.id}">${esc(t.label)}</a>`).join("")}
        </nav>
      </header>
      ${mod.html}
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.75rem;margin-block-start:1.5rem;">
        ${prev ? `<a href="#${prev}" class="btn btn-secondary" data-nav="${prev}">← Chapitre précédent</a>` : `<span></span>`}
        <a href="#${next}" class="btn btn-primary" data-nav="${next}">Continuer →</a>
      </div>
    `;

    // Smooth scroll for intra-chapter anchors without breaking SPA hash router
    container.querySelectorAll("[data-scroll-target]").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById(a.dataset.scrollTarget);
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });

    // Mastery toggle
    const mBtn = document.getElementById("toggle-mastery-btn");
    mBtn?.addEventListener("click", () => {
      state.masteredChapters[key] = !state.masteredChapters[key];
      const now = !!state.masteredChapters[key];
      mBtn.setAttribute("aria-pressed", String(now));
      mBtn.textContent = now ? "✅ Chapitre maîtrisé" : "☆ Marquer comme maîtrisé";
      saveState();
      toast(now ? "Chapitre marqué comme maîtrisé !" : "Chapitre remis à réviser.");
    });

    // Interactive steppers are handled via global click delegation (OSPF & BGP state machines)
  }

  /* ========================================================================
     6. VIEW: ALL 8 LABS (TP1, TP2, TP3, TD2, TD3, CR OSPF, CR BGP, CR Interco)
     Uses accessible Tabs pattern (Modern Web Guidance)
     ======================================================================== */
  function renderLabs(container) {
    const labs = DATA.LABS;
    container.innerHTML = `
      <header class="page-hero">
        <div class="hero-meta">
          <span class="eyebrow">Module 5 · Tous les TP, TD &amp; Configurations Packet Tracer</span>
          <span class="badge badge-blue">8 topologies complètes · Prêtes à copier</span>
        </div>
        <h1>Tous les TP &amp; TD Corrigés (avec Topologies SVG &amp; Configs IOS)</h1>
        <p class="lead">Sélectionnez un TP ou TD ci-dessous pour visualiser son schéma réseau, son plan d'adressage, ses blocs de configuration Cisco IOS prêts à coller, ses sorties <code>show</code> commentées et les points clés à retenir.</p>
      </header>

      <div class="tabs" id="labs-tabs">
        <div class="tablist" role="tablist" aria-label="Liste des 8 TP et TD">
          ${labs
            .map(
              (lab, i) => `
            <button type="button" role="tab" id="tab-lab-${lab.id}" aria-selected="${i === 0 ? "true" : "false"}" data-tab-target="panel-lab-${lab.id}" tabindex="${i === 0 ? "0" : "-1"}">
              ${esc(lab.tabLabel)}
            </button>`
            )
            .join("")}
        </div>

        ${labs
          .map(
            (lab, i) => `
          <div role="tabpanel" id="panel-lab-${lab.id}" aria-labelledby="tab-lab-${lab.id}" ${i === 0 ? 'tabindex="0"' : 'hidden="until-found"'}>
            <div class="tab-panel-inner">
              <section class="section-block">
                <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.5rem;margin-block-end:0.5rem;">
                  <span class="badge badge-purple">${esc(lab.badge)}</span>
                </div>
                <h2 style="border:0;padding:0;margin-block-end:0.5rem;">${esc(lab.title)}</h2>
                <p class="muted">${esc(lab.summary)}</p>

                <div class="diagram-card">
                  ${lab.svg}
                </div>

                <h3>📋 Plan d'adressage et rôles</h3>
                <div tabindex="0" role="region" aria-labelledby="cap-addr-${lab.id}" class="table-wrapper stack-mobile">
                  <table>
                    <caption id="cap-addr-${lab.id}">Adressage — ${esc(lab.tabLabel)}</caption>
                    <thead>
                      <tr><th>Équipement</th><th>Interfaces</th><th>Adresses IP</th><th>Rôle / Notes</th></tr>
                    </thead>
                    <tbody>
                      ${lab.addressing
                        .map(
                          (r) => `
                        <tr>
                          <th scope="row">${esc(r.eq)}</th>
                          <td data-label="Interfaces">${esc(r.intf)}</td>
                          <td data-label="Adresses IP"><code>${esc(r.ip)}</code></td>
                          <td data-label="Rôle">${esc(r.role)}</td>
                        </tr>`
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>

                <h3>⌨️ Configurations Cisco IOS (prêtes à copier)</h3>
                ${lab.configs
                  .map(
                    (c) => `
                  <div class="code-block">
                    <div class="code-header"><span>${esc(c.title)}</span><button type="button" class="copy-btn">Copier</button></div>
                    <pre><code>${esc(c.code)}</code></pre>
                  </div>`
                  )
                  .join("")}

                <h3>🔍 Sorties attendues &amp; Vérifications (<code>show</code> / <code>ping</code>)</h3>
                <div class="code-block">
                  <div class="code-header"><span>Sorties Cisco IOS / PC commentées</span><button type="button" class="copy-btn">Copier</button></div>
                  <pre><code>${esc(lab.outputs)}</code></pre>
                </div>

                <div class="callout callout-success">
                  <strong class="callout-title">🎯 Points clés à retenir pour le DS / DSTP :</strong>
                  <ul>${lab.takeaways.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
                </div>
              </section>
            </div>
          </div>`
          )
          .join("")}
      </div>
    `;

    initTabs(document.getElementById("labs-tabs"));
  }

  function initTabs(tabsRoot) {
    if (!tabsRoot) return;
    const tabs = Array.from(tabsRoot.querySelectorAll('[role="tab"]'));
    const panels = Array.from(tabsRoot.querySelectorAll('[role="tabpanel"]'));

    function activate(selectedTab, moveFocus = false) {
      tabs.forEach((t, idx) => {
        const isSel = t === selectedTab;
        t.setAttribute("aria-selected", String(isSel));
        t.tabIndex = isSel ? 0 : -1;
        const panel = panels[idx];
        if (isSel) {
          panel.hidden = false;
          panel.setAttribute("tabindex", "0");
        } else {
          panel.hidden = "until-found";
          panel.removeAttribute("tabindex");
        }
      });
      selectedTab.scrollIntoView({ block: "nearest", inline: "nearest" });
      if (moveFocus) selectedTab.focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", (e) => {
        let nextIdx = null;
        if (e.key === "ArrowRight") nextIdx = (i + 1) % tabs.length;
        else if (e.key === "ArrowLeft") nextIdx = (i - 1 + tabs.length) % tabs.length;
        else if (e.key === "Home") nextIdx = 0;
        else if (e.key === "End") nextIdx = tabs.length - 1;
        if (nextIdx !== null) {
          e.preventDefault();
          activate(tabs[nextIdx], true);
        }
      });
    });

    // Modern Web Guidance: sync tab state when Find-in-page matches hidden="until-found" panel
    tabsRoot.addEventListener("beforematch", (e) => {
      const panel = e.target.closest('[role="tabpanel"]');
      if (!panel) return;
      const idx = panels.indexOf(panel);
      if (idx >= 0) activate(tabs[idx], false);
    });
  }

  /* ========================================================================
     7. VIEW: 6 INTERACTIVE SIMULATORS (Module 6)
     ======================================================================== */
  function renderSimulators(container) {
    container.innerHTML = `
      <header class="page-hero">
        <div class="hero-meta">
          <span class="eyebrow">Module 6 · Laboratoire Vivant</span>
          <span class="badge badge-green">6 Outils Interactifs en Temps Réel</span>
        </div>
        <h1>Laboratoire Interactif &amp; Simulateurs OSPF / BGP</h1>
        <p class="lead">Manipulez concrètement les mécanismes du cours pour ne plus jamais hésiter le jour de l'examen : calculateur Wildcard, décodeur <code>show ip route</code>, départage BGP en 10 étapes, élection DR/BDR, filtre LSA par type d'aire et générateur de configs IOS.</p>
      </header>

      <div class="tabs" id="sim-tabs">
        <div class="tablist" role="tablist" aria-label="Simulateurs interactifs">
          <button type="button" role="tab" id="tab-sim-ip" aria-selected="true" tabindex="0">1. IPv4 &amp; Wildcard</button>
          <button type="button" role="tab" id="tab-sim-route" aria-selected="false" tabindex="-1">2. Décodeur show ip route</button>
          <button type="button" role="tab" id="tab-sim-bgp" aria-selected="false" tabindex="-1">3. Départage BGP (10 règles)</button>
          <button type="button" role="tab" id="tab-sim-dr" aria-selected="false" tabindex="-1">4. Élection DR / BDR</button>
          <button type="button" role="tab" id="tab-sim-area" aria-selected="false" tabindex="-1">5. Filtre LSA &amp; Aires</button>
          <button type="button" role="tab" id="tab-sim-gen" aria-selected="false" tabindex="-1">6. Générateur Config IOS</button>
        </div>

        <!-- SIM 1: IPv4 / Wildcard -->
        <div role="tabpanel" id="panel-sim-ip" aria-labelledby="tab-sim-ip" tabindex="0">
          <div class="tab-panel-inner">
            <section class="section-block">
              <h2>🧮 Calculateur IPv4, Sous-réseau, Wildcard OSPF &amp; Commandes <code>network</code></h2>
              <div class="sim-grid">
                <div class="field">
                  <label for="sim-ip-addr">Adresse IPv4 (hôte ou réseau)</label>
                  <input type="text" id="sim-ip-addr" value="10.0.0.13">
                </div>
                <div class="field">
                  <label for="sim-ip-cidr">Préfixe CIDR</label>
                  <select id="sim-ip-cidr">
                    ${[8,16,24,25,26,27,28,29,30,32].map(c => `<option value="${c}" ${c===30?'selected':''}>/${c}</option>`).join("")}
                  </select>
                </div>
                <div class="field">
                  <label for="sim-ip-area">Aire OSPF</label>
                  <input type="number" id="sim-ip-area" value="0" min="0">
                </div>
              </div>
              <div id="sim-ip-out"></div>
            </section>
          </div>
        </div>

        <!-- SIM 2: Route Decoder -->
        <div role="tabpanel" id="panel-sim-route" aria-labelledby="tab-sim-route" hidden="until-found">
          <div class="tab-panel-inner">
            <section class="section-block">
              <h2>🔍 Décodeur Interactif de <code>show ip route</code></h2>
              <p class="small muted">Choisissez un exemple tiré des TP/TD puis <strong>cliquez sur chaque bloc</strong> de la route Cisco IOS pour l'analyser :</p>
              <div class="search-quick-chips" id="decoder-presets">
                <button type="button" class="chip active" data-preset="0">OSPF Intra-aire (O)</button>
                <button type="button" class="chip" data-preset="1">OSPF Inter-aire (O IA)</button>
                <button type="button" class="chip" data-preset="2">OSPF Externe BGP (O E2)</button>
                <button type="button" class="chip" data-preset="3">OSPF NSSA (O N2)</button>
                <button type="button" class="chip" data-preset="4">Défaut Totally Stub (O*IA)</button>
                <button type="button" class="chip" data-preset="5">eBGP (B [20/3])</button>
                <button type="button" class="chip" data-preset="6">iBGP (B [200/0])</button>
              </div>
              <div class="route-line-interactive" id="decoder-line"></div>
              <div class="sim-result-box" id="decoder-explain"></div>
            </section>
          </div>
        </div>

        <!-- SIM 3: BGP Best Path -->
        <div role="tabpanel" id="panel-sim-bgp" aria-labelledby="tab-sim-bgp" hidden="until-found">
          <div class="tab-panel-inner">
            <section class="section-block">
              <h2>🏆 Simulateur de Sélection du Meilleur Chemin BGP (Les 10 Critères)</h2>
              <p class="small muted">Modifiez les attributs des deux routes candidates pour <code>198.51.100.0/24</code> : le moteur applique les 10 règles exactes du Polycopié 3 et indique l'étape gagnante.</p>
              <div class="grid-2">
                <div class="card">
                  <h4>Route A</h4>
                  <div class="sim-grid">
                    <div class="field"><label>Next-Hop joignable ?</label><select id="ba-nh"><option value="1">Oui</option><option value="0">Non (inaccessible)</option></select></div>
                    <div class="field"><label>1. Weight (Cisco)</label><input type="number" id="ba-w" value="0"></div>
                    <div class="field"><label>2. Local_Pref</label><input type="number" id="ba-lp" value="100"></div>
                    <div class="field"><label>3. Origine locale ?</label><select id="ba-loc"><option value="0">Non</option><option value="1">Oui (0.0.0.0)</option></select></div>
                    <div class="field"><label>4. AS_PATH (espaces)</label><input type="text" id="ba-as" value="200 100"></div>
                    <div class="field"><label>5. Origin</label><select id="ba-ori"><option value="i">i (IGP)</option><option value="e">e (EGP)</option><option value="?" selected>? (Incomplete)</option></select></div>
                    <div class="field"><label>6. MED</label><input type="number" id="ba-med" value="10"></div>
                    <div class="field"><label>7. Type de pair</label><select id="ba-ext"><option value="ebgp">eBGP (Externe)</option><option value="ibgp">iBGP (Interne)</option></select></div>
                    <div class="field"><label>8. Coût IGP Next-Hop</label><input type="number" id="ba-igp" value="2"></div>
                    <div class="field"><label>10. Router-ID pair</label><input type="text" id="ba-rid" value="2.2.2.2"></div>
                  </div>
                </div>
                <div class="card">
                  <h4>Route B</h4>
                  <div class="sim-grid">
                    <div class="field"><label>Next-Hop joignable ?</label><select id="bb-nh"><option value="1">Oui</option><option value="0">Non (inaccessible)</option></select></div>
                    <div class="field"><label>1. Weight (Cisco)</label><input type="number" id="bb-w" value="0"></div>
                    <div class="field"><label>2. Local_Pref</label><input type="number" id="bb-lp" value="100"></div>
                    <div class="field"><label>3. Origine locale ?</label><select id="bb-loc"><option value="0">Non</option><option value="1">Oui (0.0.0.0)</option></select></div>
                    <div class="field"><label>4. AS_PATH (espaces)</label><input type="text" id="bb-as" value="300 100"></div>
                    <div class="field"><label>5. Origin</label><select id="bb-ori"><option value="i" selected>i (IGP)</option><option value="e">e (EGP)</option><option value="?">? (Incomplete)</option></select></div>
                    <div class="field"><label>6. MED</label><input type="number" id="bb-med" value="50"></div>
                    <div class="field"><label>7. Type de pair</label><select id="bb-ext"><option value="ebgp">eBGP (Externe)</option><option value="ibgp" selected>iBGP (Interne)</option></select></div>
                    <div class="field"><label>8. Coût IGP Next-Hop</label><input type="number" id="bb-igp" value="1"></div>
                    <div class="field"><label>10. Router-ID pair</label><input type="text" id="bb-rid" value="1.1.1.1"></div>
                  </div>
                </div>
              </div>
              <div class="sim-result-box" id="sim-bgp-out"></div>
            </section>
          </div>
        </div>

        <!-- SIM 4: DR / BDR -->
        <div role="tabpanel" id="panel-sim-dr" aria-labelledby="tab-sim-dr" hidden="until-found">
          <div class="tab-panel-inner">
            <section class="section-block">
              <h2>👑 Simulateur d'Élection DR / BDR sur Switch Multi-Accès (Aire 0)</h2>
              <p class="small muted">Modifiez la Priority (0 = exclu, 1–255) et le Router-ID de 4 routeurs connectés au même switch Ethernet :</p>
              <div class="grid-4" id="dr-inputs">
                ${[
                  { n: "R0", p: 1, id: "1.1.1.1" },
                  { n: "R1", p: 1, id: "2.2.2.2" },
                  { n: "R3", p: 1, id: "10.0.0.3" },
                  { n: "R4", p: 1, id: "192.168.41.254" }
                ]
                  .map(
                    (r, i) => `
                  <div class="card">
                    <h4>${r.n}</h4>
                    <div class="field"><label>Priority (0–255)</label><input type="number" class="dr-pri" data-idx="${i}" value="${r.p}" min="0" max="255"></div>
                    <div class="field" style="margin-top:0.5rem;"><label>Router-ID</label><input type="text" class="dr-rid" data-idx="${i}" value="${r.id}"></div>
                  </div>`
                  )
                  .join("")}
              </div>
              <div class="sim-result-box" id="sim-dr-out"></div>
            </section>
          </div>
        </div>

        <!-- SIM 5: Area LSA Filter -->
        <div role="tabpanel" id="panel-sim-area" aria-labelledby="tab-sim-area" hidden="until-found">
          <div class="tab-panel-inner">
            <section class="section-block">
              <h2>🧱 Simulateur de Filtrage LSA par Type d'Aire OSPF</h2>
              <p class="small muted">Sélectionnez un type d'aire pour visualiser immédiatement quelles LSA entrent dans l'aire, ce que contient <code>show ip route</code> sur un IAR et les commandes exactes à taper :</p>
              <div class="search-quick-chips" id="area-sim-btns">
                <button type="button" class="chip active" data-area="normal">Aire Normale</button>
                <button type="button" class="chip" data-area="stub">Stub</button>
                <button type="button" class="chip" data-area="tstub">Totally Stub</button>
                <button type="button" class="chip" data-area="nssa">NSSA</button>
                <button type="button" class="chip" data-area="tnssa">Totally NSSA</button>
              </div>
              <div id="sim-area-out"></div>
            </section>
          </div>
        </div>

        <!-- SIM 6: Cisco Config Generator -->
        <div role="tabpanel" id="panel-sim-gen" aria-labelledby="tab-sim-gen" hidden="until-found">
          <div class="tab-panel-inner">
            <section class="section-block">
              <h2>⚙️ Générateur Rapide de Configurations Cisco IOS (Packet Tracer)</h2>
              <div class="sim-grid">
                <div class="field">
                  <label for="gen-mode">Scénario à générer</label>
                  <select id="gen-mode">
                    <option value="ospf">OSPF entre R1 et R2 (+ MD5 optionnel)</option>
                    <option value="ebgp">eBGP entre 2 AS (AS100 ↔ AS200)</option>
                    <option value="ibgp">iBGP interne (+ next-hop-self)</option>
                    <option value="redist">ASBR Interconnexion OSPF ↔ eBGP</option>
                  </select>
                </div>
                <div class="field"><label for="gen-transit">Réseau transit (CIDR)</label><input type="text" id="gen-transit" value="10.0.12.0/30"></div>
                <div class="field"><label for="gen-lan1">LAN R1 (CIDR)</label><input type="text" id="gen-lan1" value="192.168.10.0/24"></div>
                <div class="field"><label for="gen-lan2">LAN R2 (CIDR)</label><input type="text" id="gen-lan2" value="192.168.20.0/24"></div>
                <div class="field"><label for="gen-p1">Aire OSPF / AS R1</label><input type="number" id="gen-p1" value="100"></div>
                <div class="field"><label for="gen-p2">Coût OSPF / AS R2</label><input type="number" id="gen-p2" value="200"></div>
                <div class="field"><label for="gen-md5">Clé MD5 OSPF (vide = sans)</label><input type="text" id="gen-md5" placeholder="ex: SecretRT40"></div>
              </div>
              <div id="sim-gen-out"></div>
            </section>
          </div>
        </div>
      </div>
    `;

    initTabs(document.getElementById("sim-tabs"));
    bindSimIP();
    bindSimRouteDecoder();
    bindSimBGP();
    bindSimDR();
    bindSimArea();
    bindSimGen();
  }

  // --- Helper IPv4 math ---
  function parseIPv4(str) {
    const parts = str.trim().split(".").map(Number);
    if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return null;
    return (((parts[0] << 24) >>> 0) + (parts[1] << 16) + (parts[2] << 8) + parts[3]) >>> 0;
  }
  function intToIPv4(n) {
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
  }
  function calcSubnet(ipStr, cidr) {
    const ip = parseIPv4(ipStr);
    if (ip === null || cidr < 0 || cidr > 32) return null;
    const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
    const wildcard = (~mask) >>> 0;
    const net = (ip & mask) >>> 0;
    const bcast = (net | wildcard) >>> 0;
    const hosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : Math.max(0, bcast - net - 1);
    const first = cidr >= 31 ? net : (net + 1) >>> 0;
    const second = cidr >= 31 ? bcast : (net + 2) >>> 0;
    const last = cidr >= 31 ? bcast : (bcast - 1) >>> 0;
    return {
      ip: intToIPv4(ip),
      cidr,
      mask: intToIPv4(mask),
      wildcard: intToIPv4(wildcard),
      network: intToIPv4(net),
      broadcast: intToIPv4(bcast),
      first: intToIPv4(first),
      second: intToIPv4(second),
      last: intToIPv4(last),
      hosts
    };
  }

  function bindSimIP() {
    const ipEl = document.getElementById("sim-ip-addr");
    const cidrEl = document.getElementById("sim-ip-cidr");
    const areaEl = document.getElementById("sim-ip-area");
    const out = document.getElementById("sim-ip-out");

    function update() {
      const info = calcSubnet(ipEl.value, Number(cidrEl.value));
      if (!info) {
        out.innerHTML = `<div class="callout callout-danger">Adresse IPv4 invalide. Exemple : <code>10.0.0.13</code></div>`;
        return;
      }
      const area = Number(areaEl.value) || 0;
      out.innerHTML = `
        <div class="grid-4" style="margin-block:0.8rem;">
          <div class="kpi-card"><span class="kpi-label">Adresse Réseau</span><span class="kpi-value mono" style="font-size:1.15rem;">${info.network}/${info.cidr}</span><span class="kpi-sub">Broadcast : ${info.broadcast}</span></div>
          <div class="kpi-card"><span class="kpi-label">Masque Normal (BGP)</span><span class="kpi-value mono" style="font-size:1.15rem;">${info.mask}</span><span class="kpi-sub">${info.hosts} hôte(s) utilisable(s)</span></div>
          <div class="kpi-card"><span class="kpi-label">Wildcard (OSPF)</span><span class="kpi-value mono" style="font-size:1.15rem;color:var(--accent);">${info.wildcard}</span><span class="kpi-sub">255.255.255.255 − masque</span></div>
          <div class="kpi-card"><span class="kpi-label">Plage Hôtes</span><span class="kpi-value mono" style="font-size:1.05rem;">${info.first}</span><span class="kpi-sub">→ ${info.last}</span></div>
        </div>
        <div class="code-block">
          <div class="code-header"><span>Commandes network générées automatiquement</span><button type="button" class="copy-btn">Copier</button></div>
          <pre><code>! OSPF (masque WILDCARD obligatoire) :
router ospf 1
 network ${info.network} ${info.wildcard} area ${area}

! BGP (mot-clé MASK + masque NORMAL, préfixe exact requis dans show ip route) :
router bgp 100
 network ${info.network} mask ${info.mask}</code></pre>
        </div>
      `;
    }
    [ipEl, cidrEl, areaEl].forEach((el) => el.addEventListener("input", update));
    update();
  }

  function bindSimRouteDecoder() {
    const presets = [
      [
        { t: "O", d: "<strong>Code O :</strong> Route apprise par <strong>OSPF intra-aire</strong> (dans la même aire, via LSA Type 1/2). Priorité maximale dans OSPF." },
        { t: "192.168.40.0/24", d: "<strong>Préfixe de destination :</strong> réseau 192.168.40.0 avec masque /24 (255.255.255.0). Utilisé pour le <em>Longest Prefix Match</em>." },
        { t: "[110/200]", d: "<strong>[AD / Métrique] :</strong> <code>110</code> = Distance Administrative d'OSPF ; <code>200</code> = Coût cumulé (ex : 100 lien R1–R2 + 100 LAN dans le TP1)." },
        { t: "via 10.0.40.1", d: "<strong>Next-Hop :</strong> adresse IP du prochain routeur vers lequel envoyer le paquet." },
        { t: "GigabitEthernet0/0/0", d: "<strong>Interface de sortie :</strong> port physique utilisé pour joindre 10.0.40.1." }
      ],
      [
        { t: "O IA", d: "<strong>Code O IA :</strong> Route OSPF <strong>Inter-Area</strong>, apprise d'une autre aire via une <strong>LSA de type 3 (Summary)</strong> générée par un ABR." },
        { t: "192.168.50.0/24", d: "<strong>Préfixe distant :</strong> LAN situé dans l'aire 50." },
        { t: "[110/4]", d: "<strong>[AD / Coût] :</strong> AD OSPF 110 ; coût total = 4 (3 liens Gigabit à coût 1 + LAN PC à coût 1)." },
        { t: "via 10.50.1.1", d: "<strong>Next-Hop :</strong> routeur voisin en direction de l'ABR." }
      ],
      [
        { t: "O E2", d: "<strong>Code O E2 :</strong> Route <strong>Externe OSPF de Type 2</strong>, générée par une <strong>LSA de type 5</strong> depuis un ASBR (ici redistribution de BGP dans OSPF)." },
        { t: "172.16.50.0/24", d: "<strong>Préfixe externe :</strong> réseau appartenant à un autre AS (AS50 dans le TD2)." },
        { t: "[110/1]", d: "<strong>[AD / Coût fixe E2] :</strong> AD 110 ; métrique = <strong>1</strong> (valeur par défaut pour BGP redistribué dans OSPF ; reste 1 partout en E2 !)." },
        { t: "via 10.50.1.1", d: "<strong>Next-Hop :</strong> premier saut menant vers l'ASBR Router9." }
      ],
      [
        { t: "O N2", d: "<strong>Code O N2 :</strong> Route <strong>Externe NSSA de Type 2</strong>, transportée par une <strong>LSA de type 7</strong> depuis un ASBR interne à une aire NSSA (TP3 Aire 20). L'ABR la traduira en LSA 5 (O E2) vers l'aire 0." },
        { t: "192.168.20.0/24", d: "<strong>Préfixe redistribué :</strong> LAN injecté par R4 via <code>redistribute connected</code> ou <code>redistribute static subnets</code>." },
        { t: "[110/20]", d: "<strong>[AD / Coût N2] :</strong> AD 110 ; métrique par défaut = <strong>20</strong> pour une route statique/connectée redistribuée." },
        { t: "via 10.20.0.2", d: "<strong>Next-Hop :</strong> l'ASBR interne R4 dans l'aire NSSA 20." }
      ],
      [
        { t: "O*IA", d: "<strong>Code O*IA :</strong> Route <strong>candidate par défaut (*)</strong> inter-aire injectée automatiquement par l'ABR sous forme de <strong>LSA Type 3 (0.0.0.0)</strong> dans une aire Stub, Totally Stub ou Totally NSSA." },
        { t: "0.0.0.0/0", d: "<strong>Route par défaut :</strong> correspond à TOUTES les destinations absentes de la table (passerelle de dernier recours)." },
        { t: "[110/2]", d: "<strong>[AD / Coût] :</strong> AD 110 ; coût = 1 (défaut injecté par l'ABR) + 1 (lien vers l'ABR)." },
        { t: "via 10.40.0.1", d: "<strong>Next-Hop :</strong> l'ABR (Router5), unique porte de sortie de l'aire 40." }
      ],
      [
        { t: "B", d: "<strong>Code B :</strong> Route apprise par <strong>BGP</strong> (ici <strong>eBGP</strong> car AD = 20)." },
        { t: "192.168.1.0/24", d: "<strong>NLRI :</strong> préfixe annoncé par un AS voisin via un message BGP UPDATE." },
        { t: "[20/3]", d: "<strong>[AD / MED] :</strong> <code>20</code> = Distance Administrative d'<strong>eBGP</strong> ; <code>3</code> = attribut <strong>MED</strong> (ici hérité du coût OSPF lors de la redistribution OSPF → BGP !)." },
        { t: "via 10.0.34.1", d: "<strong>NEXT_HOP BGP :</strong> pas d'interface affichée ! IOS la déduit de façon récursive via sa table de routage connectée." }
      ],
      [
        { t: "B", d: "<strong>Code B :</strong> Route apprise par <strong>iBGP</strong> (reconnaissable immédiatement grâce à sa Distance Administrative de <strong>200</strong> !)." },
        { t: "192.168.30.0/24", d: "<strong>Préfixe interne :</strong> réseau annoncé par un autre routeur du MÊME AS (TP2)." },
        { t: "[200/0]", d: "<strong>[AD / MED] :</strong> <code>200</code> = Distance Administrative d'<strong>iBGP</strong> (inférieure en priorité à OSPF 110) ; MED = 0." },
        { t: "via 10.0.30.1", d: "<strong>NEXT_HOP :</strong> routeur interne (ou bordure grâce à <code>next-hop-self</code>)." }
      ]
    ];

    const lineEl = document.getElementById("decoder-line");
    const expEl = document.getElementById("decoder-explain");
    const chips = document.querySelectorAll("#decoder-presets .chip");

    function loadPreset(idx) {
      const tokens = presets[idx];
      lineEl.innerHTML = tokens
        .map((tk, i) => `<button type="button" class="route-token ${i === 0 ? "active" : ""}" data-tk="${i}">${esc(tk.t)}</button>`)
        .join("");
      expEl.innerHTML = tokens[0].d;
      lineEl.querySelectorAll(".route-token").forEach((b) => {
        b.addEventListener("click", () => {
          lineEl.querySelectorAll(".route-token").forEach((x) => x.classList.remove("active"));
          b.classList.add("active");
          expEl.innerHTML = tokens[Number(b.dataset.tk)].d;
        });
      });
    }

    chips.forEach((c) => {
      c.addEventListener("click", () => {
        chips.forEach((x) => x.classList.remove("active"));
        c.classList.add("active");
        loadPreset(Number(c.dataset.preset));
      });
    });
    loadPreset(0);
  }

  function bindSimBGP() {
    const ids = ["nh", "w", "lp", "loc", "as", "ori", "med", "ext", "igp", "rid"];
    const out = document.getElementById("sim-bgp-out");

    function getRoute(prefix) {
      const asStr = document.getElementById(`${prefix}-as`).value.trim();
      const asList = asStr ? asStr.split(/\s+/).filter(Boolean) : [];
      return {
        nh: document.getElementById(`${prefix}-nh`).value === "1",
        w: Number(document.getElementById(`${prefix}-w`).value) || 0,
        lp: Number(document.getElementById(`${prefix}-lp`).value) || 0,
        loc: document.getElementById(`${prefix}-loc`).value === "1",
        asLen: asList.length,
        asStr: asList.join(" ") || "(vide)",
        ori: document.getElementById(`${prefix}-ori`).value,
        med: Number(document.getElementById(`${prefix}-med`).value) || 0,
        ext: document.getElementById(`${prefix}-ext`).value,
        igp: Number(document.getElementById(`${prefix}-igp`).value) || 0,
        rid: document.getElementById(`${prefix}-rid`).value.trim()
      };
    }

    function evaluate() {
      const a = getRoute("ba");
      const b = getRoute("bb");
      const oriRank = { i: 1, e: 2, "?": 3 };
      const steps = [];
      let winner = null;
      let reason = "";

      function check(num, name, valA, valB, cmpFn, ruleTxt) {
        if (winner) return;
        const res = cmpFn();
        if (res === 0) {
          steps.push(`<li><strong>${num}. ${name} :</strong> ${esc(valA)} vs ${esc(valB)} → <em>Égalité, on passe au critère suivant</em></li>`);
        } else {
          winner = res > 0 ? "Route A" : "Route B";
          reason = `${num}. ${name} (${ruleTxt})`;
          steps.push(`<li style="color:var(--success);font-weight:700;"><strong>${num}. ${name} :</strong> ${esc(valA)} vs ${esc(valB)} → 🏆 ${winner} GAGNE (${ruleTxt}) !</li>`);
        }
      }

      if (!a.nh && !b.nh) {
        out.innerHTML = `<div class="callout callout-danger"><strong>Étape 0 — Next-Hop inaccessible :</strong> Aucune des deux routes n'a un Next-Hop joignable dans la RIB → <strong>aucune route n'est installée !</strong></div>`;
        return;
      }
      if (a.nh !== b.nh) {
        winner = a.nh ? "Route A" : "Route B";
        reason = "0. Prérequis Next-Hop accessible";
        steps.push(`<li style="color:var(--success);font-weight:700;"><strong>0. Next-Hop accessible :</strong> ${winner} est la seule route valide (*).</li>`);
      }

      check(1, "Weight (Cisco)", a.w, b.w, () => a.w - b.w, "plus grand gagne");
      check(2, "LOCAL_PREF", a.lp, b.lp, () => a.lp - b.lp, "plus grande gagne");
      check(3, "Self-originated", a.loc ? "Locale" : "Distante", b.loc ? "Locale" : "Distante", () => (a.loc ? 1 : 0) - (b.loc ? 1 : 0), "route locale préférée");
      check(4, "AS_PATH", `${a.asLen} AS (${a.asStr})`, `${b.asLen} AS (${b.asStr})`, () => b.asLen - a.asLen, "plus court gagne");
      check(5, "ORIGIN", a.ori, b.ori, () => oriRank[b.ori] - oriRank[a.ori], "i < e < ?");
      check(6, "MED", a.med, b.med, () => b.med - a.med, "plus petit gagne");
      check(7, "External vs Internal", a.ext, b.ext, () => (a.ext === "ebgp" ? 1 : 0) - (b.ext === "ebgp" ? 1 : 0), "eBGP bat iBGP");
      check(8, "Coût IGP vers Next-Hop", a.igp, b.igp, () => b.igp - a.igp, "plus faible coût IGP gagne");
      const ridA = parseIPv4(a.rid) ?? 0;
      const ridB = parseIPv4(b.rid) ?? 0;
      check(10, "Router-ID BGP", a.rid, b.rid, () => ridB - ridA, "plus PETIT Router-ID gagne");

      if (!winner) {
        winner = "Égalité parfaite";
        reason = "Toutes les valeurs sont identiques";
      }

      out.innerHTML = `
        <div class="callout callout-success" style="margin-top:0;">
          <strong class="callout-title">🏆 Résultat : ${esc(winner)} sélectionnée (<code>*&gt;</code>) — Critère décisif : ${esc(reason)}</strong>
        </div>
        <ol class="small" style="margin-bottom:0;">${steps.join("")}</ol>
      `;
    }

    ids.forEach((k) => {
      document.getElementById(`ba-${k}`).addEventListener("input", evaluate);
      document.getElementById(`bb-${k}`).addEventListener("input", evaluate);
    });
    evaluate();
  }

  function bindSimDR() {
    const names = ["R0", "R1", "R3", "R4"];
    const out = document.getElementById("sim-dr-out");

    function update() {
      const routers = names.map((name, i) => {
        const pri = Math.max(0, Math.min(255, Number(document.querySelector(`.dr-pri[data-idx="${i}"]`).value) || 0));
        const ridStr = document.querySelector(`.dr-rid[data-idx="${i}"]`).value.trim();
        const ridInt = parseIPv4(ridStr) ?? 0;
        return { name, pri, ridStr, ridInt };
      });

      const eligible = routers.filter((r) => r.pri > 0).sort((a, b) => (b.pri !== a.pri ? b.pri - a.pri : b.ridInt - a.ridInt));
      const dr = eligible[0] || null;
      const bdr = eligible[1] || null;

      const n = routers.length;
      const fullMeshAdj = (n * (n - 1)) / 2;
      const drAdj = dr && bdr ? 1 + (n - 2) * 2 : dr ? n - 1 : 0;

      out.innerHTML = `
        <div class="grid-2">
          <div>
            <h4>Résultat de l'élection (à froid / après <code>clear ip ospf process</code>)</h4>
            <ul class="small">
              ${routers
                .map((r) => {
                  let role = "DROTHER (2WAY entre DROTHER, FULL avec DR/BDR)";
                  let badge = "badge-blue";
                  if (r.pri === 0) {
                    role = "DROTHER forcé (Priority = 0 : exclu de l'élection)";
                    badge = "badge-warn";
                  } else if (dr && r.name === dr.name) {
                    role = "DR — Designated Router (génère la LSA Type 2)";
                    badge = "badge-green";
                  } else if (bdr && r.name === bdr.name) {
                    role = "BDR — Backup DR (prend le relais si le DR tombe)";
                    badge = "badge-purple";
                  }
                  return `<li><strong>${r.name}</strong> (Pri ${r.pri}, ID <code>${esc(r.ridStr)}</code>) → <span class="badge ${badge}">${role}</span></li>`;
                })
                .join("")}
            </ul>
          </div>
          <div class="card">
            <h4>Gain d'adjacences sur le segment</h4>
            <p class="small">Sans DR/BDR (<em>n(n−1)/2</em> pour ${n} routeurs) : <strong>${fullMeshAdj} adjacences FULL</strong>.</p>
            <p class="small">Avec DR/BDR : <strong>${drAdj} adjacences FULL</strong> seulement ! Sur un switch de 10 routeurs, on passe de <strong>45</strong> à <strong>17</strong> adjacences.</p>
            <p class="small muted">⚠️ Rappel : si vous modifiez la priorité alors que le réseau tourne déjà, le DR actuel reste en place (<strong>non-préemption</strong>) jusqu'à <code>clear ip ospf process</code>.</p>
          </div>
        </div>
      `;
    }

    document.querySelectorAll(".dr-pri, .dr-rid").forEach((el) => el.addEventListener("input", update));
    update();
  }

  function bindSimArea() {
    const specs = {
      normal: {
        name: "Aire Normale (Standard)",
        lsas: [
          { t: "LSA 1 (Router)", st: "allowed", d: "Routes intra-aire (O)" },
          { t: "LSA 2 (Network)", st: "allowed", d: "Segments DR (O)" },
          { t: "LSA 3 (Summary)", st: "allowed", d: "Inter-aires (O IA)" },
          { t: "LSA 4 (ASBR Sum)", st: "allowed", d: "Chemin vers ASBR" },
          { t: "LSA 5 (External)", st: "allowed", d: "Externes (O E1 / O E2)" },
          { t: "LSA 7 (NSSA)", st: "blocked", d: "Non utilisée ici" }
        ],
        rib: "C (connectés) + O (intra-aire) + O IA (toutes les autres aires) + O E2 (toutes les routes BGP/statiques redistribuées)",
        abr: "! Configuration standard (aucune option area X stub/nssa)",
        iar: "! Configuration standard (aucune option area X stub/nssa)",
        hello: "Bit E = 1 (accepte externes), Bit N = 0"
      },
      stub: {
        name: "Aire Stub (Confinée)",
        lsas: [
          { t: "LSA 1 (Router)", st: "allowed", d: "Conservée (O)" },
          { t: "LSA 2 (Network)", st: "allowed", d: "Conservée (O)" },
          { t: "LSA 3 (Summary)", st: "allowed", d: "Conservée (O IA) + Défaut 0.0.0.0" },
          { t: "LSA 4 (ASBR Sum)", st: "blocked", d: "BLOQUÉE par l'ABR" },
          { t: "LSA 5 (External)", st: "blocked", d: "BLOQUÉE par l'ABR" },
          { t: "LSA 7 (NSSA)", st: "blocked", d: "Interdit (pas d'ASBR interne)" }
        ],
        rib: "C + O + O IA (détaillées) + O*IA 0.0.0.0/0 (remplace les routes O E1/E2 disparues !)",
        abr: "router ospf 1\n area 10 stub",
        iar: "router ospf 1\n area 10 stub",
        hello: "Bit E = 0 (obligatoire sur TOUS les routeurs de l'aire !)"
      },
      tstub: {
        name: "Aire Totally Stub (Cisco)",
        lsas: [
          { t: "LSA 1 (Router)", st: "allowed", d: "Conservée (O)" },
          { t: "LSA 2 (Network)", st: "allowed", d: "Conservée (O)" },
          { t: "LSA 3 (Summary)", st: "default", d: "Seule la LSA 3 du défaut 0.0.0.0 passe !" },
          { t: "LSA 4 (ASBR Sum)", st: "blocked", d: "BLOQUÉE par l'ABR" },
          { t: "LSA 5 (External)", st: "blocked", d: "BLOQUÉE par l'ABR" },
          { t: "LSA 7 (NSSA)", st: "blocked", d: "Interdit" }
        ],
        rib: "C + O (intra-aire) + UNE SEULE ROUTE DISTANTE : O*IA 0.0.0.0/0 via ABR !",
        abr: "! no-summary sur l'ABR UNIQUEMENT :\nrouter ospf 1\n area 40 stub no-summary",
        iar: "! L'IAR garde simplement 'stub' :\nrouter ospf 1\n area 40 stub",
        hello: "Bit E = 0 (identique à Stub ; la différence est dans les LSA 3 envoyées par l'ABR)"
      },
      nssa: {
        name: "Aire NSSA (Not-So-Stubby Area)",
        lsas: [
          { t: "LSA 1 (Router)", st: "allowed", d: "Conservée (O)" },
          { t: "LSA 2 (Network)", st: "allowed", d: "Conservée (O)" },
          { t: "LSA 3 (Summary)", st: "allowed", d: "Conservée (O IA)" },
          { t: "LSA 4 (ASBR Sum)", st: "blocked", d: "BLOQUÉE" },
          { t: "LSA 5 (External)", st: "blocked", d: "BLOQUÉE (remplacée par 7 en interne)" },
          { t: "LSA 7 (NSSA)", st: "default", d: "AUTORISÉE (O N1/N2) → traduite en LSA 5 par ABR !" }
        ],
        rib: "C + O + O IA + O N2 (routes externes locales). ⚠️ Route défaut NON automatique en NSSA simple !",
        abr: "router ospf 1\n area 20 nssa\n ! Si besoin de défaut : area 20 nssa default-information-originate",
        iar: "router ospf 1\n area 20 nssa\n redistribute static subnets   ! (ou connected sur ASBR interne)",
        hello: "Bit E = 0, Bit N = 1 (doit concorder sur tous les routeurs de l'aire !)"
      },
      tnssa: {
        name: "Aire Totally NSSA (Cisco)",
        lsas: [
          { t: "LSA 1 (Router)", st: "allowed", d: "Conservée (O)" },
          { t: "LSA 2 (Network)", st: "allowed", d: "Conservée (O)" },
          { t: "LSA 3 (Summary)", st: "default", d: "Seule la LSA 3 du défaut 0.0.0.0 passe !" },
          { t: "LSA 4 (ASBR Sum)", st: "blocked", d: "BLOQUÉE" },
          { t: "LSA 5 (External)", st: "blocked", d: "BLOQUÉE" },
          { t: "LSA 7 (NSSA)", st: "default", d: "AUTORISÉE (O N2) → traduite en LSA 5 par ABR !" }
        ],
        rib: "C + O + O*IA 0.0.0.0/0 (automatique !) + O N2 (si autre ASBR dans l'aire)",
        abr: "router ospf 1\n area 20 nssa no-summary   ! no-summary sur ABR UNIQUEMENT",
        iar: "router ospf 1\n area 20 nssa              ! IAR/ASBR garde area 20 nssa",
        hello: "Bit E = 0, Bit N = 1"
      }
    };

    const out = document.getElementById("sim-area-out");
    const btns = document.querySelectorAll("#area-sim-btns .chip");

    function render(key) {
      const s = specs[key];
      out.innerHTML = `
        <h3 style="margin-top:0.5rem;">${esc(s.name)}</h3>
        <div class="lsa-pills">
          ${s.lsas
            .map(
              (l) => `
            <div class="lsa-pill lsa-${l.st}">
              <span>${esc(l.t)}</span>
              <small style="font-weight:400;text-decoration:none;">${esc(l.d)}</small>
            </div>`
            )
            .join("")}
        </div>
        <div class="callout">
          <strong class="callout-title">Table de routage sur un routeur interne (IAR) :</strong>
          <code>${esc(s.rib)}</code><br>
          <span class="small muted">Paquets Hello : ${esc(s.hello)}</span>
        </div>
        <div class="grid-2">
          <div class="code-block">
            <div class="code-header"><span>Sur l'ABR (Routeur de bordure)</span><button type="button" class="copy-btn">Copier</button></div>
            <pre><code>${esc(s.abr)}</code></pre>
          </div>
          <div class="code-block">
            <div class="code-header"><span>Sur les routeurs internes (IAR / ASBR NSSA)</span><button type="button" class="copy-btn">Copier</button></div>
            <pre><code>${esc(s.iar)}</code></pre>
          </div>
        </div>
      `;
    }

    btns.forEach((b) => {
      b.addEventListener("click", () => {
        btns.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        render(b.dataset.area);
      });
    });
    render("normal");
  }

  function bindSimGen() {
    const modeEl = document.getElementById("gen-mode");
    const trEl = document.getElementById("gen-transit");
    const l1El = document.getElementById("gen-lan1");
    const l2El = document.getElementById("gen-lan2");
    const p1El = document.getElementById("gen-p1");
    const p2El = document.getElementById("gen-p2");
    const md5El = document.getElementById("gen-md5");
    const out = document.getElementById("sim-gen-out");

    function parseCidrInput(val, fallback) {
      const [ip, c] = (val || fallback).split("/");
      return calcSubnet(ip, Number(c ?? 24)) || calcSubnet(...fallback.split("/").map((v, i) => (i ? Number(v) : v)));
    }

    function update() {
      const mode = modeEl.value;
      const tr = parseCidrInput(trEl.value, "10.0.12.0/30");
      const l1 = parseCidrInput(l1El.value, "192.168.10.0/24");
      const l2 = parseCidrInput(l2El.value, "192.168.20.0/24");
      const p1 = Number(p1El.value) || 100;
      const p2 = Number(p2El.value) || 200;
      const md5 = md5El.value.trim();

      let r1 = "", r2 = "";
      if (mode === "ospf") {
        const md5Block = md5 ? `\n ip ospf authentication message-digest\n ip ospf message-digest-key 1 md5 ${md5}` : "";
        const costLine = p2 > 0 ? `\n ip ospf cost ${p2}` : "";
        r1 = `enable\nconfigure terminal\nhostname R1\ninterface GigabitEthernet0/0\n ip address ${tr.first} ${tr.mask}${costLine}${md5Block}\n no shutdown\ninterface GigabitEthernet0/1\n ip address ${l1.first} ${l1.mask}\n no shutdown\nrouter ospf 1\n router-id 1.1.1.1\n network ${tr.network} ${tr.wildcard} area ${p1}\n network ${l1.network} ${l1.wildcard} area ${p1}\n passive-interface GigabitEthernet0/1\nend\nwrite memory`;
        r2 = `enable\nconfigure terminal\nhostname R2\ninterface GigabitEthernet0/0\n ip address ${tr.second} ${tr.mask}${costLine}${md5Block}\n no shutdown\ninterface GigabitEthernet0/1\n ip address ${l2.first} ${l2.mask}\n no shutdown\nrouter ospf 1\n router-id 2.2.2.2\n network ${tr.network} ${tr.wildcard} area ${p1}\n network ${l2.network} ${l2.wildcard} area ${p1}\n passive-interface GigabitEthernet0/1\nend\nwrite memory`;
      } else if (mode === "ebgp") {
        r1 = `enable\nconfigure terminal\nhostname R1\ninterface GigabitEthernet0/0\n ip address ${tr.first} ${tr.mask}\n no shutdown\ninterface GigabitEthernet0/1\n ip address ${l1.first} ${l1.mask}\n no shutdown\nrouter bgp ${p1}\n neighbor ${tr.second} remote-as ${p2}\n network ${l1.network} mask ${l1.mask}\nend\nwrite memory`;
        r2 = `enable\nconfigure terminal\nhostname R2\ninterface GigabitEthernet0/0\n ip address ${tr.second} ${tr.mask}\n no shutdown\ninterface GigabitEthernet0/1\n ip address ${l2.first} ${l2.mask}\n no shutdown\nrouter bgp ${p2}\n neighbor ${tr.first} remote-as ${p1}\n network ${l2.network} mask ${l2.mask}\nend\nwrite memory`;
      } else if (mode === "ibgp") {
        r1 = `enable\nconfigure terminal\nhostname R1_Interne\ninterface GigabitEthernet0/0\n ip address ${tr.first} ${tr.mask}\n no shutdown\ninterface GigabitEthernet0/1\n ip address ${l1.first} ${l1.mask}\n no shutdown\nrouter bgp ${p1}\n neighbor ${tr.second} remote-as ${p1}\n network ${l1.network} mask ${l1.mask}\nend\nwrite memory`;
        r2 = `enable\nconfigure terminal\nhostname R2_Bordure\ninterface GigabitEthernet0/0\n ip address ${tr.second} ${tr.mask}\n no shutdown\ninterface GigabitEthernet0/1\n ip address ${l2.first} ${l2.mask}\n no shutdown\nrouter bgp ${p1}\n neighbor ${tr.first} remote-as ${p1}\n neighbor ${tr.first} next-hop-self\n network ${l2.network} mask ${l2.mask}\nend\nwrite memory`;
      } else {
        r1 = `! === R1 = ASBR (AS ${p1} : OSPF interne <-> eBGP vers AS ${p2}) ===\nenable\nconfigure terminal\nhostname R1_ASBR\ninterface GigabitEthernet0/0\n ip address ${tr.first} ${tr.mask}\n no shutdown\ninterface GigabitEthernet0/1\n ip address ${l1.first} ${l1.mask}\n no shutdown\nrouter ospf 1\n router-id 1.1.1.1\n network ${l1.network} ${l1.wildcard} area 0\n redistribute bgp ${p1} subnets\nexit\nrouter bgp ${p1}\n neighbor ${tr.second} remote-as ${p2}\n redistribute ospf 1\nend\nwrite memory`;
        r2 = `! === R2 = Pair eBGP externe (AS ${p2}) ===\nenable\nconfigure terminal\nhostname R2_AS${p2}\ninterface GigabitEthernet0/0\n ip address ${tr.second} ${tr.mask}\n no shutdown\ninterface GigabitEthernet0/1\n ip address ${l2.first} ${l2.mask}\n no shutdown\nrouter bgp ${p2}\n neighbor ${tr.first} remote-as ${p1}\n network ${l2.network} mask ${l2.mask}\nend\nwrite memory`;
      }

      out.innerHTML = `
        <p class="small muted" style="margin-top:0.75rem;">PC1 : IP <code>${l1.second}/${l1.cidr}</code> · Passerelle <code>${l1.first}</code> &nbsp;|&nbsp; PC2 : IP <code>${l2.second}/${l2.cidr}</code> · Passerelle <code>${l2.first}</code></p>
        <div class="grid-2">
          <div class="code-block">
            <div class="code-header"><span>Configuration complète R1</span><button type="button" class="copy-btn">Copier</button></div>
            <pre><code>${esc(r1)}</code></pre>
          </div>
          <div class="code-block">
            <div class="code-header"><span>Configuration complète R2</span><button type="button" class="copy-btn">Copier</button></div>
            <pre><code>${esc(r2)}</code></pre>
          </div>
        </div>
      `;
    }

    [modeEl, trEl, l1El, l2El, p1El, p2El, md5El].forEach((el) => el.addEventListener("input", update));
    update();
  }

  /* ========================================================================
     8. VIEW: TROUBLESHOOTING & COMMANDS (Module 7)
     ======================================================================== */
  function renderTroubleshooting(container) {
    const tr = DATA.COURS.troubleshooting;
    container.innerHTML = `
      <header class="page-hero">
        <div class="hero-meta">
          <span class="eyebrow">${esc(tr.eyebrow)}</span>
          <span class="badge badge-danger">Diagnostic rapide DSTP</span>
        </div>
        <h1>${esc(tr.title)}</h1>
        <p class="lead">${esc(tr.lead)}</p>
      </header>

      <section class="section-block">
        <div class="accordion-header">
          <h2 style="border:0;margin:0;padding:0;">🩺 1. Arbre de dépannage par symptôme (10 pannes classiques)</h2>
          <button type="button" class="btn btn-secondary btn-sm" command="--toggle-all" commandfor="trouble-acc" aria-expanded="false">
            <span class="expand">Tout déplier</span>
            <span class="collapse">Tout replier</span>
          </button>
        </div>
        <div class="accordion" id="trouble-acc">
          ${tr.symptoms
            .map(
              (s) => `
            <details id="${s.id}">
              <summary><span class="badge badge-blue">${esc(s.tag)}</span> ${esc(s.title)}</summary>
              <div class="details-body">
                <h4>Causes les plus fréquentes :</h4>
                <ul class="small">${s.causes.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
                <div class="grid-2">
                  <div class="code-block">
                    <div class="code-header"><span>Commandes de diagnostic</span><button type="button" class="copy-btn">Copier</button></div>
                    <pre><code>${esc(s.checks)}</code></pre>
                  </div>
                  <div class="code-block">
                    <div class="code-header"><span>Correctif type</span><button type="button" class="copy-btn">Copier</button></div>
                    <pre><code>${esc(s.fix)}</code></pre>
                  </div>
                </div>
              </div>
            </details>`
            )
            .join("")}
        </div>
      </section>

      <section class="section-block">
        <h2>⚖️ 2. Distances Administratives Cisco (AD)</h2>
        <div tabindex="0" role="region" aria-labelledby="cap-ad" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-ad">Ordre de fiabilité des sources de routage (plus petite AD = prioritaire pour un même préfixe)</caption>
            <thead><tr><th>Source de route</th><th>AD par défaut</th><th>Remarque examen</th></tr></thead>
            <tbody>
              ${tr.adTable
                .map(
                  (r) => `
                <tr>
                  <th scope="row">${esc(r.source)}</th>
                  <td data-label="AD"><strong>${esc(r.ad)}</strong></td>
                  <td data-label="Remarque">${esc(r.note)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="section-block">
        <h2>⌨️ 3. Catalogue complet des commandes IOS &amp; Linux</h2>
        <div class="field" style="max-inline-size:380px;margin-block-end:0.75rem;">
          <label for="cmd-filter">Filtrer les commandes</label>
          <input type="search" id="cmd-filter" placeholder="Ex : ospf, bgp, database, ip r...">
        </div>
        <div tabindex="0" role="region" aria-labelledby="cap-cmds" class="table-wrapper stack-mobile">
          <table>
            <caption id="cap-cmds">Commandes indispensables (CLI Cisco IOS &amp; Linux TP)</caption>
            <thead><tr><th>Catégorie</th><th>Commande</th><th>Ce qu'elle fait / affiche</th></tr></thead>
            <tbody id="cmd-tbody">
              ${tr.commands
                .map(
                  (c) => `
                <tr data-cmd-row="${esc((c.cat + " " + c.cmd + " " + c.desc).toLowerCase())}">
                  <th scope="row"><span class="badge badge-blue">${esc(c.cat)}</span></th>
                  <td data-label="Commande"><code>${esc(c.cmd)}</code></td>
                  <td data-label="Description">${esc(c.desc)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </section>
    `;

    const filter = document.getElementById("cmd-filter");
    filter?.addEventListener("input", () => {
      const q = filter.value.trim().toLowerCase();
      document.querySelectorAll("[data-cmd-row]").forEach((row) => {
        row.hidden = q !== "" && !row.dataset.cmdRow.includes(q);
      });
    });
  }

  /* ========================================================================
     9. VIEW: QUIZ HUB (QCM + DS BLANC + FLASHCARDS + EXERCICES)
     ======================================================================== */
  function renderQuizHub(container) {
    container.innerHTML = `
      <header class="page-hero">
        <div class="hero-meta">
          <span class="eyebrow">Module 8 · Entraînement Intensif</span>
          <span class="badge badge-green">${DATA.QUIZ.length} QCM · ${DATA.FLASHCARDS.length} Flashcards · ${DATA.EXERCISES.length} Exos</span>
        </div>
        <h1>QCM Corrigés, Mode DS Blanc, Flashcards &amp; Exercices Pratiques</h1>
        <p class="lead">Testez vos connaissances activement avec correction immédiate détaillée, simulez un DS chronométré de 20 questions, ou révisez rapidement avec les 54 flashcards recto-verso.</p>
      </header>

      <div class="tabs" id="quiz-tabs">
        <div class="tablist" role="tablist" aria-label="Modes d'entraînement">
          <button type="button" role="tab" id="tab-q-qcm" aria-selected="true" tabindex="0">📝 QCM &amp; DS Blanc (${DATA.QUIZ.length})</button>
          <button type="button" role="tab" id="tab-q-cards" aria-selected="false" tabindex="-1">🃏 Flashcards (${DATA.FLASHCARDS.length})</button>
          <button type="button" role="tab" id="tab-q-exos" aria-selected="false" tabindex="-1">✍️ Exercices Corrigés (${DATA.EXERCISES.length})</button>
        </div>

        <!-- TAB 1: QCM & DS BLANC -->
        <div role="tabpanel" id="panel-q-qcm" aria-labelledby="tab-q-qcm" tabindex="0">
          <div class="tab-panel-inner">
            <div class="section-block">
              <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.75rem;">
                <div class="search-quick-chips" style="margin:0;" id="qcm-filters">
                  <button type="button" class="chip active" data-qcat="all">Tout (${DATA.QUIZ.length})</button>
                  <button type="button" class="chip" data-qcat="internet">Internet &amp; AS</button>
                  <button type="button" class="chip" data-qcat="ospf">OSPF</button>
                  <button type="button" class="chip" data-qcat="bgp">BGP</button>
                  <button type="button" class="chip" data-qcat="redistribution">Redistrib. &amp; Dépannage</button>
                </div>
                <button type="button" class="btn btn-primary btn-sm" id="start-ds-btn">⏱️ Lancer un DS Blanc (20 questions · 20 min)</button>
              </div>
              <div id="qcm-stage" style="margin-block-start:1rem;"></div>
            </div>
          </div>
        </div>

        <!-- TAB 2: FLASHCARDS -->
        <div role="tabpanel" id="panel-q-cards" aria-labelledby="tab-q-cards" hidden="until-found">
          <div class="tab-panel-inner">
            <div class="section-block">
              <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:0.75rem;margin-block-end:0.75rem;">
                <div class="search-quick-chips" style="margin:0;" id="fc-filters">
                  <button type="button" class="chip active" data-fcat="all">Toutes (${DATA.FLASHCARDS.length})</button>
                  <button type="button" class="chip" data-fcat="todo">À revoir uniquement</button>
                  <button type="button" class="chip" data-fcat="Internet">Internet</button>
                  <button type="button" class="chip" data-fcat="OSPF">OSPF</button>
                  <button type="button" class="chip" data-fcat="BGP">BGP</button>
                  <button type="button" class="chip" data-fcat="Redistrib">Redistrib.</button>
                  <button type="button" class="chip" data-fcat="Dépannage">Dépannage</button>
                </div>
                <button type="button" class="btn btn-secondary btn-sm" id="fc-shuffle-btn">🔀 Mélanger</button>
              </div>
              <div id="fc-stage"></div>
            </div>
          </div>
        </div>

        <!-- TAB 3: EXERCICES CORRIGÉS -->
        <div role="tabpanel" id="panel-q-exos" aria-labelledby="tab-q-exos" hidden="until-found">
          <div class="tab-panel-inner">
            <section class="section-block">
              <div class="accordion-header">
                <h2 style="border:0;margin:0;padding:0;">✍️ Exercices types DS &amp; DSTP (dépliez pour voir le corrigé)</h2>
                <button type="button" class="btn btn-secondary btn-sm" command="--toggle-all" commandfor="exos-acc" aria-expanded="false">
                  <span class="expand">Tout déplier</span>
                  <span class="collapse">Tout replier</span>
                </button>
              </div>
              <div class="accordion" id="exos-acc">
                ${DATA.EXERCISES.map(
                  (ex, i) => `
                  <details>
                    <summary>${esc(ex.title)}</summary>
                    <div class="details-body">
                      <p><strong>Énoncé :</strong> ${esc(ex.prompt).replace(/\n/g, "<br>")}</p>
                      <div class="callout callout-success">
                        <strong class="callout-title">✅ Correction détaillée :</strong>
                        ${ex.solution}
                      </div>
                    </div>
                  </details>`
                ).join("")}
              </div>
            </section>
          </div>
        </div>
      </div>
    `;

    initTabs(document.getElementById("quiz-tabs"));
    initQcmEngine();
    initFlashcardsEngine();
  }

  function shuffleArr(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function initQcmEngine() {
    let pool = DATA.QUIZ.slice();
    let idx = 0;
    let score = 0;
    let answered = false;
    let isDsMode = false;
    let remainingSec = 1200;
    const stage = document.getElementById("qcm-stage");

    function stopTimer() {
      if (dsTimerInterval) {
        clearInterval(dsTimerInterval);
        dsTimerInterval = null;
      }
    }

    function renderQuestion() {
      if (idx >= pool.length) {
        stopTimer();
        const pct = Math.round((score / pool.length) * 100);
        if (isDsMode) {
          const note20 = Math.round((score / pool.length) * 20);
          if (state.bestDsScore === null || note20 > state.bestDsScore) {
            state.bestDsScore = note20;
            saveState();
          }
        }
        stage.innerHTML = `
          <div class="quiz-card" style="text-align:center;">
            <h2>🏁 Série terminée !</h2>
            <p style="font-size:2rem;font-weight:800;margin:0.5rem 0;color:${pct >= 75 ? "var(--success)" : "var(--warn)"};">${score} / ${pool.length} (${pct}%)</p>
            <p class="muted">${pct >= 85 ? "Excellent niveau ! Tu es prêt(e) pour le DS !" : pct >= 60 ? "Bon début ! Revois les points ratés et relance une série." : "Continue de réviser les fiches et flashcards, tu vas vite progresser !"}</p>
            <button type="button" class="btn btn-primary" id="qcm-restart-btn">Recommencer cette série</button>
          </div>
        `;
        document.getElementById("qcm-restart-btn")?.addEventListener("click", () => {
          idx = 0;
          score = 0;
          pool = shuffleArr(pool);
          renderQuestion();
        });
        return;
      }

      answered = false;
      const item = pool[idx];
      const mins = Math.floor(remainingSec / 60);
      const secs = String(remainingSec % 60).padStart(2, "0");

      stage.innerHTML = `
        <div class="quiz-card">
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:0.5rem;margin-block-end:0.65rem;">
            <span class="badge badge-blue">${isDsMode ? "DS BLANC" : item.cat.toUpperCase()} · Question ${idx + 1} / ${pool.length}</span>
            <span class="small"><strong>Score : ${score} / ${idx}</strong>${isDsMode ? ` &nbsp;|&nbsp; <strong id="ds-clock">⏱️ ${mins}:${secs}</strong>` : ""}</span>
          </div>
          <h3 style="margin-top:0;color:var(--text);">${esc(item.q)}</h3>
          <div class="quiz-options">
            ${item.opts
              .map(
                (o, i) => `
              <button type="button" class="quiz-option" data-opt="${i}">
                <span class="quiz-opt-letter">${String.fromCharCode(65 + i)}</span>
                <span>${esc(o)}</span>
              </button>`
              )
              .join("")}
          </div>
          <div id="qcm-feedback"></div>
        </div>
      `;

      stage.querySelectorAll(".quiz-option").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          const chosen = Number(btn.dataset.opt);
          const ok = chosen === item.ans;
          if (ok) score++;
          stage.querySelectorAll(".quiz-option").forEach((b, i) => {
            b.disabled = true;
            if (i === item.ans) b.classList.add("correct");
            else if (i === chosen && !ok) b.classList.add("wrong");
          });
          document.getElementById("qcm-feedback").innerHTML = `
            <div class="callout ${ok ? "callout-success" : "callout-danger"}">
              <strong class="callout-title">${ok ? "✅ Bonne réponse !" : "❌ Mauvaise réponse"}</strong>
              ${esc(item.exp)}
            </div>
            <button type="button" class="btn btn-primary" id="qcm-next-btn">${idx + 1 < pool.length ? "Question suivante →" : "Voir le bilan final"}</button>
          `;
          document.getElementById("qcm-next-btn")?.addEventListener("click", () => {
            idx++;
            renderQuestion();
          });
        });
      });
    }

    document.querySelectorAll("#qcm-filters .chip").forEach((c) => {
      c.addEventListener("click", () => {
        stopTimer();
        isDsMode = false;
        document.querySelectorAll("#qcm-filters .chip").forEach((x) => x.classList.remove("active"));
        c.classList.add("active");
        const cat = c.dataset.qcat;
        pool = cat === "all" ? DATA.QUIZ.slice() : DATA.QUIZ.filter((q) => q.cat === cat);
        idx = 0;
        score = 0;
        renderQuestion();
      });
    });

    document.getElementById("start-ds-btn")?.addEventListener("click", () => {
      stopTimer();
      isDsMode = true;
      remainingSec = 20 * 60;
      pool = shuffleArr(DATA.QUIZ).slice(0, 20);
      idx = 0;
      score = 0;
      renderQuestion();
      dsTimerInterval = setInterval(() => {
        remainingSec--;
        const clk = document.getElementById("ds-clock");
        if (clk) {
          const m = Math.floor(Math.max(0, remainingSec) / 60);
          const s = String(Math.max(0, remainingSec) % 60).padStart(2, "0");
          clk.textContent = `⏱️ ${m}:${s}`;
        }
        if (remainingSec <= 0) {
          stopTimer();
          idx = pool.length;
          renderQuestion();
        }
      }, 1000);
    });

    renderQuestion();
  }

  function initFlashcardsEngine() {
    let cards = DATA.FLASHCARDS.map((c, i) => ({ ...c, id: i }));
    let pos = 0;
    let flipped = false;
    const stage = document.getElementById("fc-stage");

    function renderCard() {
      if (cards.length === 0) {
        stage.innerHTML = `<div class="callout callout-success">🎉 Toutes les flashcards de ce filtre sont déjà maîtrisées ! Choisissez un autre filtre ou "Toutes".</div>`;
        return;
      }
      if (pos >= cards.length) pos = 0;
      const c = cards[pos];
      const isOk = !!state.masteredCards[c.id];
      stage.innerHTML = `
        <div class="flashcard-stage">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-block-end:0.6rem;font-size:0.85rem;">
            <span class="badge badge-purple">${esc(c.cat)}</span>
            <span class="muted">Carte <strong>${pos + 1}</strong> / ${cards.length} ${isOk ? "· ✅ Maîtrisée" : ""}</span>
          </div>
          <div class="flashcard ${flipped ? "flipped" : ""}" id="fc-card" role="button" tabindex="0" aria-label="Cliquer ou appuyer sur Espace pour retourner la carte">
            <span class="flashcard-face-label">${flipped ? "💡 RÉPONSE" : "❓ QUESTION (cliquez pour retourner)"}</span>
            <div class="flashcard-content">${esc(flipped ? c.a : c.q)}</div>
            <span class="small muted">${flipped ? "Évaluez votre maîtrise ci-dessous :" : "Essayez de formuler la réponse à voix haute avant de retourner."}</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:0.5rem;margin-block-start:0.85rem;">
            <button type="button" class="btn btn-secondary" id="fc-prev">← Précédente</button>
            <div style="display:flex;gap:0.5rem;">
              <button type="button" class="btn btn-danger" id="fc-todo">🔁 À revoir</button>
              <button type="button" class="btn btn-success" id="fc-ok">✅ Je maîtrise</button>
            </div>
            <button type="button" class="btn btn-secondary" id="fc-next">Suivante →</button>
          </div>
        </div>
      `;

      const cardEl = document.getElementById("fc-card");
      const flip = () => {
        flipped = !flipped;
        renderCard();
      };
      cardEl.addEventListener("click", flip);
      cardEl.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          flip();
        }
      });
      document.getElementById("fc-prev").addEventListener("click", () => {
        pos = (pos - 1 + cards.length) % cards.length;
        flipped = false;
        renderCard();
      });
      document.getElementById("fc-next").addEventListener("click", () => {
        pos = (pos + 1) % cards.length;
        flipped = false;
        renderCard();
      });
      document.getElementById("fc-ok").addEventListener("click", () => {
        state.masteredCards[c.id] = true;
        saveState();
        pos = (pos + 1) % cards.length;
        flipped = false;
        renderCard();
      });
      document.getElementById("fc-todo").addEventListener("click", () => {
        state.masteredCards[c.id] = false;
        saveState();
        pos = (pos + 1) % cards.length;
        flipped = false;
        renderCard();
      });
    }

    document.querySelectorAll("#fc-filters .chip").forEach((ch) => {
      ch.addEventListener("click", () => {
        document.querySelectorAll("#fc-filters .chip").forEach((x) => x.classList.remove("active"));
        ch.classList.add("active");
        const f = ch.dataset.fcat;
        const all = DATA.FLASHCARDS.map((c, i) => ({ ...c, id: i }));
        if (f === "all") cards = all;
        else if (f === "todo") cards = all.filter((c) => !state.masteredCards[c.id]);
        else cards = all.filter((c) => c.cat === f);
        pos = 0;
        flipped = false;
        renderCard();
      });
    });

    document.getElementById("fc-shuffle-btn")?.addEventListener("click", () => {
      cards = shuffleArr(cards);
      pos = 0;
      flipped = false;
      renderCard();
      toast("Cartes mélangées !");
    });

    renderCard();
  }

  /* ========================================================================
     10. VIEW: GLOSSARY & TOP 15 TRAPS (Module 9)
     ======================================================================== */
  function renderGlossary(container) {
    const gl = DATA.COURS.glossary;
    container.innerHTML = `
      <header class="page-hero">
        <div class="hero-meta">
          <span class="eyebrow">${esc(gl.eyebrow)}</span>
          <span class="badge badge-warn">Top 15 Anti-Pièges + ${gl.terms.length} Définitions</span>
        </div>
        <h1>${esc(gl.title)}</h1>
        <p class="lead">${esc(gl.lead)}</p>
      </header>

      <section class="section-block">
        <h2>🚨 Top 15 des Pièges Classiques en DS &amp; DSTP</h2>
        <div class="grid-2">
          ${gl.traps
            .map(
              (tr) => `
            <div class="callout callout-warn" style="margin:0;">
              <strong class="callout-title">${esc(tr.title)}</strong>
              <span class="small">${esc(tr.desc)}</span>
            </div>`
            )
            .join("")}
        </div>
      </section>

      <section class="section-block">
        <h2>📖 Glossaire Technique Complet (${gl.terms.length} termes)</h2>
        <div class="field" style="max-inline-size:400px;margin-block-end:0.85rem;">
          <label for="gloss-filter">Rechercher un terme</label>
          <input type="search" id="gloss-filter" placeholder="Ex : LSA, ASBR, MED, RENATER, Wildcard...">
        </div>
        <div class="grid-2" id="gloss-grid">
          ${gl.terms
            .map(
              (item) => `
            <div class="card" data-gloss="${esc((item.t + " " + item.c + " " + item.d).toLowerCase())}">
              <div style="display:flex;justify-content:space-between;align-items:center;gap:0.5rem;margin-block-end:0.35rem;">
                <h4 style="margin:0;">${esc(item.t)}</h4>
                <span class="badge badge-blue">${esc(item.c)}</span>
              </div>
              <p class="small muted" style="margin:0;">${esc(item.d)}</p>
            </div>`
            )
            .join("")}
        </div>
      </section>
    `;

    const input = document.getElementById("gloss-filter");
    input?.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      document.querySelectorAll("[data-gloss]").forEach((card) => {
        card.hidden = q !== "" && !card.dataset.gloss.includes(q);
      });
    });
  }

  /* ========================================================================
     11. GLOBAL SEARCH INDEX & MODAL (Ctrl+K / /)
     ======================================================================== */
  function buildSearchIndex() {
    const idx = [];
    const shortNames = {
      internet: "Internet & AS",
      ospf: "OSPF",
      bgp: "BGP",
      redistribution: "Redistribution"
    };
    ["internet", "ospf", "bgp", "redistribution"].forEach((k) => {
      const m = DATA.COURS[k];
      const plain = m.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
      idx.push({ title: m.title, sub: m.eyebrow, text: (m.title + " " + plain).toLowerCase(), route: k });
      m.toc.forEach((t) => {
        idx.push({ title: `${shortNames[k]} — ${t.label}`, sub: "Section de cours", text: (t.label + " " + m.title).toLowerCase(), route: k, anchor: t.id });
      });
    });
    DATA.LABS.forEach((l) => {
      idx.push({ title: l.title, sub: `TP / TD (${l.badge})`, text: (l.title + " " + l.summary + " " + l.outputs).toLowerCase(), route: "labs" });
    });
    DATA.COURS.troubleshooting.symptoms.forEach((s) => {
      idx.push({ title: `Dépannage : ${s.title}`, sub: `Symptôme ${s.tag}`, text: (s.title + " " + s.causes.join(" ") + " " + s.fix).toLowerCase(), route: "troubleshooting", anchor: s.id });
    });
    DATA.COURS.troubleshooting.commands.forEach((c) => {
      idx.push({ title: c.cmd, sub: `Commande ${c.cat}`, text: (c.cmd + " " + c.desc).toLowerCase(), route: "troubleshooting" });
    });
    DATA.COURS.glossary.traps.forEach((tr) => {
      idx.push({ title: `Anti-Piège : ${tr.title}`, sub: "Module 9 · Anti-Pièges", text: (tr.title + " " + tr.desc).toLowerCase(), route: "glossary" });
    });
    DATA.COURS.glossary.terms.forEach((g) => {
      idx.push({ title: g.t, sub: `Glossaire · ${g.c}`, text: (g.t + " " + g.d).toLowerCase(), route: "glossary" });
    });
    return idx;
  }

  function initGlobalSearch() {
    const index = buildSearchIndex();
    const modal = document.getElementById("search-modal");
    const input = document.getElementById("global-search-input");
    const resultsEl = document.getElementById("search-results");
    const countEl = document.getElementById("search-results-count");

    function runSearch(query) {
      const q = query.trim().toLowerCase();
      if (!q) {
        countEl.textContent = "Tapez un mot-clé";
        resultsEl.innerHTML = `<p class="small muted">Exemples : <code>LSA 5</code>, <code>next-hop-self</code>, <code>totally stub</code>, <code>224.0.0.5</code>, <code>RENATER</code>, <code>Active</code>, <code>subnets</code>...</p>`;
        return;
      }
      const words = q.split(/\s+/).filter(Boolean);
      const hits = index.filter((item) => words.every((w) => item.text.includes(w))).slice(0, 25);
      countEl.textContent = `${hits.length} résultat(s)`;
      if (!hits.length) {
        resultsEl.innerHTML = `<p class="small muted">Aucun résultat pour « ${esc(query)} ». Essayez un mot plus court.</p>`;
        return;
      }
      resultsEl.innerHTML = hits
        .map(
          (h, i) => `
        <button type="button" class="search-result-item" data-hit="${i}">
          <strong>${esc(h.title)}</strong>
          <small>${esc(h.sub)}</small>
        </button>`
        )
        .join("");

      resultsEl.querySelectorAll("[data-hit]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const hit = hits[Number(btn.dataset.hit)];
          modal.close();
          window.location.hash = `#${hit.route}`;
          navigate(hit.route, hit.anchor);
        });
      });
    }

    input?.addEventListener("input", () => runSearch(input.value));
    document.querySelectorAll("#search-quick-chips .chip").forEach((c) => {
      c.addEventListener("click", () => {
        input.value = c.dataset.q;
        runSearch(input.value);
        input.focus();
      });
    });

    // Global keyboard shortcut: Ctrl+K or /
    document.addEventListener("keydown", (e) => {
      const tag = document.activeElement?.tagName;
      const inInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!modal.open) modal.showModal();
        input.focus();
        input.select();
      } else if (e.key === "/" && !inInput && !modal.open) {
        e.preventDefault();
        modal.showModal();
        input.focus();
      }
    });

    runSearch("");
  }

  /* ========================================================================
     12. BOOTSTRAP & EVENT WIRING
     ======================================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initModernWebFallbacks();
    syncSettingsThemeRadios();
    initGlobalSearch();

    // Theme controls
    document.getElementById("theme-toggle-btn")?.addEventListener("click", toggleTwoStateTheme);
    document.querySelectorAll('input[name="theme-pref"]').forEach((r) => {
      r.addEventListener("change", () => {
        setStoredScheme(r.value === "system" ? null : r.value);
      });
    });

    // Settings actions
    document.getElementById("print-current-btn")?.addEventListener("click", () => {
      document.getElementById("settings-modal")?.close();
      window.print();
    });
    document.getElementById("reset-progress-btn")?.addEventListener("click", () => {
      if (window.confirm("Effacer toute votre progression (chapitres, flashcards, score DS) ?")) {
        state = structuredClone(DEFAULT_STATE);
        saveState();
        document.getElementById("settings-modal")?.close();
        navigate(currentRoute);
        toast("Progression réinitialisée.");
      }
    });

    // Mobile sidebar toggle
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const sidebar = document.getElementById("sidebar");
    const backdrop = document.getElementById("sidebar-backdrop");
    mobileBtn?.addEventListener("click", () => {
      const open = sidebar.classList.toggle("open");
      backdrop.hidden = !open;
      mobileBtn.setAttribute("aria-expanded", String(open));
    });
    backdrop?.addEventListener("click", closeMobileSidebar);

    // Delegated SPA navigation & Copy-to-clipboard buttons
    document.addEventListener("click", (e) => {
      const navLink = e.target.closest("[data-nav]");
      if (navLink) {
        e.preventDefault();
        const target = navLink.dataset.nav;
        if (window.location.hash !== `#${target}`) window.location.hash = `#${target}`;
        else navigate(target);
        return;
      }

      const stepBtn = e.target.closest(".step-node");
      if (stepBtn) {
        const stepper = stepBtn.closest("[data-stepper]");
        if (stepper) {
          const type = stepper.dataset.stepper;
          const descs = type === "ospf-states" ? OSPF_STATES_DESC : BGP_STATES_DESC;
          const out = document.getElementById(`stepper-${type}-out`);
          stepper.querySelectorAll(".step-node").forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-pressed", "false");
          });
          stepBtn.classList.add("active");
          stepBtn.setAttribute("aria-pressed", "true");
          if (out) out.innerHTML = descs[Number(stepBtn.dataset.step)] || "";
        }
        return;
      }

      const copyBtn = e.target.closest(".copy-btn");
      if (copyBtn) {
        const pre = copyBtn.closest(".code-block")?.querySelector("pre");
        if (!pre) return;
        const text = pre.textContent;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(
            () => {
              copyBtn.textContent = "Copié ✓";
              setTimeout(() => (copyBtn.textContent = "Copier"), 1600);
              toast("Commandes copiées dans le presse-papiers !");
            },
            () => fallbackCopy(text, copyBtn)
          );
        } else {
          fallbackCopy(text, copyBtn);
        }
      }
    });

    function fallbackCopy(text, btn) {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        btn.textContent = "Copié ✓";
        setTimeout(() => (btn.textContent = "Copier"), 1600);
        toast("Commandes copiées !");
      } catch {
        toast("Impossible de copier automatiquement.");
      }
      ta.remove();
    }

    // Hash routing
    window.addEventListener("hashchange", () => {
      const route = window.location.hash.replace(/^#/, "") || "dashboard";
      navigate(route);
    });

    const initialRoute = window.location.hash.replace(/^#/, "") || "dashboard";
    navigate(initialRoute);
  });
})();
