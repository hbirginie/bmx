document.addEventListener('DOMContentLoaded', () => {
    const players = JSON.parse(localStorage.getItem('players') || '[]');
    const participantCount = players.length;

    const participantCountElement = document.getElementById('participantCount');
    participantCountElement.innerHTML = `<strong>${participantCount}</strong> pilotes sont inscrits`;

    let selectedRace = null;
    let selectedRound = null;

    const raceButtons = document.querySelectorAll('.race-btn');
    const roundButtons = document.querySelectorAll('.round-btn');

    raceButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            raceButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedRace = btn.dataset.value;
        });
    });

    roundButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            roundButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedRound = btn.dataset.value;
        });
    });

    const consolantesToggle = document.getElementById('consolantesToggle');
    const savedConsolantes = localStorage.getItem('consolantes') === 'true';
    consolantesToggle.checked = savedConsolantes;

    consolantesToggle.addEventListener('change', () => {
        const isChecked = consolantesToggle.checked;
        localStorage.setItem('consolantes', isChecked);
    });

    const startBtn = document.getElementById('startBtn');

    startBtn.onclick = () => {
        if (!selectedRace) {
            alert("Choisis un nombre de races avant de continuer.");
            return;
        }
        if (!selectedRound) {
            alert("Choisis un nombre de manches avant de continuer.");
            return;
        }

        localStorage.setItem('raceCount', selectedRace);
        localStorage.setItem('roundCount', selectedRound);

        window.location.href = 'manches.html';
    };
});
