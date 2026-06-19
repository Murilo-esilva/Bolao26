import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    collection,
    doc,
    getDoc,
    getFirestore,
    getDocs,
    onSnapshot,
    query,
    serverTimestamp,
    setDoc,
    where,
    writeBatch
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Cole aqui as credenciais do seu projeto Firebase.
const firebaseConfig = {
    apiKey: "AIzaSyA-ZghBgwt_-2h_vnxiSL5aI-ijsM6dXP8",
    authDomain: "bolao26-3f240.firebaseapp.com",
    projectId: "bolao26-3f240",
    storageBucket: "bolao26-3f240.firebasestorage.app",
    messagingSenderId: "433584903321",
    appId: "1:433584903321:web:cc8d925ca167856242d408"
};

const ADMIN_PASSWORD = "COPA2026";
const DEFAULT_GROUP_ID = "geral";
const DEFAULT_GROUP_NAME = "Geral";

// ─── Configuração da API de resultados ────────────────────────────────────────
// A chave da API fica no Cloudflare Worker (worker.js), NUNCA exposta aqui.
// Após o deploy do Worker, cole a URL gerada abaixo:
const PROXY_BASE_URL = "https://empty-hill-55bd.murilo-infouem.workers.dev";
const base = PROXY_BASE_URL.replace(/\/+$/, ""); // remove barra final se houver
const res = await fetch(`${base}/matches/finished`, { method: "GET" });

// Intervalo de polling enquanto há jogo ao vivo (ms)
const POLL_INTERVAL_LIVE = 60_000;  // 60s durante jogos ao vivo
const POLL_INTERVAL_IDLE = 300_000; // 5min sem jogos ativos

const matches = [
  { "id": 537397, "utcDate": "2026-06-17T01:00:00Z", "status": "FINISHED", "homeTeam": "Argentina", "awayTeam": "Algeria" },
  { "id": 537398, "utcDate": "2026-06-17T04:00:00Z", "status": "FINISHED", "homeTeam": "Austria", "awayTeam": "Jordan" },
  { "id": 537403, "utcDate": "2026-06-17T17:00:00Z", "status": "FINISHED", "homeTeam": "Portugal", "awayTeam": "Congo DR" },
  { "id": 537409, "utcDate": "2026-06-17T20:00:00Z", "status": "FINISHED", "homeTeam": "England", "awayTeam": "Croatia" },
  { "id": 537410, "utcDate": "2026-06-17T23:00:00Z", "status": "FINISHED", "homeTeam": "Ghana", "awayTeam": "Panama" },
  { "id": 537404, "utcDate": "2026-06-18T02:00:00Z", "status": "FINISHED", "homeTeam": "Uzbekistan", "awayTeam": "Colombia" },
  { "id": 537329, "utcDate": "2026-06-18T16:00:00Z", "status": "FINISHED", "homeTeam": "Czechia", "awayTeam": "South Africa" },
  { "id": 537335, "utcDate": "2026-06-18T19:00:00Z", "status": "FINISHED", "homeTeam": "Switzerland", "awayTeam": "Bosnia-Herzegovina" },
  { "id": 537336, "utcDate": "2026-06-18T22:00:00Z", "status": "TIMED", "homeTeam": "Canada", "awayTeam": "Qatar" },
  { "id": 537330, "utcDate": "2026-06-19T01:00:00Z", "status": "TIMED", "homeTeam": "Mexico", "awayTeam": "South Korea" },
  { "id": 537348, "utcDate": "2026-06-19T19:00:00Z", "status": "TIMED", "homeTeam": "United States", "awayTeam": "Australia" },
  { "id": 537342, "utcDate": "2026-06-19T22:00:00Z", "status": "TIMED", "homeTeam": "Scotland", "awayTeam": "Morocco" },
  { "id": 537341, "utcDate": "2026-06-20T00:30:00Z", "status": "TIMED", "homeTeam": "Brazil", "awayTeam": "Haiti" },
  { "id": 537347, "utcDate": "2026-06-20T03:00:00Z", "status": "TIMED", "homeTeam": "Turkey", "awayTeam": "Paraguay" },
  { "id": 537359, "utcDate": "2026-06-20T17:00:00Z", "status": "TIMED", "homeTeam": "Netherlands", "awayTeam": "Sweden" },
  { "id": 537353, "utcDate": "2026-06-20T20:00:00Z", "status": "TIMED", "homeTeam": "Germany", "awayTeam": "Ivory Coast" },
  { "id": 537354, "utcDate": "2026-06-21T00:00:00Z", "status": "TIMED", "homeTeam": "Ecuador", "awayTeam": "Curaçao" },
  { "id": 537360, "utcDate": "2026-06-21T04:00:00Z", "status": "TIMED", "homeTeam": "Tunisia", "awayTeam": "Japan" },
  { "id": 537371, "utcDate": "2026-06-21T16:00:00Z", "status": "TIMED", "homeTeam": "Spain", "awayTeam": "Saudi Arabia" },
  { "id": 537365, "utcDate": "2026-06-21T19:00:00Z", "status": "TIMED", "homeTeam": "Belgium", "awayTeam": "Iran" },
  { "id": 537372, "utcDate": "2026-06-21T22:00:00Z", "status": "TIMED", "homeTeam": "Uruguay", "awayTeam": "Cape Verde Islands" },
  { "id": 537366, "utcDate": "2026-06-22T01:00:00Z", "status": "TIMED", "homeTeam": "New Zealand", "awayTeam": "Egypt" },
  { "id": 537399, "utcDate": "2026-06-22T17:00:00Z", "status": "TIMED", "homeTeam": "Argentina", "awayTeam": "Austria" },
  { "id": 537393, "utcDate": "2026-06-22T21:00:00Z", "status": "TIMED", "homeTeam": "France", "awayTeam": "Iraq" },
  { "id": 537394, "utcDate": "2026-06-23T00:00:00Z", "status": "TIMED", "homeTeam": "Norway", "awayTeam": "Senegal" },
  { "id": 537400, "utcDate": "2026-06-23T03:00:00Z", "status": "TIMED", "homeTeam": "Jordan", "awayTeam": "Algeria" },
  { "id": 537405, "utcDate": "2026-06-23T17:00:00Z", "status": "TIMED", "homeTeam": "Portugal", "awayTeam": "Uzbekistan" },
  { "id": 537411, "utcDate": "2026-06-23T20:00:00Z", "status": "TIMED", "homeTeam": "England", "awayTeam": "Ghana" },
  { "id": 537412, "utcDate": "2026-06-23T23:00:00Z", "status": "TIMED", "homeTeam": "Panama", "awayTeam": "Croatia" },
  { "id": 537406, "utcDate": "2026-06-24T02:00:00Z", "status": "TIMED", "homeTeam": "Colombia", "awayTeam": "Congo DR" },
  { "id": 537337, "utcDate": "2026-06-24T19:00:00Z", "status": "TIMED", "homeTeam": "Switzerland", "awayTeam": "Canada" },
  { "id": 537338, "utcDate": "2026-06-24T19:00:00Z", "status": "TIMED", "homeTeam": "Bosnia-Herzegovina", "awayTeam": "Qatar" },
  { "id": 537343, "utcDate": "2026-06-24T22:00:00Z", "status": "TIMED", "homeTeam": "Scotland", "awayTeam": "Brazil" },
  { "id": 537344, "utcDate": "2026-06-24T22:00:00Z", "status": "TIMED", "homeTeam": "Morocco", "awayTeam": "Haiti" },
  { "id": 537331, "utcDate": "2026-06-25T01:00:00Z", "status": "TIMED", "homeTeam": "Czechia", "awayTeam": "Mexico" },
  { "id": 537332, "utcDate": "2026-06-25T01:00:00Z", "status": "TIMED", "homeTeam": "South Africa", "awayTeam": "South Korea" },
  { "id": 537355, "utcDate": "2026-06-25T20:00:00Z", "status": "TIMED", "homeTeam": "Ecuador", "awayTeam": "Germany" },
  { "id": 537356, "utcDate": "2026-06-25T20:00:00Z", "status": "TIMED", "homeTeam": "Curaçao", "awayTeam": "Ivory Coast" },
  { "id": 537361, "utcDate": "2026-06-25T23:00:00Z", "status": "TIMED", "homeTeam": "Tunisia", "awayTeam": "Netherlands" },
  { "id": 537362, "utcDate": "2026-06-25T23:00:00Z", "status": "TIMED", "homeTeam": "Japan", "awayTeam": "Sweden" },
  { "id": 537349, "utcDate": "2026-06-26T02:00:00Z", "status": "TIMED", "homeTeam": "Turkey", "awayTeam": "United States" },
  { "id": 537350, "utcDate": "2026-06-26T02:00:00Z", "status": "TIMED", "homeTeam": "Paraguay", "awayTeam": "Australia" },
  { "id": 537395, "utcDate": "2026-06-26T19:00:00Z", "status": "TIMED", "homeTeam": "Norway", "awayTeam": "France" },
  { "id": 537396, "utcDate": "2026-06-26T19:00:00Z", "status": "TIMED", "homeTeam": "Senegal", "awayTeam": "Iraq" },
  { "id": 537373, "utcDate": "2026-06-27T00:00:00Z", "status": "TIMED", "homeTeam": "Uruguay", "awayTeam": "Spain" },
  { "id": 537374, "utcDate": "2026-06-27T00:00:00Z", "status": "TIMED", "homeTeam": "Cape Verde Islands", "awayTeam": "Saudi Arabia" }
];

