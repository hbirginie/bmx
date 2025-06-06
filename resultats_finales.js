const finalesResult = JSON.parse(localStorage.getItem('finalesResult') || '{}');
const finaleA = finalesResult.finaleA || [];

// Affichage du podium de la finale A
document.getElementById('firstPlace').textContent = finaleA[0] || "N/A";
document.getElementById('secondPlace').textContent = finaleA[1] || "N/A";
document.getElementById('thirdPlace').textContent = finaleA[2] || "N/A";

const toggleBtn = document.getElementById('toggleBtn');
const allResultsDiv = document.getElementById('allResults');
let visible = false;

toggleBtn.addEventListener('click', () => {
  visible = !visible;
  allResultsDiv.style.display = visible ? 'block' : 'none';
  toggleBtn.textContent = visible ? 'Cacher les résultats' : 'Afficher tous les résultats';

  if (visible && allResultsDiv.innerHTML.trim() === '') {
    const order = ['finaleA', 'finaleB', 'finaleC', 'finaleD', 'finaleE'];

    order.forEach(finaleName => {
      const players = finalesResult[finaleName];
      if (!players) return;

      const block = document.createElement('div');
      block.className = 'finale-block';

      const h2 = document.createElement('h2');
      h2.textContent = 'Finale ' + finaleName.slice(-1).toUpperCase();
      block.appendChild(h2);

      const ul = document.createElement('ul');
      players.forEach((name, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${name}`;
        ul.appendChild(li);
      });

      block.appendChild(ul);
      allResultsDiv.appendChild(block);
    });
  }
});

// --- Fonction d’export CSV ---

function escapeCsv(value) {
  if (typeof value !== 'string') value = String(value);
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function exportCsv() {
  let csv = 'Résultats de la course\n\n';

  // --- Manche (courses) ---
  csv = 'Manches - Classements\n';
  const allResults = JSON.parse(localStorage.getItem('allResults') || '{}');
  const roundCount = parseInt(localStorage.getItem('roundCount') || '1');
  const raceCount = parseInt(localStorage.getItem('raceCount') || '1');

  for (let manche = 1; manche <= roundCount; manche++) {
    csv += `Manche ${manche}\n`;
    for (let race = 1; race <= raceCount; race++) {
      const key = `race${race}manche${manche}`;
      const classement = allResults[key];
      if (classement) {
        csv += `Race ${race},Joueur,Position\n`;
        classement.forEach((joueur, pos) => {
          csv += `${pos + 1},${escapeCsv(joueur)},${pos + 1}\n`;
        });
      } else {
        csv += `Race ${race},Aucun résultat\n`;
      }
    }
    csv += '\n';
  }

  // Scores généraux après manches
  const finalScores = JSON.parse(localStorage.getItem('finalScores') || '{}');
  csv += 'Résultats des Manches,Joueur,Score\n';
  Object.entries(finalScores)
    .sort((a, b) => a[1] - b[1])
    .forEach(([joueur, score], idx) => {
      csv += `${idx + 1},${escapeCsv(joueur)},${score}\n`;
    });
  csv += '\n';

  // --- Demi-finales ---
  csv += 'Demi-finales - Classements\n';
  const demiFinales = JSON.parse(localStorage.getItem('demiFinalesResult') || '{}');
  if (demiFinales.demi1 && demiFinales.demi1.length > 0) {
    csv += 'Demi-finale 1,Joueur,Position\n';
    demiFinales.demi1.forEach((joueur, i) => {
      csv += `${i + 1},${escapeCsv(joueur)},${i + 1}\n`;
    });
  } else {
    csv += 'Demi-finale 1,Aucun résultat\n';
  }
  csv += '\n';

  if (demiFinales.demi2 && demiFinales.demi2.length > 0) {
    csv += 'Demi-finale 2,Joueur,Position\n';
    demiFinales.demi2.forEach((joueur, i) => {
      csv += `${i + 1},${escapeCsv(joueur)},${i + 1}\n`;
    });
  } else {
    csv += 'Demi-finale 2,Aucun résultat\n';
  }
  csv += '\n';

  // --- Finales ---
  csv += 'Finales - Classements\n';

  const finaleKeys = Object.keys(finalesResult)
    .sort((a, b) => a.localeCompare(b));

  finaleKeys.forEach(key => {
    csv += `${key.toUpperCase()},Joueur,Position\n`;
    finalesResult[key].forEach((joueur, i) => {
      csv += `${i + 1},${escapeCsv(joueur)},${i + 1}\n`;
    });
    csv += '\n';
  });

  // Téléchargement CSV avec date du jour dans le nom
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // Mois de 01 à 12
  const dd = String(today.getDate()).padStart(2, '0');
  const filename = `course_${yyyy}-${mm}-${dd}.csv`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Lier le bouton Export CSV
const exportBtn = document.getElementById('exportBtn');
if (exportBtn) {
  exportBtn.addEventListener('click', exportCsv);
}
