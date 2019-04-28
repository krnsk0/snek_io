const leaderBoardEntryFactory = (name, hue, score) => {
  return {
    name,
    hue,
    score
  };
};

const renderLeaderboard = state => {
  // necessary?
  let players = state.players.slice();

  // create entries
  let entries = players.map(player =>
    leaderBoardEntryFactory(player.name, player.hue, player.score)
  );

  // sort it
  let sorted = entries.sort((a, b) => {
    return b.score - a.score;
  });

  // trim to ten
  let leaderboard = sorted.slice(0, 10);

  // clear the table
  const leaderboardTBody = document.getElementById('leaderboard');
  Array.from(leaderboardTBody.children).forEach(child =>
    leaderboardTBody.removeChild(child)
  );

  // iterate players and build rows
  for (const [index, entry] of leaderboard.entries()) {
    let leaderboardRow = document.createElement('tr');
    leaderboardRow.style.backgroundColor = `hsl(${entry.hue}, 60%, 50%, 50%)`;
    let tdNumber = document.createElement('td');
    let tdName = document.createElement('td');
    let tdScore = document.createElement('td');
    tdNumber.className += 'leaderboard-number';
    tdNumber.innerHTML = index + 1;
    tdName.className += 'leaderboard-name';
    tdName.innerText = entry.name;
    tdScore.className += 'leaderboard-score';
    tdScore.innerText = entry.score;
    leaderboardRow.appendChild(tdNumber);
    leaderboardRow.appendChild(tdName);
    leaderboardRow.appendChild(tdScore);
    leaderboardTBody.appendChild(leaderboardRow);
  }
};

export default renderLeaderboard;
