const scores = JSON.parse(localStorage.getItem('finalScores') || '{}');
const sortedPlayers = Object.entries(scores)
  .sort((a, b) => a[1] - b[1])  // tri par score croissant
  .map(([name]) => name);

// Répartition en demi-finales (indices spécifiques)
const demi1Indices = [0, 3, 4, 7, 8, 11, 12, 15];
const demi2Indices = [1, 2, 5, 6, 9, 10, 13, 14];

const demi1Players = demi1Indices.map(i => sortedPlayers[i]).filter(Boolean);
const demi2Players = demi2Indices.map(i => sortedPlayers[i]).filter(Boolean);

const demi1Container = document.getElementById('demi1');
const demi2Container = document.getElementById('demi2');
const demi2Div = demi2Container.parentElement; // div .demi
const nextBtn = document.getElementById('nextBtn');
const validateBtn = document.getElementById('validateBtn');

function renderList(container, players) {
  container.innerHTML = ''; // vide avant d'ajouter
  players.forEach(player => {
    const li = document.createElement('li');
    li.textContent = player;
    container.appendChild(li);
  });

  new Sortable(container, {
    animation: 150,
    ghostClass: 'dragging',
  });
}

// Affichage initial demi 1 seulement
renderList(demi1Container, demi1Players);
demi2Div.style.display = 'none';
validateBtn.style.display = 'none';

let currentStep = 0; // 0 = demi1, 1 = demi2

nextBtn.addEventListener('click', () => {
  if (currentStep === 0) {
    // Passer à la demi-finale 2
    demi1Container.parentElement.style.display = 'none';
    demi2Div.style.display = 'block';
    renderList(demi2Container, demi2Players);
    currentStep = 1;

    // Cacher bouton suivant, afficher valider
    nextBtn.style.display = 'none';
    validateBtn.style.display = 'block';
  }
});

// Valider les résultats
validateBtn.addEventListener('click', () => {
  const demi1Final = Array.from(demi1Container.querySelectorAll('li')).map(li => li.textContent);
  const demi2Final = Array.from(demi2Container.querySelectorAll('li')).map(li => li.textContent);

  localStorage.setItem('demiFinalesResult', JSON.stringify({
    demi1: demi1Final,
    demi2: demi2Final
  }));

  window.location.href = 'resultats_demi-finales.html';
});
