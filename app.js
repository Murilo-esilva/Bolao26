import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    collection,
    doc,
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

const matches = [
  {
    "id": 537397,
    "utcDate": "2026-06-17T01:00:00Z",
    "status": "FINISHED",
    "homeTeam": "Argentina",
    "awayTeam": "Algeria"
  },
  {
    "id": 537398,
    "utcDate": "2026-06-17T04:00:00Z",
    "status": "FINISHED",
    "homeTeam": "Austria",
    "awayTeam": "Jordan"
  },
  {
    "id": 537403,
    "utcDate": "2026-06-17T17:00:00Z",
    "status": "FINISHED",
    "homeTeam": "Portugal",
    "awayTeam": "Congo DR"
  },
  {
    "id": 537409,
    "utcDate": "2026-06-17T20:00:00Z",
    "status": "FINISHED",
    "homeTeam": "England",
    "awayTeam": "Croatia"
  },
  {
    "id": 537410,
    "utcDate": "2026-06-17T23:00:00Z",
    "status": "FINISHED",
    "homeTeam": "Ghana",
    "awayTeam": "Panama"
  },
  {
    "id": 537404,
    "utcDate": "2026-06-18T02:00:00Z",
    "status": "FINISHED",
    "homeTeam": "Uzbekistan",
    "awayTeam": "Colombia"
  },
  {
    "id": 537329,
    "utcDate": "2026-06-18T16:00:00Z",
    "status": "TIMED",
    "homeTeam": "Czechia",
    "awayTeam": "South Africa"
  },
  {
    "id": 537335,
    "utcDate": "2026-06-18T19:00:00Z",
    "status": "TIMED",
    "homeTeam": "Switzerland",
    "awayTeam": "Bosnia-Herzegovina"
  },
  {
    "id": 537336,
    "utcDate": "2026-06-18T22:00:00Z",
    "status": "TIMED",
    "homeTeam": "Canada",
    "awayTeam": "Qatar"
  },
  {
    "id": 537330,
    "utcDate": "2026-06-19T01:00:00Z",
    "status": "TIMED",
    "homeTeam": "Mexico",
    "awayTeam": "South Korea"
  },
  {
    "id": 537348,
    "utcDate": "2026-06-19T19:00:00Z",
    "status": "TIMED",
    "homeTeam": "United States",
    "awayTeam": "Australia"
  },
  {
    "id": 537342,
    "utcDate": "2026-06-19T22:00:00Z",
    "status": "TIMED",
    "homeTeam": "Scotland",
    "awayTeam": "Morocco"
  },
  {
    "id": 537341,
    "utcDate": "2026-06-20T00:30:00Z",
    "status": "TIMED",
    "homeTeam": "Brazil",
    "awayTeam": "Haiti"
  },
  {
    "id": 537347,
    "utcDate": "2026-06-20T03:00:00Z",
    "status": "TIMED",
    "homeTeam": "Turkey",
    "awayTeam": "Paraguay"
  },
  {
    "id": 537359,
    "utcDate": "2026-06-20T17:00:00Z",
    "status": "TIMED",
    "homeTeam": "Netherlands",
    "awayTeam": "Sweden"
  },
  {
    "id": 537353,
    "utcDate": "2026-06-20T20:00:00Z",
    "status": "TIMED",
    "homeTeam": "Germany",
    "awayTeam": "Ivory Coast"
  },
  {
    "id": 537354,
    "utcDate": "2026-06-21T00:00:00Z",
    "status": "TIMED",
    "homeTeam": "Ecuador",
    "awayTeam": "Curaçao"
  },
  {
    "id": 537360,
    "utcDate": "2026-06-21T04:00:00Z",
    "status": "TIMED",
    "homeTeam": "Tunisia",
    "awayTeam": "Japan"
  },
  {
    "id": 537371,
    "utcDate": "2026-06-21T16:00:00Z",
    "status": "TIMED",
    "homeTeam": "Spain",
    "awayTeam": "Saudi Arabia"
  },
  {
    "id": 537365,
    "utcDate": "2026-06-21T19:00:00Z",
    "status": "TIMED",
    "homeTeam": "Belgium",
    "awayTeam": "Iran"
  },
  {
    "id": 537372,
    "utcDate": "2026-06-21T22:00:00Z",
    "status": "TIMED",
    "homeTeam": "Uruguay",
    "awayTeam": "Cape Verde Islands"
  },
  {
    "id": 537366,
    "utcDate": "2026-06-22T01:00:00Z",
    "status": "TIMED",
    "homeTeam": "New Zealand",
    "awayTeam": "Egypt"
  },
  {
    "id": 537399,
    "utcDate": "2026-06-22T17:00:00Z",
    "status": "TIMED",
    "homeTeam": "Argentina",
    "awayTeam": "Austria"
  },
  {
    "id": 537393,
    "utcDate": "2026-06-22T21:00:00Z",
    "status": "TIMED",
    "homeTeam": "France",
    "awayTeam": "Iraq"
  },
  {
    "id": 537394,
    "utcDate": "2026-06-23T00:00:00Z",
    "status": "TIMED",
    "homeTeam": "Norway",
    "awayTeam": "Senegal"
  },
  {
    "id": 537400,
    "utcDate": "2026-06-23T03:00:00Z",
    "status": "TIMED",
    "homeTeam": "Jordan",
    "awayTeam": "Algeria"
  },
  {
    "id": 537405,
    "utcDate": "2026-06-23T17:00:00Z",
    "status": "TIMED",
    "homeTeam": "Portugal",
    "awayTeam": "Uzbekistan"
  },
  {
    "id": 537411,
    "utcDate": "2026-06-23T20:00:00Z",
    "status": "TIMED",
    "homeTeam": "England",
    "awayTeam": "Ghana"
  },
  {
    "id": 537412,
    "utcDate": "2026-06-23T23:00:00Z",
    "status": "TIMED",
    "homeTeam": "Panama",
    "awayTeam": "Croatia"
  },
  {
    "id": 537406,
    "utcDate": "2026-06-24T02:00:00Z",
    "status": "TIMED",
    "homeTeam": "Colombia",
    "awayTeam": "Congo DR"
  },
  {
    "id": 537337,
    "utcDate": "2026-06-24T19:00:00Z",
    "status": "TIMED",
    "homeTeam": "Switzerland",
    "awayTeam": "Canada"
  },
  {
    "id": 537338,
    "utcDate": "2026-06-24T19:00:00Z",
    "status": "TIMED",
    "homeTeam": "Bosnia-Herzegovina",
    "awayTeam": "Qatar"
  },
  {
    "id": 537343,
    "utcDate": "2026-06-24T22:00:00Z",
    "status": "TIMED",
    "homeTeam": "Scotland",
    "awayTeam": "Brazil"
  },
  {
    "id": 537344,
    "utcDate": "2026-06-24T22:00:00Z",
    "status": "TIMED",
    "homeTeam": "Morocco",
    "awayTeam": "Haiti"
  },
  {
    "id": 537331,
    "utcDate": "2026-06-25T01:00:00Z",
    "status": "TIMED",
    "homeTeam": "Czechia",
    "awayTeam": "Mexico"
  },
  {
    "id": 537332,
    "utcDate": "2026-06-25T01:00:00Z",
    "status": "TIMED",
    "homeTeam": "South Africa",
    "awayTeam": "South Korea"
  },
  {
    "id": 537355,
    "utcDate": "2026-06-25T20:00:00Z",
    "status": "TIMED",
    "homeTeam": "Ecuador",
    "awayTeam": "Germany"
  },
  {
    "id": 537356,
    "utcDate": "2026-06-25T20:00:00Z",
    "status": "TIMED",
    "homeTeam": "Curaçao",
    "awayTeam": "Ivory Coast"
  },
  {
    "id": 537361,
    "utcDate": "2026-06-25T23:00:00Z",
    "status": "TIMED",
    "homeTeam": "Tunisia",
    "awayTeam": "Netherlands"
  },
  {
    "id": 537362,
    "utcDate": "2026-06-25T23:00:00Z",
    "status": "TIMED",
    "homeTeam": "Japan",
    "awayTeam": "Sweden"
  },
  {
    "id": 537349,
    "utcDate": "2026-06-26T02:00:00Z",
    "status": "TIMED",
    "homeTeam": "Turkey",
    "awayTeam": "United States"
  },
  {
    "id": 537350,
    "utcDate": "2026-06-26T02:00:00Z",
    "status": "TIMED",
    "homeTeam": "Paraguay",
    "awayTeam": "Australia"
  },
  {
    "id": 537395,
    "utcDate": "2026-06-26T19:00:00Z",
    "status": "TIMED",
    "homeTeam": "Norway",
    "awayTeam": "France"
  },
  {
    "id": 537396,
    "utcDate": "2026-06-26T19:00:00Z",
    "status": "TIMED",
    "homeTeam": "Senegal",
    "awayTeam": "Iraq"
  },
  {
    "id": 537373,
    "utcDate": "2026-06-27T00:00:00Z",
    "status": "TIMED",
    "homeTeam": "Uruguay",
    "awayTeam": "Spain"
  },
  {
    "id": 537374,
    "utcDate": "2026-06-27T00:00:00Z",
    "status": "TIMED",
    "homeTeam": "Cape Verde Islands",
    "awayTeam": "Saudi Arabia"
  }

  
];