const state = {
    db: null,
    groupId: DEFAULT_GROUP_ID,
    groupName: DEFAULT_GROUP_NAME,
    participantId: "",
    participantName: "",
    isGroupAuthenticated: false,
    unsubscribePredictions: null,
    unsubscribeAllPredictions: null,
    unsubscribeRanking: null,
    unsubscribeParticipants: null,
    unsubscribeResults: null,
    participants: [],
    predictions: [],
    results: new Map(),

    // ── Controle de polling de resultados ──────────────────────────────────
    pollTimer:  null,   // referência do setInterval ativo
    lastSyncAt: null,   // Date da última sincronização com a API
    isSyncing:  false,  // lock para evitar chamadas simultâneas
};

const flags = {
    "Algeria": "🇩🇿", "Argentina": "🇦🇷", "Australia": "🇦🇺", "Austria": "🇦🇹", "Belgium": "🇧🇪",
    "Bosnia-Herzegovina": "🇧🇦", "Brazil": "🇧🇷", "Canada": "🇨🇦", "Cape Verde Islands": "🇨🇻",
    "Colombia": "🇨🇴", "Congo DR": "🇨🇩", "Croatia": "🇭🇷", "Curaçao": "🇨🇼", "Czechia": "🇨🇿",
    "Ecuador": "🇪🇨", "Egypt": "🇪🇬", "England": "🏴", "France": "🇫🇷", "Germany": "🇩🇪",
    "Ghana": "🇬🇭", "Haiti": "🇭🇹", "Iran": "🇮🇷", "Iraq": "🇮🇶", "Ivory Coast": "🇨🇮",
    "Japan": "🇯🇵", "Jordan": "🇯🇴", "Mexico": "🇲🇽", "Morocco": "🇲🇦", "Netherlands": "🇳🇱",
    "New Zealand": "🇳🇿", "Norway": "🇳🇴", "Panama": "🇵🇦", "Paraguay": "🇵🇾", "Portugal": "🇵🇹",
    "Qatar": "🇶🇦", "Saudi Arabia": "🇸🇦", "Scotland": "🏴", "Senegal": "🇸🇳", "South Africa": "🇿🇦",
    "South Korea": "🇰🇷", "Spain": "🇪🇸", "Sweden": "🇸🇪", "Switzerland": "🇨🇭", "Tunisia": "🇹🇳",
    "Turkey": "🇹🇷", "United States": "🇺🇸", "Uruguay": "🇺🇾", "Uzbekistan": "🇺🇿"
};

