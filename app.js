const matches = [  
  
  
  
"status": 
"TIMED",
  
  
  
  
"matchday": 
3,
  
  
  
  
"stage": 
"GROUP_STAGE",
  
  
  
  
"group": 
"GROUP_H",
  
  
  
  
"lastUpdated": 
"2026-06-16T15:20:15Z",
  
  
  
  
"homeTeam": 
{
  
  
  
  
  
"id": 
758,
  
  
  
  
  
"name": 
"Uruguay",
  
  
  
  
  
"shortName": 
"Uruguay",
  
  
  
  
  
"tla": 
"URU",
  
  
  
  
  
"crest": 
"https://crests.football-data.org/758.svg"
  
  
  
  
},
  
  
  
  
"awayTeam": 
{
  
  
  
  
  
"id": 
760,
  
  
  
  
  
"name": 
"Spain",
  
  
  
  
  
"shortName": 
"Spain",
  
  
  
  
  
"tla": 
"ESP",
  
  
  
  
  
"crest": 
"https://crests.football-data.org/760.svg"
  
  
  
  
},
  
  
  
  
"score": 
{
  
  
  
  
  
"winner": 
null,
  
  
  
  
  
"duration": 
"REGULAR",
  
  
  
  
  
"fullTime": 
{
  
  
  
  
  
  
"home": 
null,
  
  
  
  
  
  
"away": 
null
  
  
  
  
  
},
  
  
  
  
  
"halfTime": 
{
  
  
  
  
  
  
"home": 
null,
  
  
  
  
  
  
"away": 
null
  
  
  
  
  
}
  
  
  
  
},
  
  
  
  
"odds": 
{
  
  
  
  
  
"msg": 
"Activate Odds-Package in User-Panel to retrieve odds."
  
  
  
  
},
  
  
  
  
"referees": 
[
  
  
  
  
];

const container = document.getElementById("games-container");

renderGames();

function renderGames() {

    matches.forEach(match => {

        if(match.status !== "TIMED") return;

        const date = new Date(match.utcDate)
            .toLocaleString("pt-BR");

        const card = document.createElement("div");

        card.className = "game-card";

        card.innerHTML = `
            <div class="match-date">
                ${date}
            </div>

            <div class="teams">

                <div class="team">
                    ${match.homeTeam}
                </div>

                <div class="score-input">
                    <input
                        type="number"
                        min="0"
                        id="home-${match.id}"
                    >

                    <span>X</span>

                    <input
                        type="number"
                        min="0"
                        id="away-${match.id}"
                    >
                </div>

                <div class="team">
                    ${match.awayTeam}
                </div>

            </div>
        `;

        container.appendChild(card);
    });

}

document
.getElementById("bolaoForm")
.addEventListener("submit", e => {

    e.preventDefault();

    const palpites = matches
        .filter(match => match.status === "TIMED")
        .map(match => {

            return {

                matchId: match.id,

                homeTeam: match.homeTeam,

                awayTeam: match.awayTeam,

                homeGoals: Number(
                    document.getElementById(
                        `home-${match.id}`
                    ).value
                ),

                awayGoals: Number(
                    document.getElementById(
                        `away-${match.id}`
                    ).value
                )
            };

        });

    localStorage.setItem(
        "palpites",
        JSON.stringify(palpites)
    );

    document
        .getElementById("savedPredictions")
        .textContent =
            JSON.stringify(
                palpites,
                null,
                2
            );

    alert("Palpites salvos!");
});

loadPredictions();

function loadPredictions(){

    const saved =
        localStorage.getItem("palpites");

    if(!saved) return;

    const palpites =
        JSON.parse(saved);

    palpites.forEach(p => {

        const home =
            document.getElementById(
                `home-${p.matchId}`
            );

        const away =
            document.getElementById(
                `away-${p.matchId}`
            );

        if(home) home.value =
            p.homeGoals;

        if(away) away.value =
            p.awayGoals;
    });

    document
        .getElementById("savedPredictions")
        .textContent =
            JSON.stringify(
                palpites,
                null,
                2
            );
}
