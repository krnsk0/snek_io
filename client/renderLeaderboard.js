const renderLeaderboard = state => {
  // clear the table
  const leaderboardTBody = document.getElementById('leaderboard');
  Array.from(leaderboardTBody.children).forEach(child =>
    leaderboardTBody.removeChild(child)
  );

  // iterate players and build rows
  for (const [index, entry] of state.leaderboard.entries()) {
    let leaderboardRow = document.createElement('tr');
    let tdNumber = document.createElement('td');
    let tdName = document.createElement('td');
    let tdScore = document.createElement('td');
    tdNumber.className += 'leaderboard-number';
    tdNumber.innerHTML = index + 1;
    tdName.className += 'leaderboard-name';
    tdName.innerText = entry.name;

    tdName.style.color = `hsl(${entry.hue}, 100%, 50%)`;

    tdScore.className += 'leaderboard-score';
    tdScore.innerText = entry.score;
    leaderboardRow.appendChild(tdNumber);
    leaderboardRow.appendChild(tdName);
    leaderboardRow.appendChild(tdScore);
    leaderboardTBody.appendChild(leaderboardRow);
  }
};

export default renderLeaderboard;
