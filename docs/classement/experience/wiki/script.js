async function convert() {
    const niveau = Number(document.getElementById('level').value);
    const texte = document.getElementById('levelInfo');

    if(!niveau) return texte.innerHTML = "📈 En attente d'un niveau...";

    const xpNecessaire = Math.floor(50 * Math.pow(niveau, 1.5));

    texte.innerHTML = `<bold>${xpNecessaire}XP <bold> sont nécessaires pour passer au niveau ${niveau + 1}`
}

async function convertTexte() {
    const longueurMessage = document.getElementById('texte').value.length;

    const texte = document.getElementById('texteInfo');

    if(longueurMessage === 0) return texte.innerHTML = "🧐 Attente d'un message...";

    let Xp = Math.round(1 + (longueurMessage ** 0.8)); 

    texte.innerHTML = `Ce message vous rapportera <bold>${Xp}XP<bold> !<br><bold>${Xp * 1.2}XP</bold> pour les boostés x1,2<br><bold>${Xp * 1.5}XP</bold> pour les boostés x1,5<br><bold>${Xp * 2}XP</bold> pour les boostés x2`

}