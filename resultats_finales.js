const finalesResult = JSON.parse(localStorage.getItem('finalesResult') || '{}');
    const finaleA = finalesResult.finaleA || [];

    document.getElementById('firstPlace').textContent = finaleA[0] || "N/A";
    document.getElementById('secondPlace').textContent = finaleA[1] || "N/A";
    document.getElementById('thirdPlace').textContent = finaleA[2] || "N/A";