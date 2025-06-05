// Récupérer les données depuis localStorage
const players = JSON.parse(localStorage.getItem('players') || '[]');
const raceCount = parseInt(localStorage.getItem('raceCount') || '1');
const roundCount = parseInt(localStorage.getItem('roundCount') || '1');

if (players.length === 0) {
  alert("Aucun joueur trouvé dans le localStorage.");
  throw new Error("Aucun joueur.");
}

const manchesContainer = document.getElementById('manchesContainer');
const validateBtn = document.getElementById('validateBtn');

// Fonction pour mélanger un tableau (Fisher-Yates)
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length -1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i +1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Répartir les joueurs aléatoirement dans R groupes équilibrés
function repartitionAleatoire(players, racesCount) {
  const shuffled = shuffle(players);
  const groupes = Array.from({length: racesCount}, () => []);
  shuffled.forEach((player, i) => {
    groupes[i % racesCount].push(player);
  });
  return groupes;
}

// Générer la structure manches -> courses -> joueurs
const manches = [];
for (let r = 0; r < roundCount; r++) {
  manches.push(repartitionAleatoire(players, raceCount));
}

// --- Affichage et Drag & Drop avec SortableJS ---

/**
 * Crée une liste draggable (ul) avec les participants d'une course
 * @param {string[]} participants 
 * @param {string} mancheId 
 * @param {string} raceId 
 * @returns {HTMLElement} ul
 */
function createDraggableList(participants, mancheId, raceId) {
  const ul = document.createElement('ul');
  ul.className = 'draggable-list';
  ul.dataset.manche = mancheId;
  ul.dataset.race = raceId;
  
  participants.forEach((player) => {
    const li = document.createElement('li');
    li.textContent = player;
    ul.appendChild(li);
  });
  
  // Initialiser SortableJS sur la liste
  Sortable.create(ul, {
    animation: 150,
    ghostClass: 'dragging', // utilise ta classe CSS existante pour l'effet visuel
    // options supplémentaires si besoin...
  });
  
  return ul;
}

// Affichage complet des manches et courses
function renderManches() {
  manchesContainer.innerHTML = '';
  manches.forEach((manche, mancheIndex) => {
    const mancheDiv = document.createElement('div');
    mancheDiv.className = 'manche';
    mancheDiv.id = `manche-${mancheIndex+1}`;
    mancheDiv.innerHTML = `<h3>Manche ${mancheIndex+1}</h3>`;
    
    manche.forEach((race, raceIndex) => {
      const raceDiv = document.createElement('div');
      raceDiv.className = 'race';
      raceDiv.id = `manche${mancheIndex+1}-race${raceIndex+1}`;
      raceDiv.innerHTML = `<h4>Race ${raceIndex+1}</h4>`;
      raceDiv.appendChild(createDraggableList(race, mancheIndex+1, raceIndex+1));
      mancheDiv.appendChild(raceDiv);
    });
    
    manchesContainer.appendChild(mancheDiv);
  });
}

renderManches();

// Calcul des points pour une course (1 pour 1er, N pour dernier)
function attribuerPoints(nombreParticipants) {
  const points = [];
  for(let i=1; i<=nombreParticipants; i++) {
    points.push(i);
  }
  return points;
}

// Calcul des scores globaux par joueur
function calculerScores() {
  const scoresParJoueur = {};
  const classementParManche = {}; // { joueur: [position_m1, position_m2, ...] }

  manches.forEach((manche, mancheIndex) => {
    manche.forEach((_, raceIndex) => {
      const ul = document.querySelector(`#manche-${mancheIndex + 1} #manche${mancheIndex + 1}-race${raceIndex + 1} ul`);
      if (!ul) return;

      const participants = [...ul.querySelectorAll('li')].map(li => li.textContent);
      const points = attribuerPoints(participants.length);

      participants.forEach((joueur, pos) => {
        // Initialisation
        if (!scoresParJoueur[joueur]) scoresParJoueur[joueur] = 0;
        if (!classementParManche[joueur]) classementParManche[joueur] = [];

        scoresParJoueur[joueur] += points[pos];

        // Stocker la meilleure position du joueur dans cette manche
        if (!classementParManche[joueur][mancheIndex]) {
          classementParManche[joueur][mancheIndex] = points[pos];
        } else {
          classementParManche[joueur][mancheIndex] = Math.min(classementParManche[joueur][mancheIndex], points[pos]);
        }
      });
    });
  });

  // Stocker les 3 dernières positions (ou moins si moins de manches)
  const dernieresPositions = {};
  Object.entries(classementParManche).forEach(([joueur, classementArray]) => {
    const reversed = [...classementArray].reverse(); // dernières manches d'abord
    dernieresPositions[joueur] = reversed.slice(0, 3);
  });

  localStorage.setItem('dernieresPositions', JSON.stringify(dernieresPositions));
  return scoresParJoueur;
}


validateBtn.addEventListener('click', () => {
  const scores = calculerScores();

  // Stocker dans localStorage
  localStorage.setItem('finalScores', JSON.stringify(scores));

  // Redirection vers resultats_manches.html
  window.location.href = 'resultats_manches.html';
});
