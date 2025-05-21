const mois = "Mars";
const recompenses = [
    "Boost XP x2, Rôle spécial",
    "Boost XP x 1,5",
    "Boost XP x 1,2",
];

const admins = [
    "849563187157139476",
    "931970652477489173",
    "1081519921026060288",
    "1256557065346744421",
    "823116062970085377",
    "826889516831866912",
    "440858379334975488",
    "804749434734379053"
];

function xpNecessairePourNiveau(niveau) {
    return Math.floor(50 * Math.pow(niveau, 1.5));
}

function createBubble(container) {
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");

    bubble.style.left = Math.floor(Math.random() * 100) + "%";
    bubble.style.animationDelay = Math.random() * 2 + "s";
    container.appendChild(bubble);
}

async function checkImageExists(url) {
    try {
        const response = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
        return response.ok;
    } catch {
        return false; 
    }
}

async function fetchUsersSaison() {
    try {
        const response = await fetch("https://dolti.glitch.me/users");
        let users = await response.json();
        
        const container = document.getElementById("userContainer");

        const countdownDiv = document.createElement("div");
        countdownDiv.classList.add("countdown");
        countdownDiv.innerHTML = ` 
            <p class="ci">Temps restant avant la fin de la saison</p>
            <span id="jours">00</span>:
            <span id="heures">00</span>:
            <span id="minutes">00</span>:
            <span id="secondes">00</span>
            <div class = "description">
                <h2>🔥 Comment ça marche ? 🔥</h2>
                <p>📅 <strong>Chaque 1er du mois</strong>, une <strong>nouvelle saison</strong> démarre ! Tout le monde repart de zéro avec les <strong>mêmes chances</strong> de briller. 🌟<br>
                🏆 À la <strong>fin de la saison</strong>, les <strong>3 meilleurs</strong> décrochent des <strong>récompenses exclusives</strong> ! 🎁💰<br>
                Prêt à te hisser au sommet ? 💪😏</p>
            </div>
        `;

        const cadeauxDiv = document.createElement("div");
        cadeauxDiv.classList.add("gifts");
        cadeauxDiv.innerHTML = ` 
        <div class = "gifts-des">
            <h2>🎁 Récompenses du mois de ${mois} 🎁</h2>
            <p><b>🥇 1er :</b> ${recompenses[0]}<br><b>🥈 2ème :</b> ${recompenses[1]}<br><b>🥉 3ème :</b> ${recompenses[2]}</p>
        </div>
        <p class="description">Les récompenses durent 1 mois. Le boost XP ne s'applique pas sur le classement saisonner.</p>
        `

        container.appendChild(countdownDiv); 
        container.appendChild(cadeauxDiv);

        const filteredUsers = users.filter(user => !admins.includes(user.user));

        filteredUsers.sort((a, b) => {
            if (a.Levelsaison === b.Levelsaison) {
                return b.XPsaison - a.XPsaison;
            }
            return b.Levelsaison - a.Levelsaison;
        });

        filteredUsers.forEach(async (user, index) => {
            if(!user.profil || !user.name) return;

            const xpMax = xpNecessairePourNiveau(user.Levelsaison);
            const xpPercentage = Math.min((user.XPsaison / xpMax) * 100, 100);

            const card = document.createElement("section");
            card.id = user.username; 
            card.classList.add("user-card");
            document.body.appendChild(card);

            const mainDiv = document.createElement("div");
            mainDiv.classList.add("user-main");

            const detailsDiv = document.createElement("div");
            detailsDiv.classList.add("user-details");

            const avatarDiv = document.createElement("div");
            avatarDiv.classList.add("user-avatar");

            const topDiv = document.createElement("div");
            topDiv.classList.add("user-top");
            topDiv.innerHTML = `${index + 1}<sup>${index + 1 === 1 ? `er` : `ème`}</sup>`;

            const topAndAvatarDiv = document.createElement("div");
            topAndAvatarDiv.classList.add("user-top-and-avatar"); 
            topAndAvatarDiv.appendChild(topDiv);

            const img = document.createElement("img");

            if (!user.profil) {
                img.src = "https://cdn.discordapp.com/embed/avatars/0.png";
                img.alt = `${user.name}'s avatar`;
            } else {
                img.src = user.profil;
                img.alt = `${user.name}'s avatar`;
            }            

            topAndAvatarDiv.appendChild(img)

            avatarDiv.appendChild(topAndAvatarDiv);

            const nameDiv = document.createElement("div");
            nameDiv.classList.add("user-info-name");

            detailsDiv.appendChild(avatarDiv);
            detailsDiv.appendChild(nameDiv);

            const levelDiv = document.createElement("div");
            levelDiv.classList.add("user-info-level");
            levelDiv.innerHTML = `<p>NIVEAU ${user.Levelsaison}</p><p>${user.XPsaison} XP</p>`;

            mainDiv.appendChild(detailsDiv);
            mainDiv.appendChild(levelDiv);

            const progressDiv = document.createElement("div");
            progressDiv.classList.add("user-progress");
            progressDiv.innerHTML = `
                <div class="progress-bar">
                    <div class="progress" style="width: ${xpPercentage}%;"><b>${Math.floor(xpPercentage)}%</b> <i>(${user.XPsaison}XP/${xpMax}XP)</i></div>
                </div>
            `;

            const progressCompleted = progressDiv.querySelector(".progress");

            const numberOfBubbles = Math.floor(xpPercentage / 5) + 1; 
            for (let i = 0; i < numberOfBubbles; i++) {
                createBubble(progressCompleted);
            }

            card.appendChild(mainDiv);
            card.appendChild(progressDiv);

            container.appendChild(card);
        });
        
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
}

fetchUsersSaison();

function getNextFirstOfMonth() {
    const now = new Date();
    let nextMonth = now.getMonth() + 1;
    let nextYear = now.getFullYear();

    if (nextMonth === 12) {
        nextMonth = 0;
        nextYear += 1;
    }

    return new Date(nextYear, nextMonth, 1, 0, 0, 0); 
}

function updateCountdown() {
    const now = new Date();
    const targetDate = getNextFirstOfMonth();
    const diff = targetDate - now;

    if (diff <= 0) {
        document.querySelector(".countdown").innerHTML = "Nouvelle période commencée !";
        return;
    }

    const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
    const heures = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const secondes = Math.floor((diff / 1000) % 60);

    const joursElem = document.getElementById("jours");
    const heuresElem = document.getElementById("heures");
    const minutesElem = document.getElementById("minutes");
    const secondesElem = document.getElementById("secondes");

    if (joursElem) {
        joursElem.textContent = jours.toString().padStart(2, "0");
    }
    if (heuresElem) {
        heuresElem.textContent = heures.toString().padStart(2, "0");
    }
    if (minutesElem) {
        minutesElem.textContent = minutes.toString().padStart(2, "0");
    }
    if (secondesElem) {
        secondesElem.textContent = secondes.toString().padStart(2, "0");
    }
}


setInterval(updateCountdown, 1000);
