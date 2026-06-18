
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

const matches = [
  { "id": 537397, "utcDate": "2026-06-17T01:00:00Z", "status": "FINISHED", "homeTeam": "Argentina", "awayTeam": "Algeria" },
  { "id": 537398, "utcDate": "2026-06-17T04:00:00Z", "status": "FINISHED", "homeTeam": "Austria", "awayTeam": "Jordan" },
  { "id": 537403, "utcDate": "2026-06-17T17:00:00Z", "status": "FINISHED", "homeTeam": "Portugal", "awayTeam": "Congo DR" },
  { "id": 537409, "utcDate": "2026-06-17T20:00:00Z", "status": "FINISHED", "homeTeam": "England", "awayTeam": "Croatia" },
  { "id": 537410, "utcDate": "2026-06-17T23:00:00Z", "status": "FINISHED", "homeTeam": "Ghana", "awayTeam": "Panama" },
  { "id": 537404, "utcDate": "2026-06-18T02:00:00Z", "status": "FINISHED", "homeTeam": "Uzbekistan", "awayTeam": "Colombia" },
  { "id": 537329, "utcDate": "2026-06-18T16:00:00Z", "status": "TIMED", "homeTeam": "Czechia", "awayTeam": "South Africa" },
  { "id": 537335, "utcDate": "2026-06-18T19:00:00Z", "status": "TIMED", "homeTeam": "Switzerland", "awayTeam": "Bosnia-Herzegovina" },
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
    results: new Map()
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
    btnSyncApi: document.getElementById("btnSyncApi"),
    syncMessage: document.getElementById("syncMessage")
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

        const card = document.createElement("article");
        card.className = "game-card";
        card.style.animationDelay = `${Math.min(index * 24, 420)}ms`;
        card.innerHTML = `
            <div class="match-meta">
                <span class="match-time">${formatTime(match.utcDate)}</span>
                ${statusBadge(match.status)}
            </div>
            <div class="team home">
                ${flagMarkup(match.homeTeam)}
                <span class="team-name">${escapeHtml(match.homeTeam)}</span>
            </div>
            <div class="score-input" aria-label="Palpite ${escapeHtml(match.homeTeam)} contra ${escapeHtml(match.awayTeam)}">
                <input type="number" min="0" inputmode="numeric" id="home-${match.id}" aria-label="Gols de ${escapeHtml(match.homeTeam)}" ${match.status === "FINISHED" ? "disabled" : ""}>
                <span>X</span>
                <input type="number" min="0" inputmode="numeric" id="away-${match.id}" aria-label="Gols de ${escapeHtml(match.awayTeam)}" ${match.status === "FINISHED" ? "disabled" : ""}>
            </div>
            <div class="team away">
                <span class="team-name">${escapeHtml(match.awayTeam)}</span>
                ${flagMarkup(match.awayTeam)}
            </div>
        `;
        fragment.appendChild(card);
    });

    els.gamesContainer.replaceChildren(fragment);
}