const flagCodes = {
    "Algeria": "dz", "Argentina": "ar", "Australia": "au", "Austria": "at", "Belgium": "be",
    "Bosnia-Herzegovina": "ba", "Brazil": "br", "Canada": "ca", "Cape Verde Islands": "cv",
    "Colombia": "co", "Congo DR": "cd", "Croatia": "hr", "Curaçao": "cw", "Czechia": "cz",
    "Ecuador": "ec", "Egypt": "eg", "England": "gb-eng", "France": "fr", "Germany": "de",
    "Ghana": "gh", "Haiti": "ht", "Iran": "ir", "Iraq": "iq", "Ivory Coast": "ci",
    "Japan": "jp", "Jordan": "jo", "Mexico": "mx", "Morocco": "ma", "Netherlands": "nl",
    "New Zealand": "nz", "Norway": "no", "Panama": "pa", "Paraguay": "py", "Portugal": "pt",
    "Qatar": "qa", "Saudi Arabia": "sa", "Scotland": "gb-sct", "Senegal": "sn", "South Africa": "za",
    "South Korea": "kr", "Spain": "es", "Sweden": "se", "Switzerland": "ch", "Tunisia": "tn",
    "Turkey": "tr", "United States": "us", "Uruguay": "uy", "Uzbekistan": "uz"
};

const els = {
    adminDialog: document.getElementById("adminDialog"),
    adminLogin: document.getElementById("adminLogin"),
    adminMessage: document.getElementById("adminMessage"),
    adminOpen: document.getElementById("adminOpen"),
    adminPanel: document.getElementById("adminPanel"),
    adminPassword: document.getElementById("adminPassword"),
    adminResults: document.getElementById("adminResults"),
    adminUnlock: document.getElementById("adminUnlock"),
    activeGroupName: document.getElementById("activeGroupName"),
    bolaoForm: document.getElementById("bolaoForm"),
    connectionStatus: document.getElementById("connectionStatus"),
    gamesContainer: document.getElementById("games-container"),
    groupName: document.getElementById("groupName"),
    loadingOverlay: document.getElementById("loadingOverlay"),
    participantName: document.getElementById("participantName"),
    rankingBody: document.getElementById("rankingBody"),
    recalculateRanking: document.getElementById("recalculateRanking"),
    resultsBoard: document.getElementById("resultsBoard"),
    resultsCount: document.getElementById("resultsCount"),
    savedPredictions: document.getElementById("savedPredictions"),
    totalGames: document.getElementById("totalGames"),
    totalParticipants: document.getElementById("totalParticipants"),
    totalResults: document.getElementById("totalResults"),
    groupPassword: document.getElementById("groupPassword"), // <--- NOVO
    btnEnterGroup: document.getElementById("btnEnterGroup"), // <--- NOVO
    loadingOverlay: document.getElementById("loadingOverlay"),
    btnSyncApi:      document.getElementById("btnSyncApi"),
    syncMessage:     document.getElementById("syncMessage"),
    autoSyncBadge:   document.getElementById("autoSyncBadge")
};

start();

function start() {
    els.totalGames.textContent = String(matches.length);

    // Lê o grupo da URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlGroup = urlParams.get('grupo');
    
    if (urlGroup) {
        els.groupName.value = urlGroup;
        setConnection("Digite a senha do grupo");
    }

    renderGames();
    renderAdminResults();
    bindEvents();

    if (!isFirebaseConfigured(firebaseConfig)) {
        setConnection("Configure o Firebase");
        hideLoading();
        return;
    }

    try {
        const app = initializeApp(firebaseConfig);
        state.db = getFirestore(app);
        
        // Carrega APENAS os resultados oficiais, pois são globais
        listenToResults(); 
    } catch (error) {
        console.error(error);
        setConnection("Erro no Firebase");
    } finally {
        hideLoading();
    }

    // Inicia sincronização automática com football-data.org (se a chave estiver configurada)
    startAutoSync();
}

function bindEvents() {
    document.querySelectorAll(".tab-button").forEach((button) => {
        button.addEventListener("click", () => activateTab(button.dataset.tab));
    });

    // Novos eventos para a senha
    els.btnEnterGroup.addEventListener("click", authenticateGroup);
    els.groupPassword.addEventListener("keypress", (e) => {
        if (e.key === "Enter") authenticateGroup();
    });

    els.participantName.addEventListener("change", () => handleParticipantName().catch(handleFirebaseError));
    els.participantName.addEventListener("blur", () => handleParticipantName().catch(handleFirebaseError));
    els.bolaoForm.addEventListener("submit", savePredictions);
    els.adminOpen.addEventListener("click", () => els.adminDialog.showModal());
    els.adminUnlock.addEventListener("click", unlockAdmin);
    els.recalculateRanking.addEventListener("click", () => recalculateRanking().catch(handleFirebaseError));
    els.btnSyncApi?.addEventListener("click", syncOfficialResults);
}

async function authenticateGroup() {
    const name = els.groupName.value.trim();
    const password = els.groupPassword.value.trim();

    if (!name || !password || !state.db) {
        setConnection("Preencha nome e senha do grupo");
        return;
    }

    setConnection("Autenticando...");
    const newGroupId = normalizeId(name);
    const groupRef = doc(collection(state.db, "grupos"), newGroupId);

    try {
        const docSnap = await getDoc(groupRef);

        if (docSnap.exists()) {
            // Grupo existe, checa a senha
            if (docSnap.data().senha !== password) {
                setConnection("❌ Senha incorreta");
                state.isGroupAuthenticated = false;
                els.participantName.disabled = true;
                
                // Limpa ouvintes se errar a senha tentando trocar de grupo
                if (state.unsubscribeRanking) state.unsubscribeRanking();
                if (state.unsubscribeParticipants) state.unsubscribeParticipants();
                if (state.unsubscribeAllPredictions) state.unsubscribeAllPredictions();
                return;
            }
            
        } else {
            // Grupo não existe, cria com a senha
            await setDoc(groupRef, {
                nome: name,
                senha: password,
                criadoEm: serverTimestamp()
            });
        }

        // Se chegou aqui, senha está correta ou grupo foi criado
        state.isGroupAuthenticated = true;
        els.participantName.disabled = false; // Libera digitação do nome
        setActiveGroup(name);
        setConnection("✅ Grupo acessado");

        // Agora sim, escuta os dados isolados do grupo
        listenToRanking();
        listenToParticipants();
        listenToAllPredictions();

        if (els.participantName.value.trim()) {
            await handleParticipantName();
        }

    } catch (error) {
        handleFirebaseError(error);
    }
}

function setActiveGroup(rawName) {
    state.groupName = rawName || DEFAULT_GROUP_NAME;
    state.groupId = normalizeId(state.groupName);

    if (els.groupName) els.groupName.value = state.groupName;
    if (els.activeGroupName) els.activeGroupName.textContent = state.groupName;

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('grupo') !== state.groupId) {
        urlParams.set('grupo', state.groupId);
        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
    }
}
function activateTab(tab) {
    document.querySelectorAll(".tab-button").forEach((button) => {
        button.classList.toggle("active", button.dataset.tab === tab);
    });

    document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === tab);
    });
}

