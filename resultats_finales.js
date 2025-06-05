const finalesResult = JSON.parse(localStorage.getItem('finalesResult') || '{}');
const finaleA = finalesResult.finaleA || [];

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
    for (const [finaleName, players] of Object.entries(finalesResult)) {
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
    }
    }
});