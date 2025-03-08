const mois = "Février";
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

async function fetchBoost() {
    const response = await fetch("https://dolti.glitch.me/xp/boost");
    const XPBoost = await response.json();
    return XPBoost;
}

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

async function fetchUsers() {
    try {
        const XPBoost = await fetchBoost();  

        const response = await fetch("https://dolti.glitch.me/users");
        let users = await response.json();
        
        const container = document.getElementById("userContainer");

        const uniqueUsers = new Set();

        users = users.filter(user => {
            if (!uniqueUsers.has(user.user)) {
                uniqueUsers.add(user.user);
                return true;
            }
            return false;
        });

        container.innerHTML = ""; 

        users.sort((a, b) => {
            if (a.level === b.level) {
                return b.xp - a.xp;
            }
            return b.level - a.level;
        });

        users.forEach((user, index) => {
            if(!user.profil || !user.name) return;

            const xpMax = xpNecessairePourNiveau(user.level);
            const xpPercentage = Math.min((user.xp / xpMax) * 100, 100);

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

            const img = document.createElement("img");
            img.src = user.profil;
            img.alt = "Avatar";

            const topAndAvatarDiv = document.createElement("div");
            topAndAvatarDiv.classList.add("user-top-and-avatar"); 

            topAndAvatarDiv.appendChild(topDiv);
            topAndAvatarDiv.appendChild(img);

            avatarDiv.appendChild(topAndAvatarDiv);

            const nameDiv = document.createElement("div");
            nameDiv.classList.add("user-info-name");

            nameDiv.innerHTML = `
                <h3><div class="icon"></div> <span class="name-text">${user.name}</span>
                    ${XPBoost[user.user]?.type === "boost" ? `
                        <span class="tooltip"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m226-559 78 33q14-28 29-54t33-52l-56-11-84 84Zm142 83 114 113q42-16 90-49t90-75q70-70 109.5-155.5T806-800q-72-5-158 34.5T492-656q-42 42-75 90t-49 90Zm178-65q-23-23-23-56.5t23-56.5q23-23 57-23t57 23q23 23 23 56.5T660-541q-23 23-57 23t-57-23Zm19 321 84-84-11-56q-26 18-52 32.5T532-299l33 79Zm313-653q19 121-23.5 235.5T708-419l20 99q4 20-2 39t-20 33L538-80l-84-197-171-171-197-84 167-168q14-14 33.5-20t39.5-2l99 20q104-104 218-147t235-24ZM157-321q35-35 85.5-35.5T328-322q35 35 34.5 85.5T327-151q-25 25-83.5 43T82-76q14-103 32-161.5t43-83.5Zm57 56q-10 10-20 36.5T180-175q27-4 53.5-13.5T270-208q12-12 13-29t-11-29q-12-12-29-11.5T214-265Z"/></svg>
                            <span class="tooltip-text">${user.name} a boosté le serveur Discord.<br>Il/Elle bénéficie d'un boost XP x2.</span>
                        </span>
                    ` : ""}
                    ${admins.includes(user.user) ? `
                        <span class="tooltip"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Z"/></svg>
                            <span class="tooltip-text">${user.name} fait partie de l'équipe de modération du serveur Discord.</span>
                        </span>
                    ` : ""}
                </h3>
                <p>@${user.username}</p>
            `;

            detailsDiv.appendChild(avatarDiv);
            detailsDiv.appendChild(nameDiv);

            const levelDiv = document.createElement("div");
            levelDiv.classList.add("user-info-level");
            levelDiv.innerHTML = `<p>NIVEAU ${user.level}</p><p>${user.xp} XP</p>`;

            mainDiv.appendChild(detailsDiv);
            mainDiv.appendChild(levelDiv);

            const progressDiv = document.createElement("div");
            progressDiv.classList.add("user-progress");
            progressDiv.innerHTML = `
                <div class="progress-bar">
                    <div class="progress" style="width: ${xpPercentage}%;"><b>${Math.floor(xpPercentage)}%</b> <i>(${user.xp}XP/${xpMax}XP)</i></div>
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

        setTimeout(() => {
            const targetId = window.location.hash.substring(1); 
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 500);
        
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
}

fetchUsers();

function handleHashChange() {
    const targetId = window.location.hash.substring(1); 
    const targetElement = document.getElementById(targetId);

    const userContainer = document.getElementById("userContainer");

    if (!userContainer) {
        console.error("Erreur : Le conteneur 'userContainer' est introuvable.");
        return;
    }

    let errorContainer = document.getElementById("error-message");
    if (!errorContainer) {
        errorContainer = document.createElement("div");
        errorContainer.id = "error-message";
        errorContainer.classList.add("error-message-container");
        userContainer.parentNode.insertBefore(errorContainer, userContainer);
    }

    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
        errorContainer.textContent = ""; 
    } else {

        window.scrollTo(0, 0);
        errorContainer.innerHTML = `
        <div class="error-message">
            ⚠️ Erreur : L'utilisateur "<b>${targetId}</b>" est introuvable.<br>
            Il est possible que cet utilisateur ait changé d'identifiant sans envoyer de message sur le serveur récemment, 
            auquel cas son classement n'a pas encore été mis à jour.
        </div>
    `;
    }
}

if (window.location.hash) {
    setTimeout(handleHashChange, 1000); 
}

window.addEventListener("hashchange", () => {
    setTimeout(handleHashChange, 1000);
});

