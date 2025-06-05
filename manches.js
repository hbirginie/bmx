const players = JSON.parse(localStorage.getItem('players') || '[]');
const raceCount = parseInt(localStorage.getItem('raceCount') || '1');
const roundCount = parseInt(localStorage.getItem('roundCount') || '1');

if (players.length === 0) {
  alert("Aucun joueur trouvé dans le localStorage.");
  throw new Error("Aucun joueur.");
}

const raceDisplay = document.getElementById('raceDisplay');
const validateBtn = document.getElementById('validateBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn'); // <-- nouveau

let currentManche = 0;
let currentRace = 0;

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function repartitionAleatoire(players, racesCount) {
  const shuffled = shuffle(players);
  const groupes = Array.from({ length: racesCount }, () => []);
  shuffled.forEach((player, i) => {
    groupes[i % racesCount].push(player);
  });
  return groupes;
}

const manches = [];
for (let r = 0; r < roundCount; r++) {
  manches.push(repartitionAleatoire(players, raceCount));
}

function createDraggableList(participants) {
  const ul = document.createElement('ul');
  ul.className = 'draggable-list';

  participants.forEach(player => {
    const li = document.createElement('li');
    li.textContent = player;
    ul.appendChild(li);
  });

  Sortable.create(ul, {
    animation: 150,
    ghostClass: 'dragging'
  });

  return ul;
}

function renderCurrentRace() {
  const manche = manches[currentManche];
  const race = manche[currentRace];
  raceDisplay.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'race-container';
  container.innerHTML = `
    <h3>Manche ${currentManche + 1}</h3>
    <h4>Race ${currentRace + 1}</h4>
  `;

  container.appendChild(createDraggableList(race));
  raceDisplay.appendChild(container);

  const isFirstRace = currentManche === 0 && currentRace === 0;
  const isLastRace = currentManche === manches.length - 1 && currentRace === manches[currentManche].length - 1;

  // Bouton Précédent
  prevBtn.style.display = isFirstRace ? 'none' : 'inline-block';

  // Bouton Suivant
  nextBtn.style.display = isLastRace ? 'none' : 'inline-block';

  // Bouton Valider
  validateBtn.style.display = isLastRace ? 'inline-block' : 'none';
}


function saveCurrentRace() {
  const ul = document.querySelector('ul.draggable-list');
  if (!ul) return;

  const classement = [...ul.querySelectorAll('li')].map(li => li.textContent);
  const key = `race${currentRace + 1}manche${currentManche + 1}`;

  let allResults = JSON.parse(localStorage.getItem('allResults')) || {};
  allResults[key] = classement;
  localStorage.setItem('allResults', JSON.stringify(allResults));

  console.log(`Sauvegardé : ${key}`, classement);
}

nextBtn.addEventListener('click', () => {
  saveCurrentRace();

  if (currentRace < manches[currentManche].length - 1) {
    currentRace++;
  } else if (currentManche < manches.length - 1) {
    currentManche++;
    currentRace = 0;
  } else {
    alert("Toutes les courses ont été vues.");
    return;
  }

  renderCurrentRace();
});

prevBtn.addEventListener('click', () => {
  saveCurrentRace();

  if (currentRace > 0) {
    currentRace--;
  } else if (currentManche > 0) {
    currentManche--;
    currentRace = manches[currentManche].length - 1;
  } else {
    alert("C'est la première course.");
    return;
  }

  renderCurrentRace();
});

validateBtn.addEventListener('click', () => {
  saveCurrentRace();

  const scores = calculerScores();
  localStorage.setItem('finalScores', JSON.stringify(scores));
  window.location.href = 'resultats_manches.html';
});

function attribuerPoints(n) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

function calculerScores() {
  const scoresParJoueur = {};
  const classementParManche = {};

  manches.forEach((manche, mancheIndex) => {
    manche.forEach((_, raceIndex) => {
      const key = `race${raceIndex + 1}manche${mancheIndex + 1}`;
      const classement = (JSON.parse(localStorage.getItem('allResults')) || {})[key];
      if (!classement) return;

      const points = attribuerPoints(classement.length);
      classement.forEach((joueur, pos) => {
        if (!scoresParJoueur[joueur]) scoresParJoueur[joueur] = 0;
        if (!classementParManche[joueur]) classementParManche[joueur] = [];

        scoresParJoueur[joueur] += points[pos];

        if (!classementParManche[joueur][mancheIndex]) {
          classementParManche[joueur][mancheIndex] = points[pos];
        } else {
          classementParManche[joueur][mancheIndex] = Math.min(
            classementParManche[joueur][mancheIndex],
            points[pos]
          );
        }
      });
    });
  });

  const dernieresPositions = {};
  Object.entries(classementParManche).forEach(([joueur, classementArray]) => {
    const reversed = [...classementArray].reverse();
    dernieresPositions[joueur] = reversed.slice(0, 3);
  });

  localStorage.setItem('dernieresPositions', JSON.stringify(dernieresPositions));
  return scoresParJoueur;
}

// Démarrage
renderCurrentRace();
