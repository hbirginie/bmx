const finales = JSON.parse(localStorage.getItem('finales') || '{}');
const extendedFinalesEnabled = JSON.parse(localStorage.getItem('extendedFinales') || 'false');

const finaleKeys = Object.keys(finales).sort((a, b) => {
  return b.localeCompare(a); // ordre inverse : E > D > ...
});

const baseFinales = ['finaleA'];
const finalesToDisplay = extendedFinalesEnabled ? finaleKeys : baseFinales;

const container = document.getElementById('finaleContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const validateBtn = document.getElementById('validateBtn');
const nav = document.getElementById('navigation');

let currentIndex = 0;

// Création des finales dynamiquement
finalesToDisplay.forEach((key, index) => {
  if (!finales[key]) return;

  const section = document.createElement('div');
  section.className = 'finale';
  section.id = `section-${key}`;
  section.style.display = index === 0 ? 'block' : 'none';

  const h2 = document.createElement('h2');
  h2.textContent = 'Finale ' + key.slice(-1).toUpperCase();

  const ul = document.createElement('ul');
  ul.className = 'draggable-list';
  ul.id = key;

  finales[key].forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    ul.appendChild(li);
  });

  section.appendChild(h2);
  section.appendChild(ul);
  container.appendChild(section);

  Sortable.create(ul, {
    animation: 150,
    ghostClass: 'dragging',
  });
});

// Afficher navigation si plus d'une finale
if (finalesToDisplay.length >= 1) {
  nav.style.display = 'flex';
}

// Mise à jour affichage
function updateDisplay() {
  finalesToDisplay.forEach((key, idx) => {
    const section = document.getElementById(`section-${key}`);
    section.style.display = idx === currentIndex ? 'block' : 'none';
  });

  prevBtn.style.display = currentIndex > 0 ? 'inline-block' : 'none';
  nextBtn.style.display = currentIndex < finalesToDisplay.length - 1 ? 'inline-block' : 'none';
  validateBtn.style.display = currentIndex === finalesToDisplay.length - 1 ? 'block' : 'none';
}

// Navigation
prevBtn.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateDisplay();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentIndex < finalesToDisplay.length - 1) {
    currentIndex++;
    updateDisplay();
  }
});

// Valider
validateBtn.addEventListener('click', () => {
  const results = {};
  finalesToDisplay.forEach(key => {
    const ul = document.getElementById(key);
    if (!ul) return;
    results[key] = [...ul.querySelectorAll('li')].map(li => li.textContent);
  });

  localStorage.setItem('finalesResult', JSON.stringify(results));
  window.location.href = 'resultats_finales.html';
});

updateDisplay();
