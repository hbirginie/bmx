const players = [];
const input = document.getElementById('playerNameInput');
const playerList = document.getElementById('playerList');
const addBtn = document.getElementById('addBtn');
const playBtn = document.getElementById('playButton');

function renderPlayers() {
  playerList.innerHTML = '';
  players.forEach((player, idx) => {
    const li = document.createElement('li');
    li.textContent = `${idx + 1}. ${player}`;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✖';
    removeBtn.classList.add('remove-btn');
    removeBtn.title = "Supprimer ce joueur";
    removeBtn.onclick = () => {
      players.splice(idx, 1);
      renderPlayers();
    };
    li.appendChild(removeBtn);
    playerList.appendChild(li);
  });
}

addBtn.onclick = () => {
  const name = input.value.trim();
  if (name === '') {
    alert("Le nom ne peut pas être vide.");
    return;
  }
  if (players.includes(name)) {
    alert("Ce joueur est déjà ajouté.");
    return;
  }
  players.push(name);
  input.value = '';
  input.focus();
  renderPlayers();
};

input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addBtn.click();
  }
});

playBtn.onclick = () => {
  if (players.length === 0) {
    alert("Ajoute au moins un joueur avant de commencer.");
    return;
  }
  // Stocker les joueurs dans le localStorage
  localStorage.setItem('players', JSON.stringify(players));

  // Redirection vers options.html
  window.location.href = 'options.html';
};

input.focus();
