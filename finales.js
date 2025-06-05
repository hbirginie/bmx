// Récupération des finales dans le localStorage
const finales = JSON.parse(localStorage.getItem('finales') || '{}');

// Option consolantes (affiche la finale B ou pas)
const extendedFinalesEnabled = JSON.parse(localStorage.getItem('extendedFinales') || 'false');

// Conteneur principal où on va injecter les finales
const container = document.body;

// Base : finale A uniquement
const baseFinales = ['finaleA'];
const extraFinales = ['finaleB', 'finaleC', 'finaleD', 'finaleE'];
const finalesToDisplay = extendedFinalesEnabled
  ? [...baseFinales, ...extraFinales]
  : baseFinales;

// Fonction pour créer une section finale complète
function createFinaleSection(finaleKey) {
  if (!finales[finaleKey]) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'finale';

  const h2 = document.createElement('h2');
  h2.textContent = 'Finale ' + finaleKey.slice(-1).toUpperCase();

  const ul = document.createElement('ul');
  ul.className = 'draggable-list';
  ul.id = finaleKey;

  wrapper.appendChild(h2);
  wrapper.appendChild(ul);

  const validateBtn = document.getElementById('validateBtn');
  container.insertBefore(wrapper, validateBtn);

  finales[finaleKey].forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    ul.appendChild(li);
  });
}

// Crée les sections de finales
finalesToDisplay.forEach(createFinaleSection);

// Active le drag and drop
finalesToDisplay.forEach(finaleKey => {
  const ul = document.getElementById(finaleKey);
  if (!ul) return;

  Sortable.create(ul, {
    animation: 150,
    ghostClass: 'dragging',
    dragClass: 'dragging',
  });
});

// Sauvegarde des résultats à la validation
document.getElementById('validateBtn').addEventListener('click', () => {
  const results = {};
  finalesToDisplay.forEach(finaleKey => {
    const ul = document.getElementById(finaleKey);
    if (!ul) return;
    results[finaleKey] = [...ul.querySelectorAll('li')].map(li => li.textContent);
  });

  localStorage.setItem('finalesResult', JSON.stringify(results));
  window.location.href = 'resultats_finales.html';
});
