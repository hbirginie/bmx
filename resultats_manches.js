const scoresList = document.getElementById('scoresList');
const demiFinalesBtn = document.getElementById('demiFinalesBtn');

// Récupérer les scores et les positions depuis le localStorage
const scores = JSON.parse(localStorage.getItem('finalScores') || '{}');
const dernieresPositions = JSON.parse(localStorage.getItem('dernieresPositions') || '{}');

if (Object.keys(scores).length === 0) {
  scoresList.innerHTML = '<li>Aucun résultat disponible.</li>';
} else {
  // Tri avec critères multiples :
  // 1. Score total (plus petit = meilleur)
  // 2. Meilleure position dans la dernière manche
  // 3. Puis avant-dernière
  // 4. Puis avant-avant-dernière
  const sortedScores = Object.entries(scores).sort((a, b) => {
    const scoreDiff = a[1] - b[1];
    if (scoreDiff !== 0) return scoreDiff;

    const posA = dernieresPositions[a[0]] || [];
    const posB = dernieresPositions[b[0]] || [];

    for (let i = 0; i < 3; i++) {
      const pa = posA[i] ?? Infinity;
      const pb = posB[i] ?? Infinity;
      if (pa !== pb) return pa - pb;
    }

    return 0; // égalité parfaite
  });

  // Affichage des résultats
  sortedScores.forEach(([joueur, score], index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${joueur}`;

    const spanScore = document.createElement('span');
    spanScore.textContent = `${score} pts`;
    li.appendChild(spanScore);

    scoresList.appendChild(li);
  });
}

// Bouton pour aller aux demi-finales
demiFinalesBtn.addEventListener('click', () => {
  window.location.href = 'demi-finales.html';
});
