const scores = JSON.parse(localStorage.getItem('demiFinalesScores') || '{}');
const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);

const finaleA = sorted.slice(0, 8).map(([nom]) => nom);
const finaleB = sorted.slice(8).map(([nom]) => nom);

const finaleAList = document.getElementById('finaleA');
const finaleBList = document.getElementById('finaleB');

function createDraggableList(listElement, participants) {
  participants.forEach(name => {
    const li = document.createElement('li');
    li.textContent = name;
    li.draggable = true;
    listElement.appendChild(li);
  });

  let dragSrc = null;

  listElement.addEventListener('dragstart', e => {
    dragSrc = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  });

  listElement.addEventListener('dragover', e => {
    e.preventDefault();
    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(listElement, e.clientY);
    if (!dragging) return;
    if (afterElement == null) {
      listElement.appendChild(dragging);
    } else {
      listElement.insertBefore(dragging, afterElement);
    }
  });

  listElement.addEventListener('dragend', e => {
    e.target.classList.remove('dragging');
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    return offset < 0 && offset > closest.offset
      ? { offset, element: child }
      : closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element || null;
}

createDraggableList(finaleAList, finaleA);
createDraggableList(finaleBList, finaleB);

document.getElementById('validateBtn').addEventListener('click', () => {
  const finaleAResult = [...finaleAList.querySelectorAll('li')].map(li => li.textContent);
  const finaleBResult = [...finaleBList.querySelectorAll('li')].map(li => li.textContent);

  localStorage.setItem('finalesResult', JSON.stringify({
    finaleA: finaleAResult,
    finaleB: finaleBResult
  }));

  window.location.href = 'resultats_finales.html';
});