function renderAdminResults() {
    const finishedMatches = matches.filter((match) => match.status === "FINISHED");
    const fragment = document.createDocumentFragment();

    finishedMatches.forEach((match) => {
        const row = document.createElement("div");
        row.className = "admin-result-row";
        row.innerHTML = `
            <div>
                <strong>${flagInlineMarkup(match.homeTeam)} ${escapeHtml(match.homeTeam)} x ${escapeHtml(match.awayTeam)} ${flagInlineMarkup(match.awayTeam)}</strong>
                <span>${formatDateLabel(match.utcDate)} • ${formatTime(match.utcDate)}</span>
            </div>
            <input type="number" min="0" inputmode="numeric" id="result-home-${match.id}" aria-label="Gols reais de ${escapeHtml(match.homeTeam)}">
            <input type="number" min="0" inputmode="numeric" id="result-away-${match.id}" aria-label="Gols reais de ${escapeHtml(match.awayTeam)}">
        `;

        const homeInput = row.querySelector(`#result-home-${match.id}`);
        const awayInput = row.querySelector(`#result-away-${match.id}`);

        [homeInput, awayInput].forEach((input) => {
            input.addEventListener("change", () => saveResult(match));
        });

        fragment.appendChild(row);
    });

    els.adminResults.replaceChildren(fragment);
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
        (snapshot) => {
            state.results = new Map(snapshot.docs.map((item) => [Number(item.data().matchId), item.data()]));
            els.totalResults.textContent = String(snapshot.size);
            fillAdminResults();
            renderResultsBoard();
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
    return matches
        .filter((match) => match.status !== "FINISHED")
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

async function saveResult(match) {
    if (!state.db) return;

    const homeGoals = toScore(document.getElementById(`result-home-${match.id}`).value);
    const awayGoals = toScore(document.getElementById(`result-away-${match.id}`).value);

    if (homeGoals === null || awayGoals === null) return;

    try {
        await setDoc(doc(collection(state.db, "resultados"), String(match.id)), {
            matchId: match.id,
            homeGoals,
            awayGoals,
            registradoEm: serverTimestamp()
        }, { merge: true });

        await recalculateRanking();
    } catch (error) {
        handleFirebaseError(error);
    }
}

// 1. Lembre-se de mapear o novo elemento de mensagem no objeto 'els' no topo do seu app.js:
// els.syncMessage = document.getElementById("syncMessage");
// els.btnSyncApi = document.getElementById("btnSyncApi");
async function syncOfficialResults() {
    const adminButton = els.btnSyncApi;
    const syncMessage = els.syncMessage;

    if (!state.db) {
        syncMessage.style.color = "red";
        syncMessage.textContent = "Erro: Firebase não configurado.";
        return;
    }

    adminButton.disabled = true;
    syncMessage.style.color = "var(--text-muted, #666)";
    syncMessage.textContent = "⏳ n8n filtrando placares oficiais...";

    // Substitua pela URL de produção ou teste do seu n8n
    const N8N_WEBHOOK_URL = "https://seu-n8n.com"; 
    
    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error(`Status ${response.status}`);

        const data = await response.json();
        
        // Validação: Garante que o objeto de resposta possui o array 'matches'
        if (!data || !Array.isArray(data.matches)) {
            throw new Error("O n8n não retornou a propriedade 'matches' como uma lista.");
        }

        const batch = writeBatch(state.db);
        let countUpdates = 0;
        const localMatchIds = new Set(matches.map(m => Number(m.id)));

        // Varre a lista limpa enviada pelo n8n
        data.matches.forEach((apiMatch) => {
            if (!apiMatch || apiMatch.id === undefined) return;

            const matchId = Number(apiMatch.id);

            // Cruzamento de dados: Só atualiza se o jogo existir no array local do seu Bolão
            if (localMatchIds.has(matchId)) {
                const resultRef = doc(collection(state.db, "resultados"), String(matchId));
                
                // Grava os gols convertendo para número para evitar problemas de string
                batch.set(resultRef, {
                    matchId: matchId,
                    homeGoals: Number(apiMatch.homeGoals),
                    awayGoals: Number(apiMatch.awayGoals),
                    registradoEm: serverTimestamp()
                }, { merge: true });

                countUpdates++;
            }
        });

        if (countUpdates > 0) {
            await batch.commit();
            await recalculateRanking(); 
            syncMessage.style.color = "green";
            syncMessage.textContent = `✅ Sucesso! O n8n processou e ${countUpdates} jogos foram sincronizados!`;
        } else {
            syncMessage.style.color = "orange";
            syncMessage.textContent = "🎉 O n8n checou, mas nenhum ID de jogo bateu com os seus dados locais.";
        }

    } catch (error) {
        console.error(error);
        syncMessage.style.color = "red";
        syncMessage.textContent = `❌ Falha na automação: ${error.message}`;
    } finally {
        adminButton.disabled = false;
    }
}



async function recalculateRanking() {
    if (!state.db) return;

    const [participantsSnapshot, predictionsSnapshot, resultsSnapshot] = await Promise.all([
        getDocs(collection(state.db, "participantes")),
        getDocs(collection(state.db, "palpites")),
        getDocs(collection(state.db, "resultados"))
    ]);

    const participants = participantsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    const predictions = predictionsSnapshot.docs.map((item) => item.data());
    const results = new Map(resultsSnapshot.docs.map((item) => [Number(item.data().matchId), item.data()]));
    const batch = writeBatch(state.db);

    participants.forEach((participant) => {
        const score = scoreParticipant(
            predictions.filter((prediction) => prediction.participanteId === participant.id),
            results
        );

        batch.set(doc(collection(state.db, "ranking"), participant.id), {
            participanteId: participant.id,
            nome: participant.nome,
            groupId: participant.groupId || state.groupId, // Chave do grupo adicionada
            pontos: score.pontos,
            exatos: score.exatos,
            vencedores: score.vencedores,
            atualizadoEm: serverTimestamp()
        }, { merge: true });
    });

    await batch.commit();
    setConnection("Ranking recalculado");
}

function scoreParticipant(predictions, results) {
    return predictions.reduce((total, prediction) => {
        const result = results.get(Number(prediction.matchId));
        if (!result) return total;

        if (prediction.homeGoals === result.homeGoals && prediction.awayGoals === result.awayGoals) {
            total.pontos += 3;
            total.exatos += 1;
            return total;
        }

        if (outcome(prediction.homeGoals, prediction.awayGoals) === outcome(result.homeGoals, result.awayGoals)) {
            total.pontos += 1;
            total.vencedores += 1;
        }

        return total;
    }, { pontos: 0, exatos: 0, vencedores: 0 });
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

    if (!participants.length && !state.predictions.length) {
        els.resultsBoard.innerHTML = `<div class="empty-results">Nenhum participante ou palpite salvo ainda.</div>`;
        return;
    }

    const participantMap = new Map(participants.map((participant) => [participant.id, participant]));
    const predictionsByMatch = groupPredictionsByMatch(state.predictions);

    els.resultsBoard.innerHTML = matches.map((match) => {
        const result = state.results.get(match.id);
        const predictionsForMatch = predictionsByMatch.get(match.id) || new Map();
        const status = result ? "Resultado oficial" : statusLabel(match.status);
        const rows = buildPredictionRows(participants, participantMap, predictionsForMatch, result);

        return `
            <article class="result-card">
                <header class="result-card-header">
                    <div class="result-teams">
                        ${flagInlineMarkup(match.homeTeam)}
                        <strong>${escapeHtml(match.homeTeam)}</strong>
                        <span>x</span>
                        <strong>${escapeHtml(match.awayTeam)}</strong>
                        ${flagInlineMarkup(match.awayTeam)}
                    </div>
                    <div class="result-score ${result ? "has-result" : ""}">
                        ${result ? `${result.homeGoals} - ${result.awayGoals}` : "Aguardando"}
                    </div>
                    <span class="result-status">${status}</span>
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
        const matchId = Number(prediction.matchId);
        const participantId = prediction.participanteId;

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

        if (home) home.value = result.homeGoals;
        if (away) away.value = result.awayGoals;
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
