const finalesResult = JSON.parse(localStorage.getItem('finalesResult') || '{}');
const finaleA = finalesResult.finaleA || [];

document.getElementById('firstPlace').textContent = finaleA[0] || "N/A";
document.getElementById('secondPlace').textContent = finaleA[1] || "N/A";
document.getElementById('thirdPlace').textContent = finaleA[2] || "N/A";

const showBtn = document.getElementById('showAllBtn');
const hideBtn = document.getElementById('hideAllBtn');
const container = document.getElementById('allResultsContainer');

showBtn.addEventListener('click', () => {
  container.innerHTML = '';

  const finalesResult = JSON.parse(localStorage.getItem('finalesResult') || '{}');
  const finaleKeys = Object.keys(finalesResult).sort(); // finaleA, finaleB, etc.

  finaleKeys.forEach(key => {
    const div = document.createElement('div');
    div.className = 'finale-section';

    const title = document.createElement('h2');
    title.textContent = 'Finale ' + key.slice(-1).toUpperCase();
    div.appendChild(title);

    const ol = document.createElement('ol');
    finalesResult[key].forEach(nom => {
      const li = document.createElement('li');
      li.textContent = nom;
      ol.appendChild(li);
    });

    div.appendChild(ol);
    container.appendChild(div);
  });

  container.style.display = 'block';
  showBtn.style.display = 'none';
  hideBtn.style.display = 'inline-block';
});

hideBtn.addEventListener('click', () => {
  container.style.display = 'none';
  hideBtn.style.display = 'none';
  showBtn.style.display = 'inline-block';
});