const scoresList = document.getElementById('scoresList');

const demiResult = JSON.parse(localStorage.getItem('demiFinalesResult') || '{}');
const demi1 = demiResult.demi1 || [];
const demi2 = demiResult.demi2 || [];

const scores = {};

function attribuerPoints(liste) {
  liste.forEach((nom, index) => {
    if (!scores[nom]) scores[nom] = 0;
    scores[nom] += index + 1; // 1 point pour 1er, etc.
  });
}

attribuerPoints(demi1);
attribuerPoints(demi2);

localStorage.setItem('demiFinalesScores', JSON.stringify(scores));

const sortedResults = Object.entries(scores).sort((a, b) => a[1] - b[1]);

if (sortedResults.length === 0) {
  scoresList.innerHTML = '<li>Aucun résultat disponible.</li>';
} else {
  sortedResults.forEach(([nom, points], index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${nom}`;
    const spanScore = document.createElement('span');
    spanScore.textContent = `${points} pts`;
    li.appendChild(spanScore);
    scoresList.appendChild(li);
  });
}

// Création des finales
document.getElementById('createFinalsBtn').addEventListener('click', () => {
  const consolantesActive = localStorage.getItem('consolantes') === 'true';

  // Utiliser les résultats des demi-finales pour A et B
  const finaleA = sortedResults.slice(0, 8).map(entry => entry[0]);
  const finaleB = sortedResults.slice(8, 16).map(entry => entry[0]);

  const finales = {
    finaleA,
    finaleB
  };

  if (consolantesActive) {
    // Charger les scores de manches pour les consolantes
    const mancheScores = JSON.parse(localStorage.getItem('finalScores') || '{}');
    const sortedPlayers = Object.entries(mancheScores)
      .sort((a, b) => a[1] - b[1])  // tri croissant (meilleur score d'abord)
      .map(([name]) => name);

    // On récupère à partir du 17e
    const autres = sortedPlayers.slice(16); // index 16 = 17e place

    const groupes = Math.ceil(autres.length / 8);
    for (let i = 0; i < groupes; i++) {
      const debut = i * 8;
      const fin = debut + 8;
      const finalistes = autres.slice(debut, fin);
      const label = `finale${String.fromCharCode(67 + i)}`; // C, D, E...
      finales[label] = finalistes;
    }
  }

  localStorage.setItem('finales', JSON.stringify(finales));
  localStorage.setItem('extendedFinales', localStorage.getItem('consolantes') || 'false');

  window.location.href = 'finales.html';
});
