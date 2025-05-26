const scores = JSON.parse(localStorage.getItem('finalScores') || '{}');
const sortedPlayers = Object.entries(scores)
  .sort((a, b) => a[1] - b[1])  // tri par score croissant
  .map(([name]) => name);

// Répartition en demi-finales (indices spécifiques)
const demi1Indices = [0, 3, 4, 7, 8, 11, 12, 15];
const demi2Indices = [1, 2, 5, 6, 9, 10, 13, 14];

const demi1Players = demi1Indices.map(i => sortedPlayers[i]).filter(Boolean);
const demi2Players = demi2Indices.map(i => sortedPlayers[i]).filter(Boolean);

function renderList(containerId, players) {
  const container = document.getElementById(containerId);
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

renderList('demi1', demi1Players);
renderList('demi2', demi2Players);

document.getElementById('validateBtn').addEventListener('click', () => {
  const demi1Final = Array.from(document.querySelectorAll('#demi1 li')).map(li => li.textContent);
  const demi2Final = Array.from(document.querySelectorAll('#demi2 li')).map(li => li.textContent);

  localStorage.setItem('demiFinalesResult', JSON.stringify({
    demi1: demi1Final,
    demi2: demi2Final
  }));

  window.location.href = 'resultats_demi-finales.html';
});
