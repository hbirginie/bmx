// Récupération des finales dans le localStorage
const finales = JSON.parse(localStorage.getItem('finales') || '{}');

// Récupération de l'option (boolean, false par défaut)
const extendedFinalesEnabled = JSON.parse(localStorage.getItem('extendedFinales') || 'false');

// Conteneur principal où on va injecter les finales
const container = document.body;  // ou un élément précis si tu préfères

// Liste des finales à afficher (toujours A et B, puis C, D, E si option activée)
const baseFinales = ['finaleA', 'finaleB'];
const extraFinales = ['finaleC', 'finaleD', 'finaleE'];
const finalesToDisplay = extendedFinalesEnabled
  ? [...baseFinales, ...extraFinales]
  : baseFinales;

// Fonction pour créer une section finale complète
function createFinaleSection(finaleKey) {
  if (!finales[finaleKey]) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'finale';
  wrapper.style.minWidth = '200px';

  const h2 = document.createElement('h2');
  // Met "Finale" avec majuscule seulement au début + lettre finale majuscule (ex: Finale A)
  h2.textContent = 'Finale ' + finaleKey.slice(-1).toUpperCase();

  const ul = document.createElement('ul');
  ul.className = 'draggable-list';
  ul.id = finaleKey;

  wrapper.appendChild(h2);
  wrapper.appendChild(ul);

  // Insert avant le bouton valider (présumé existant dans la page)
  const validateBtn = document.getElementById('validateBtn');
  container.insertBefore(wrapper, validateBtn);

  // Remplit la liste avec les participants
  finales[finaleKey].forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    ul.appendChild(li);
  });
}

// Crée toutes les sections finales visibles
finalesToDisplay.forEach(createFinaleSection);

// Initialise Sortable.js sur chaque liste de finale
finalesToDisplay.forEach(finaleKey => {
  const ul = document.getElementById(finaleKey);
  if (!ul) return;

  Sortable.create(ul, {
    animation: 150,
    ghostClass: 'dragging',
    dragClass: 'dragging',
  });
});

// Bouton valider pour sauvegarder les résultats
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