function renderGames() {
    let currentDay = "";
    const fragment = document.createDocumentFragment();

    matches.forEach((match, index) => {
        const dayLabel = formatDateLabel(match.utcDate);

        if (dayLabel !== currentDay) {
            currentDay = dayLabel;
            const divider = document.createElement("div");
            divider.className = "date-divider";
            divider.textContent = dayLabel;
            fragment.appendChild(divider);
        }

        // ➕ NOVO: Busca se já existe resultado oficial para pintar o card de palpites
        const oficialResult = state.results ? state.results.get(Number(match.id)) : null;
        const cardClass = oficialResult ? "game-card oficial-verificado" : "game-card";
        const cardStyle = oficialResult ? "border: 1px solid #28a745; background-color: #f4fbf6;" : "";

        const card = document.createElement("article");
        card.className = cardClass;
        if (cardStyle) card.setAttribute("style", cardStyle);
        card.style.animationDelay = `${Math.min(index * 24, 420)}ms`;
        const kickoffPassed = new Date(match.utcDate).getTime() <= Date.now();

    const locked =
        match.status === "FINISHED" ||
        oficialResult ||
        kickoffPassed;
        card.innerHTML = `
            <div class="match-meta">
                <span class="match-time">${formatTime(match.utcDate)}</span>
                ${oficialResult ? `<span class="status-badge finished" style="background-color: #28a745;">✓ OFICIAL</span>` : statusBadge(match.status)}
            </div>
            <div class="team home">
                ${flagMarkup(match.homeTeam)}
                <span class="team-name">${escapeHtml(match.homeTeam)}</span>
            </div>
            <div class="score-input">
            <input type="number" min="0" inputmode="numeric"
                id="home-${match.id}"
                value="${oficialResult ? oficialResult.homeGoals : ""}"
                ${locked ? "disabled" : ""}>
                <span>X</span>
            <input type="number" min="0" inputmode="numeric"
                id="away-${match.id}"
                value="${oficialResult ? oficialResult.awayGoals : ""}"
                ${locked ? "disabled" : ""}>
            </div>
            <div class="team away">
                <span class="team-name">${escapeHtml(match.awayTeam)}</span>
                ${flagMarkup(match.awayTeam)}
            </div>
            ${oficialResult ? `<div style="text-align: center; grid-column: span 5; font-size: 0.8rem; color: #28a745; font-weight: bold; margin-top: 4px;">Placar Oficial Confirmado no Banco</div>` : ""}
        `;
        fragment.appendChild(card);
    });

    els.gamesContainer.replaceChildren(fragment);
}
async function handleParticipantName() {
    const name = els.participantName.value.trim();
    if (!name || !state.db) return;

    state.participantName = name;
    // Cria um ID único por grupo para evitar que o "João" do grupo A se misture com o do grupo B
    state.participantId = `${state.groupId}_${normalizeId(name)}`;

    await setDoc(doc(collection(state.db, "participantes"), state.participantId), {
        nome: name,
        groupId: state.groupId, // Gravando a qual grupo ele pertence
        criadoEm: serverTimestamp()
    }, { merge: true });

    listenToCurrentPredictions();
    setConnection("Participante ativo");
}

function listenToCurrentPredictions() {
    if (!state.db || !state.participantId) return;

    if (state.unsubscribePredictions) {
        state.unsubscribePredictions();
    }

    const predictionsQuery = query(
        collection(state.db, "palpites"),
        where("participanteId", "==", state.participantId)
    );

    state.unsubscribePredictions = onSnapshot(
        predictionsQuery,
        (snapshot) => {
            const predictions = snapshot.docs.map((item) => item.data());
            fillPredictions(predictions);
            updateSavedPreview(predictions);
        },
        handleFirebaseError
    );
}

function listenToRanking() {
    if (!state.db) return;
    if (state.unsubscribeRanking) state.unsubscribeRanking(); // Limpa escuta anterior

    const q = query(collection(state.db, "ranking"), where("groupId", "==", state.groupId));
    state.unsubscribeRanking = onSnapshot(q, (snapshot) => {
        const ranking = snapshot.docs
            .map((item) => item.data())
            .sort((a, b) => b.pontos - a.pontos || b.exatos - a.exatos || a.nome.localeCompare(b.nome));

        renderRanking(ranking);
    }, handleFirebaseError);
}

function listenToParticipants() {
    if (!state.db) return;
    if (state.unsubscribeParticipants) state.unsubscribeParticipants(); // Limpa escuta anterior

    const q = query(collection(state.db, "participantes"), where("groupId", "==", state.groupId));
    state.unsubscribeParticipants = onSnapshot(q, (snapshot) => {
        state.participants = snapshot.docs
            .map((item) => ({ id: item.id, ...item.data() }))
            .sort((a, b) => String(a.nome).localeCompare(String(b.nome)));
        els.totalParticipants.textContent = String(snapshot.size);
        renderResultsBoard();
    }, handleFirebaseError);
}

function listenToAllPredictions() {
    if (!state.db) return;
    if (state.unsubscribeAllPredictions) state.unsubscribeAllPredictions(); // Limpa escuta anterior

    const q = query(collection(state.db, "palpites"), where("groupId", "==", state.groupId));
    state.unsubscribeAllPredictions = onSnapshot(q, (snapshot) => {
        state.predictions = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        els.resultsCount.textContent = `${state.predictions.length} ${state.predictions.length === 1 ? "palpite" : "palpites"}`;
        renderResultsBoard();
    }, handleFirebaseError);
}