const state = {
    db: null,
    participantId: "",
    participantName: "",
    unsubscribePredictions: null,
    unsubscribeRanking: null,
    unsubscribeParticipants: null,
    unsubscribeResults: null,
    results: new Map()
};

const flags = {
    "Algeria": "🇩🇿",
    "Argentina": "🇦🇷",
    "Australia": "🇦🇺",
    "Austria": "🇦🇹",
    "Belgium": "🇧🇪",
    "Bosnia-Herzegovina": "🇧🇦",
    "Brazil": "🇧🇷",
    "Canada": "🇨🇦",
    "Cape Verde Islands": "🇨🇻",
    "Colombia": "🇨🇴",
    "Congo DR": "🇨🇩",
    "Croatia": "🇭🇷",
    "Curaçao": "🇨🇼",
    "Czechia": "🇨🇿",
    "Ecuador": "🇪🇨",
    "Egypt": "🇪🇬",
    "England": "🏴",
    "France": "🇫🇷",
    "Germany": "🇩🇪",
    "Ghana": "🇬🇭",
    "Haiti": "🇭🇹",
    "Iran": "🇮🇷",
    "Iraq": "🇮🇶",
    "Ivory Coast": "🇨🇮",
    "Japan": "🇯🇵",
    "Jordan": "🇯🇴",
    "Mexico": "🇲🇽",
    "Morocco": "🇲🇦",
    "Netherlands": "🇳🇱",
    "New Zealand": "🇳🇿",
    "Norway": "🇳🇴",
    "Panama": "🇵🇦",
    "Paraguay": "🇵🇾",
    "Portugal": "🇵🇹",
    "Qatar": "🇶🇦",
    "Saudi Arabia": "🇸🇦",
    "Scotland": "🏴",
    "Senegal": "🇸🇳",
    "South Africa": "🇿🇦",
    "South Korea": "🇰🇷",
    "Spain": "🇪🇸",
    "Sweden": "🇸🇪",
    "Switzerland": "🇨🇭",
    "Tunisia": "🇹🇳",
    "Turkey": "🇹🇷",
    "United States": "🇺🇸",
    "Uruguay": "🇺🇾",
    "Uzbekistan": "🇺🇿"
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
    bolaoForm: document.getElementById("bolaoForm"),
    connectionStatus: document.getElementById("connectionStatus"),
    gamesContainer: document.getElementById("games-container"),
    loadingOverlay: document.getElementById("loadingOverlay"),
    participantName: document.getElementById("participantName"),
    rankingBody: document.getElementById("rankingBody"),
    recalculateRanking: document.getElementById("recalculateRanking"),
    savedPredictions: document.getElementById("savedPredictions"),
    totalGames: document.getElementById("totalGames"),
    totalParticipants: document.getElementById("totalParticipants"),
    totalResults: document.getElementById("totalResults")
};

