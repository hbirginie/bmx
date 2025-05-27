const scoresList = document.getElementById('scoresList');
const demiFinalesBtn = document.getElementById('demiFinalesBtn');

// Récupérer les scores depuis localStorage
const scores = JSON.parse(localStorage.getItem('finalScores') || '{}');

if (Object.keys(scores).length === 0) {
scoresList.innerHTML = '<li>Aucun résultat disponible.</li>';
} else {
// Trier par score croissant (le meilleur score en premier)
const sortedScores = Object.entries(scores).sort((a, b) => a[1] - b[1]);

sortedScores.forEach(([joueur, score], index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${joueur}`;
    const spanScore = document.createElement('span');
    spanScore.textContent = `${score} pts`;
    li.appendChild(spanScore);
    scoresList.appendChild(li);
});
}

demiFinalesBtn.addEventListener('click', () => {
    window.location.href = 'demi-finales.html';
});