function listenToResults() {
    if (!state.db) return;

    state.unsubscribeResults = onSnapshot(
        collection(state.db, "resultados"),
        async (snapshot) => {
            // Normaliza todos os valores para Number para eliminar inconsistências de tipo no Firestore
            const previousSize = state.results.size;

            state.results = new Map(snapshot.docs.map((item) => {
                const data      = item.data();
                const idNumerico = Number(data.matchId) || Number(item.id);
                return [
                    idNumerico,
                    {
                        ...data,
                        matchId:   idNumerico,
                        homeGoals: Number(data.homeGoals),
                        awayGoals: Number(data.awayGoals)
                    }
                ];
            }));

            // Atualiza contadores e UI
            els.totalResults.textContent = String(snapshot.size);
            fillAdminResults();
            renderResultsBoard();
            renderGames(); // repinta os cards de palpite com badge ✓ OFICIAL

            // Recalcula ranking automaticamente quando chegam resultados novos
            const hasNewResults = snapshot.size > previousSize ||
                snapshot.docChanges().some(change => change.type === "modified");

            if (hasNewResults && state.isGroupAuthenticated) {
                try {
                    await recalculateRanking();
                } catch (err) {
                    console.warn("[autoRanking]", err);
                }
            }
        },
        handleFirebaseError
    );
}
async function savePredictions(event) {
    event.preventDefault();
    const submitButton = els.bolaoForm.querySelector("button[type='submit']");

    if (!state.db) {
        showPreviewMessage("Configure o Firebase no topo do app.js antes de salvar.");
        return;
    }

    if (!els.participantName.value.trim()) {
        els.participantName.focus();
        showPreviewMessage("Digite o nome do participante para salvar os palpites.");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Salvando...";

    try {
        await handleParticipantName();

        const predictions = collectPredictions();

        if (!predictions.length) {
            showPreviewMessage("Preencha pelo menos um placar antes de salvar.");
            setConnection("Nada para salvar");
            return;
        }

        const batch = writeBatch(state.db);

        predictions.forEach((prediction) => {
            const predictionRef = doc(collection(state.db, "palpites"), `${state.participantId}_${prediction.matchId}`);
            batch.set(predictionRef, {
                ...prediction,
                participanteId: state.participantId,
                groupId: state.groupId, // Chave do grupo adicionada
                savedAt: serverTimestamp()
            }, { merge: true });
        });

        await batch.commit();
        updateSavedPreview(predictions);
        setConnection("Palpites salvos");
    } catch (error) {
        handleFirebaseError(error);
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = `<span aria-hidden="true">↗</span> Salvar palpites`;
    }
}

function collectPredictions() {
function collectPredictions() {
    return matches
        .filter((match) => {
            const kickoffPassed =
                new Date(match.utcDate).getTime() <= Date.now();

            return !kickoffPassed &&
                   match.status !== "FINISHED";
        })
        .map((match) => ({
            matchId: match.id,
            homeTeam: match.homeTeam,
            awayTeam: match.awayTeam,
            homeGoals: toScore(document.getElementById(`home-${match.id}`).value),
            awayGoals: toScore(document.getElementById(`away-${match.id}`).value)
        }))
        .filter((prediction) => prediction.homeGoals !== null && prediction.awayGoals !== null);
}

function fillPredictions(predictions) {
    predictions.forEach((prediction) => {
        const home = document.getElementById(`home-${prediction.matchId}`);
        const away = document.getElementById(`away-${prediction.matchId}`);

        if (home) home.value = prediction.homeGoals;
        if (away) away.value = prediction.awayGoals;
    });
}

function updateSavedPreview(predictions) {
    if (!predictions.length) {
        showPreviewMessage("Nenhum palpite salvo para este participante.");
        return;
    }

    els.savedPredictions.textContent = JSON.stringify(
        predictions.map(({ matchId, homeTeam, awayTeam, homeGoals, awayGoals }) => ({
            matchId,
            homeTeam,
            awayTeam,
            homeGoals,
            awayGoals
        })),
        null,
        2
    );
}

function showPreviewMessage(message) {
    els.savedPredictions.textContent = message;
}
function renderAdminResults() {
    // Altera o filtro para exibir todos os jogos no painel administrativo
    const finishedMatches = matches;
    const fragment = document.createDocumentFragment();

    finishedMatches.forEach((match) => {
        const row = document.createElement("div");
        row.className = "admin-result-row";
        
        // CORREÇÃO CRÍTICA: Garante que os atributos 'id' estejam explicitamente injetados nos inputs
        row.innerHTML = `
            <div style="flex: 1; margin-bottom: 0.5rem;">
                <strong>${flagInlineMarkup(match.homeTeam)} ${escapeHtml(match.homeTeam)} x ${escapeHtml(match.awayTeam)} ${flagInlineMarkup(match.awayTeam)}</strong>
                <br><small style="color: var(--text-muted, #777);">${formatDateLabel(match.utcDate)} • ${formatTime(match.utcDate)} ${statusBadge(match.status)}</small>
            </div>
            <div style="display: flex; gap: 0.5rem; align-items: center; justify-content: flex-end;">
                <input type="number" min="0" inputmode="numeric" id="result-home-${match.id}" style="width: 55px; text-align: center; padding: 4px;" aria-label="Gols reais de ${escapeHtml(match.homeTeam)}">
                <span>x</span>
                <input type="number" min="0" inputmode="numeric" id="result-away-${match.id}" style="width: 55px; text-align: center; padding: 4px;" aria-label="Gols reais de ${escapeHtml(match.awayTeam)}">
                <button type="button" class="save-button compact btn-save-manual" data-matchid="${match.id}" style="padding: 0.35rem 0.6rem; margin: 0 0 0 0.5rem; background-color: #007bff; cursor: pointer; border-radius: 4px; border: none; color: white;">💾</button>
            </div>
        `;

        // Atribui o clique chamando a função de gravação
        const saveBtn = row.querySelector(".btn-save-manual");
        saveBtn.addEventListener("click", () => saveResult(match));

        fragment.appendChild(row);
    });

    els.adminResults.replaceChildren(fragment);
}

async function saveResult(match) {
    if (!state.db) {
        alert("Erro: Banco de dados não conectado.");
        return;
    }

    // Captura os elementos pelos IDs garantidos na renderização acima
    const homeInputEl = document.getElementById(`result-home-${match.id}`);
    const awayInputEl = document.getElementById(`result-away-${match.id}`);

    if (!homeInputEl || !awayInputEl) {
        alert("Erro técnico: Inputs não encontrados na árvore da página.");
        return;
    }

    const homeGoals = toScore(homeInputEl.value);
    const awayGoals = toScore(awayInputEl.value);

    // Validação: Impede o envio caso algum campo esteja vazio
    if (homeGoals === null || awayGoals === null) {
        alert(`Aviso: Digite os gols de ambos os times para salvar o jogo ${match.homeTeam} x ${match.awayTeam}`);
        return;
    }

    try {
        setConnection("Gravando resultado oficial...");

        // Grava na coleção unificada com tipos normalizados (Number, nunca String)
        await setDoc(doc(collection(state.db, "resultados"), String(Number(match.id))), {
            matchId:      Number(match.id),
            homeGoals:    Number(homeGoals),
            awayGoals:    Number(awayGoals),
            fonte:        "admin-manual",
            registradoEm: serverTimestamp()
        }, { merge: true });

        // Recálculo do ranking é disparado automaticamente pelo onSnapshot de listenToResults,
        // mas também chamamos aqui para garantir feedback imediato ao admin.
        await recalculateRanking();

        setConnection("✅ Resultado gravado!");

        // Atualiza o painel de sync com timestamp
        if (els.syncMessage) {
            const timeStr = new Date().toLocaleTimeString("pt-BR");
            els.syncMessage.style.color = "green";
            els.syncMessage.textContent = `✅ ${match.homeTeam} ${homeGoals}x${awayGoals} ${match.awayTeam} salvo às ${timeStr}.`;
        }
    } catch (error) {
        console.error("Erro ao salvar no Firestore:", error);
        handleFirebaseError(error);
    }
}
// ─── Integração football-data.org ────────────────────────────────────────────
// Busca resultados FINISHED da Copa 2026, normaliza e grava no Firestore.
// Chamada segura: verifica chave, trata erros de rede e evita gravações duplicadas.

async function fetchAndSyncResults({ silent = false } = {}) {
    if (state.isSyncing) return; // evita chamadas simultâneas

    const syncMessage = els.syncMessage;
    const adminButton = els.btnSyncApi;

    if (!state.db) {
        if (!silent) { syncMessage.style.color = "red"; syncMessage.textContent = "Erro: Firebase não configurado."; }
        return;
    }

    if (!PROXY_BASE_URL) {
        if (!silent) {
            syncMessage.style.color = "orange";
            syncMessage.textContent = "⚠️ Configure PROXY_BASE_URL no app.js após o deploy do Cloudflare Worker.";
        }
        return;
    }

    state.isSyncing = true;
    if (adminButton) adminButton.disabled = true;
    if (!silent) { syncMessage.style.color = "var(--text-muted,#666)"; syncMessage.textContent = "⏳ Buscando placares via proxy..."; }

    try {
        // Chamada via proxy Cloudflare Worker — sem CORS, sem API key exposta
        const res = await fetch(`${PROXY_BASE_URL}/matches/finished`, { method: "GET" });

        if (res.status === 429) {
            if (!silent) { syncMessage.style.color = "orange"; syncMessage.textContent = "⏳ Limite de chamadas atingido. Aguarde um minuto."; }
            return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status} do proxy`);

        const data = await res.json();
        const apiMatches = data.matches ?? [];

        // Monta Set dos IDs locais para cruzamento
        const localIds = new Set(matches.map(m => Number(m.id)));

        const batch      = writeBatch(state.db);
        let   countNew   = 0;
        let   countSkip  = 0;

        for (const apiMatch of apiMatches) {
            const matchId    = Number(apiMatch.id);
            if (!localIds.has(matchId)) { countSkip++; continue; }

            const homeGoals  = apiMatch.score?.fullTime?.home ?? null;
            const awayGoals  = apiMatch.score?.fullTime?.away ?? null;
            if (homeGoals === null || awayGoals === null) continue;

            // Verifica se já existe resultado idêntico no cache local
            const cached = state.results.get(matchId);
            if (cached && cached.homeGoals === homeGoals && cached.awayGoals === awayGoals) {
                countSkip++;
                continue;
            }

            batch.set(
                doc(collection(state.db, "resultados"), String(matchId)),
                {
                    matchId:       matchId,
                    homeGoals:     Number(homeGoals),
                    awayGoals:     Number(awayGoals),
                    fonte:         "football-data.org",
                    registradoEm:  serverTimestamp()
                },
                { merge: true }
            );
            countNew++;
        }

        if (countNew > 0) {
            await batch.commit();
            await recalculateRanking();
        }

        state.lastSyncAt = new Date();
        const timeStr    = state.lastSyncAt.toLocaleTimeString("pt-BR");

        if (!silent) {
            syncMessage.style.color = countNew > 0 ? "green" : "#555";
            syncMessage.textContent = countNew > 0
                ? `✅ ${countNew} resultado(s) sincronizado(s) às ${timeStr}.`
                : `✔ Nenhuma novidade às ${timeStr}. (${countSkip} verificados)`;
        }

        // Ajusta frequência do polling conforme há jogos ao vivo
        schedulePoll();

    } catch (err) {
        console.error("[sync]", err);
        if (!silent) { syncMessage.style.color = "red"; syncMessage.textContent = `❌ Falha: ${err.message}`; }
    } finally {
        state.isSyncing   = false;
        if (adminButton) adminButton.disabled = false;
    }
}

// Alias para o botão do painel admin (chama versão não-silenciosa)
async function syncOfficialResults() {
    await fetchAndSyncResults({ silent: false });
}

// ─── Polling automático ───────────────────────────────────────────────────────
// Decide o intervalo com base em se há jogos ao vivo agora.

function hasLiveMatches() {
    const now = Date.now();
    return matches.some(m => {
        if (m.status === "FINISHED") return false;
        const kickoff = new Date(m.utcDate).getTime();
        // Considera "ao vivo" de 5min antes do kickoff até 2h depois
        return now >= kickoff - 5 * 60_000 && now <= kickoff + 120 * 60_000;
    });
}

function schedulePoll() {
    if (!PROXY_BASE_URL) {
        if (els.autoSyncBadge) {
            els.autoSyncBadge.textContent = "Auto-sync desativado — configure PROXY_BASE_URL no app.js.";
            els.autoSyncBadge.style.color = "#c0392b";
        }
        return;
    }

    clearInterval(state.pollTimer);
    const live     = hasLiveMatches();
    const interval = live ? POLL_INTERVAL_LIVE : POLL_INTERVAL_IDLE;
    state.pollTimer = setInterval(() => fetchAndSyncResults({ silent: true }), interval);

    if (els.autoSyncBadge) {
        const mins = Math.round(interval / 60_000);
        const icon = live ? "🟢" : "🕐";
        els.autoSyncBadge.style.color = live ? "#1a7a1a" : "#555";
        els.autoSyncBadge.textContent  =
            `${icon} Auto-sync ativo — verifica a cada ${mins}min ${live ? "(jogo ao vivo!)" : ""}`;
    }
}

// Inicia polling logo após a inicialização do Firebase
function startAutoSync() {
    if (!PROXY_BASE_URL) return;
    fetchAndSyncResults({ silent: true }); // primeira chamada imediata
    schedulePoll();
}

async function recalculateRanking() {
    if (!state.db || !state.groupId) return;

    try {
        const participantsQuery = query(
            collection(state.db, "participantes"),
            where("groupId", "==", state.groupId)
        );

        const predictionsQuery = query(
            collection(state.db, "palpites"),
            where("groupId", "==", state.groupId)
        );

        const [participantsSnapshot, predictionsSnapshot, resultsSnapshot] =
            await Promise.all([
                getDocs(participantsQuery),
                getDocs(predictionsQuery),
                getDocs(collection(state.db, "resultados"))
            ]);

        const participants = participantsSnapshot.docs.map(docSnap => ({
            id: docSnap.id,
            ...docSnap.data()
        }));

        const predictions = predictionsSnapshot.docs.map(docSnap => ({
            ...docSnap.data(),
            matchId: Number(docSnap.data().matchId),
            homeGoals: Number(docSnap.data().homeGoals),
            awayGoals: Number(docSnap.data().awayGoals)
        }));

        const results = new Map(
            resultsSnapshot.docs.map(docSnap => {
                const data = docSnap.data();

                return [
                    Number(data.matchId),
                    {
                        ...data,
                        matchId: Number(data.matchId),
                        homeGoals: Number(data.homeGoals),
                        awayGoals: Number(data.awayGoals)
                    }
                ];
            })
        );

        console.log("Grupo:", state.groupId);
        console.log("Participantes:", participants.length);
        console.log("Palpites:", predictions.length);
        console.log("Resultados:", results.size);

        const batch = writeBatch(state.db);

        for (const participant of participants) {
            const participantPredictions = predictions.filter(
                prediction => prediction.participanteId === participant.id
            );

            const score = scoreParticipant(
                participantPredictions,
                results
            );

            console.log(
                participant.nome,
                participant.id,
                "Palpites:",
                participantPredictions.length,
                "Score:",
                score
            );

            batch.set(
                doc(state.db, "ranking", participant.id),
                {
                    participanteId: participant.id,
                    nome: participant.nome,
                    groupId: state.groupId,
                    pontos: Number(score.pontos) || 0,
                    exatos: Number(score.exatos) || 0,
                    vencedores: Number(score.vencedores) || 0,
                    atualizadoEm: serverTimestamp()
                },
                { merge: true }
            );
        }

        await batch.commit();

        console.log("Ranking recalculado com sucesso");
        setConnection("Ranking recalculado");
    } catch (error) {
        console.error("Erro ao recalcular ranking:", error);
        handleFirebaseError(error);
    }
}
function scoreParticipant(predictions, results) {
    return predictions.reduce((total, prediction) => {
        const result = results.get(Number(prediction.matchId));

        console.log("PALPITE:", prediction);
        console.log("RESULTADO:", result);

        if (!result) {
            console.log("Resultado não encontrado");
            return total;
        }

        if (
            prediction.homeGoals === result.homeGoals &&
            prediction.awayGoals === result.awayGoals
        ) {
            console.log("PLACAR EXATO");
            total.pontos += 3;
            total.exatos += 1;
            return total;
        }

        console.log(
            "OUTCOMES:",
            outcome(prediction.homeGoals, prediction.awayGoals),
            outcome(result.homeGoals, result.awayGoals)
        );

        if (
            outcome(prediction.homeGoals, prediction.awayGoals) ===
            outcome(result.homeGoals, result.awayGoals)
        ) {
            console.log("ACERTOU VENCEDOR");
            total.pontos += 1;
            total.vencedores += 1;
        }

        return total;
    }, {
        pontos: 0,
        exatos: 0,
        vencedores: 0
    });
}

function renderRanking(ranking) {
    if (!ranking.length) {
        els.rankingBody.innerHTML = `<tr><td colspan="5" class="empty-state">Aguardando resultados.</td></tr>`;
        return;
    }

    els.rankingBody.innerHTML = ranking.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(item.nome)}</td>
            <td>${item.pontos}</td>
            <td>${item.exatos}</td>
            <td>${item.vencedores}</td>
        </tr>
    `).join("");
}
function renderResultsBoard() {
    if (!els.resultsBoard) return;

    const participants = state.participants;

    // Se houver palpites mas nenhum participante carregou, aguarda a sincronização do Firestore
    if (!participants.length && !state.predictions.length) {
        els.resultsBoard.innerHTML = `<div class="empty-results">Nenhum participante ou palpite salvo ainda.</div>`;
        return;
    }

    const participantMap = new Map(participants.map((participant) => [String(participant.id), participant]));
    const predictionsByMatch = groupPredictionsByMatch(state.predictions);

    els.resultsBoard.innerHTML = matches.map((match) => {
        const matchIdNumerico = Number(match.id);
        
        // CORREÇÃO DE TIPAGEM: Força a busca como Number estrito
        const result = state.results.get(matchIdNumerico);
        const predictionsForMatch = predictionsByMatch.get(matchIdNumerico) || new Map();
        
        const status = result ? "✓ Resultado oficial" : statusLabel(match.status);
        const rows = buildPredictionRows(participants, participantMap, predictionsForMatch, result);

        // Define estilos dinâmicos de confirmação visual para o administrador e participantes
        const cardStyle = result ? "border: 2px solid #28a745; background-color: rgba(40, 167, 69, 0.05);" : "";
        const headerStyle = result ? "color: #28a745; font-weight: bold;" : "";

        return `
            <article class="result-card" style="${cardStyle}">
                <header class="result-card-header">
                    <div class="result-teams">
                        ${flagInlineMarkup(match.homeTeam)}
                        <strong>${escapeHtml(match.homeTeam)}</strong>
                        <span>x</span>
                        <strong>${escapeHtml(match.awayTeam)}</strong>
                        ${flagInlineMarkup(match.awayTeam)}
                    </div>
                    <div class="result-score ${result ? "has-result" : ""}" style="${headerStyle}">
                        ${result ? `${result.homeGoals} - ${result.awayGoals}` : "Aguardando"}
                    </div>
                    <span class="result-status" style="${result ? "background-color: #28a745; color: white; padding: 2px 6px; border-radius: 4px;" : ""}">${status}</span>
                </header>

                <div class="result-meta">
                    <span>${formatDateLabel(match.utcDate)}</span>
                    <span>${formatTime(match.utcDate)}</span>
                </div>

                <div class="prediction-list">
                    ${rows}
                </div>
            </article>
        `;
    }).join("");
}

function groupPredictionsByMatch(predictions) {
    return predictions.reduce((grouped, prediction) => {
        // CORREÇÃO: Força o ID do jogo a ser interpretado sempre como Number para bater com as chaves do mapa
        const matchId = Number(prediction.matchId);
        const participantId = String(prediction.participanteId);

        if (!grouped.has(matchId)) {
            grouped.set(matchId, new Map());
        }

        grouped.get(matchId).set(participantId, prediction);
        return grouped;
    }, new Map());
}

function buildPredictionRows(participants, participantMap, predictionsForMatch, result) {
    const participantIds = new Set([
        ...participants.map((participant) => participant.id),
        ...predictionsForMatch.keys()
    ]);

    if (!participantIds.size) {
        return `<div class="prediction-row empty-row">Nenhum palpite para este jogo.</div>`;
    }

    return [...participantIds]
        .map((participantId) => {
            const participant = participantMap.get(participantId);
            const prediction = predictionsForMatch.get(participantId);
            const name = participant?.nome || prediction?.nome || participantId.split('_').pop();
            const score = prediction ? `${prediction.homeGoals} - ${prediction.awayGoals}` : "--";
            const points = prediction && result ? scorePrediction(prediction, result) : null;

            return `
                <div class="prediction-row">
                    <span class="prediction-name">${escapeHtml(name)}</span>
                    <span class="prediction-detail">
                        <span class="prediction-score">${score}</span>
                        ${points === null ? "" : `<span class="prediction-points points-${points}">${points} pts</span>`}
                    </span>
                </div>
            `;
        })
        .join("");
}

function scorePrediction(prediction, result) {
    if (prediction.homeGoals === result.homeGoals && prediction.awayGoals === result.awayGoals) {
        return 3;
    }

    if (outcome(prediction.homeGoals, prediction.awayGoals) === outcome(result.homeGoals, result.awayGoals)) {
        return 1;
    }

    return 0;
}

function statusLabel(status) {
    const labels = {
        FINISHED: "Encerrado",
        IN_PLAY: "Ao vivo",
        TIMED: "Aguardando"
    };

    return labels[status] || status;
}

function unlockAdmin() {
    if (els.adminPassword.value !== ADMIN_PASSWORD) {
        els.adminMessage.textContent = "Senha incorreta.";
        return;
    }

    els.adminLogin.hidden = true;
    els.adminPanel.hidden = false;
    els.adminMessage.textContent = "";
}

function fillAdminResults() {
    state.results.forEach((result, matchId) => {
        const home = document.getElementById(`result-home-${matchId}`);
        const away = document.getElementById(`result-away-${matchId}`);

        // Só preenche o input automaticamente se o administrador NÃO estiver com o campo focado (activeElement)
        if (home && document.activeElement !== home) home.value = result.homeGoals;
        if (away && document.activeElement !== away) away.value = result.awayGoals;
    });
}

function flagMarkup(teamName) {
    const code = flagCodes[teamName];

    if (!code) {
        return `<span class="flag flag-fallback" aria-hidden="true">?</span>`;
    }

    return `
        <img
            class="flag"
            src="https://flagcdn.com/w80/${code}.png"
            srcset="https://flagcdn.com/w160/${code}.png 2x"
            width="40"
            height="30"
            alt="Bandeira de ${escapeHtml(teamName)}"
            loading="lazy"
        >
    `;
}

function flagInlineMarkup(teamName) {
    const code = flagCodes[teamName];

    if (!code) {
        return `<span class="flag-inline" aria-hidden="true">?</span>`;
    }

    return `<img class="flag-inline" src="https://flagcdn.com/w40/${code}.png" width="24" height="18" alt="Bandeira de ${escapeHtml(teamName)}" loading="lazy">`;
}

function statusBadge(status) {
    const statusMap = {
        FINISHED: ["finished", "ENCERRADO"],
        IN_PLAY: ["live", "AO VIVO"],
        TIMED: ["waiting", "AGUARDANDO"]
    };
    const [className, label] = statusMap[status] || ["waiting", status];

    return `<span class="status-badge ${className}">${label}</span>`;
}

function formatDateLabel(utcDate) {
    const formatted = new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        timeZone: "America/Sao_Paulo"
    }).format(new Date(utcDate));

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatTime(utcDate) {
    return new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Sao_Paulo"
    }).format(new Date(utcDate));
}