start();

function start() {
    els.totalGames.textContent = String(matches.length);
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
        setConnection("Firestore conectado");
        listenToRanking();
        listenToParticipants();
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

    els.participantName.addEventListener("change", () => handleParticipantName().catch(handleFirebaseError));
    els.participantName.addEventListener("blur", () => handleParticipantName().catch(handleFirebaseError));
    els.bolaoForm.addEventListener("submit", savePredictions);
    els.adminOpen.addEventListener("click", () => els.adminDialog.showModal());
    els.adminUnlock.addEventListener("click", unlockAdmin);
    els.recalculateRanking.addEventListener("click", () => recalculateRanking().catch(handleFirebaseError));
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
                <span class="flag" aria-hidden="true">${flags[match.homeTeam] || "🏳"}</span>
                <span class="team-name">${escapeHtml(match.homeTeam)}</span>
            </div>
            <div class="score-input" aria-label="Palpite ${escapeHtml(match.homeTeam)} contra ${escapeHtml(match.awayTeam)}">
                <input type="number" min="0" inputmode="numeric" id="home-${match.id}" aria-label="Gols de ${escapeHtml(match.homeTeam)}" ${match.status === "FINISHED" ? "disabled" : ""}>
                <span>X</span>
                <input type="number" min="0" inputmode="numeric" id="away-${match.id}" aria-label="Gols de ${escapeHtml(match.awayTeam)}" ${match.status === "FINISHED" ? "disabled" : ""}>
            </div>
            <div class="team away">
                <span class="team-name">${escapeHtml(match.awayTeam)}</span>
                <span class="flag" aria-hidden="true">${flags[match.awayTeam] || "🏳"}</span>
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
                <strong>${flags[match.homeTeam] || "🏳"} ${escapeHtml(match.homeTeam)} x ${escapeHtml(match.awayTeam)} ${flags[match.awayTeam] || "🏳"}</strong>
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
    state.participantId = normalizeId(name);

    await setDoc(doc(collection(state.db, "participantes"), state.participantId), {
        nome: name,
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

    state.unsubscribeRanking = onSnapshot(
        collection(state.db, "ranking"),
        (snapshot) => {
            const ranking = snapshot.docs
                .map((item) => item.data())
                .sort((a, b) => b.pontos - a.pontos || b.exatos - a.exatos || a.nome.localeCompare(b.nome));

            renderRanking(ranking);
        },
        handleFirebaseError
    );
}

function listenToParticipants() {
    if (!state.db) return;

    state.unsubscribeParticipants = onSnapshot(
        collection(state.db, "participantes"),
        (snapshot) => {
            els.totalParticipants.textContent = String(snapshot.size);
        },
        handleFirebaseError
    );
}

function listenToResults() {
    if (!state.db) return;

    state.unsubscribeResults = onSnapshot(
        collection(state.db, "resultados"),
        (snapshot) => {
            state.results = new Map(snapshot.docs.map((item) => [Number(item.data().matchId), item.data()]));
            els.totalResults.textContent = String(snapshot.size);
            fillAdminResults();
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
        els.rankingBody.innerHTML = `<tr><td colspan="5" class="empty-state">Aguardando resultados oficiais.</td></tr>`;
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
