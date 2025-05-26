const playerList = document.getElementById('playerList');
const shuffleBtn = document.getElementById('shuffleBtn');
const validateBtn = document.getElementById('validateBtn');
const infoDiv = document.getElementById('info');

let players = JSON.parse(localStorage.getItem('players')) || [];
const raceCount = parseInt(localStorage.getItem('raceCount')) || 0;
const roundCount = parseInt(localStorage.getItem('roundCount')) || 0;

infoDiv.innerHTML = `<p><strong>Manches (Races) :</strong> ${raceCount} &nbsp;&nbsp; <strong>Tours (Rounds) :</strong> ${roundCount}</p>`;

function shuffle(array) {
  for (let i = array.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i+1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function renderPlayers() {
  playerList.innerHTML = '';
  players.forEach((name, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. ${name}`;
    playerList.appendChild(li);
  });

  enableDragAndDrop();
}

function enableDragAndDrop() {
  Sortable.create(playerList, {
    animation: 150,
    ghostClass: 'dragging',
  });
}

shuffleBtn.addEventListener('click', () => {
  shuffle(players);
  renderPlayers();
});

validateBtn.addEventListener('click', () => {
  const newOrder = Array.from(playerList.children).map(li =>
    li.textContent.replace(/^\d+\.\s*/, '')
  );
  localStorage.setItem('manchesResults', JSON.stringify(newOrder));
  alert("Classement des manches validé !");
});

renderPlayers();