function normalizeId(value) {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 80);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function toScore(value) {
    if (value === "") return null;
    const number = Number(value);
    return Number.isFinite(number) && number >= 0 ? number : null;
}

function outcome(homeGoals, awayGoals) {
    return Math.sign(homeGoals - awayGoals);
}

function isFirebaseConfigured(config) {
    return Boolean(config.apiKey && config.projectId && !Object.values(config).some((value) => value === "..."));
}

function setConnection(text) {
    els.connectionStatus.textContent = text;
}

function hideLoading() {
    els.loadingOverlay.classList.add("hidden");
}

function handleFirebaseError(error) {
    console.error(error);

    const message = friendlyFirebaseMessage(error);
    setConnection("Erro no Firestore");
    showPreviewMessage(message);
}

function friendlyFirebaseMessage(error) {
    const code = error?.code || "";

    if (code.includes("permission-denied")) {
        return "O Firestore recusou a gravação. Publique as regras de desenvolvimento no Firebase Console e tente novamente.";
    }

    if (code.includes("unavailable") || code.includes("deadline-exceeded")) {
        return "Não foi possível conectar ao Firestore agora. Verifique a conexão e tente novamente.";
    }

    if (code.includes("failed-precondition")) {
        return "O Firestore pediu uma configuração adicional. Confira o console do navegador para ver o detalhe.";
    }

    return `Não foi possível salvar no Firestore. Detalhe: ${error?.message || "erro desconhecido"}`;
}
