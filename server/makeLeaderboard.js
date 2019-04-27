const { leaderBoardEntryFactory } = require('./factories');

const makeLeaderboard = state => {
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
  state.leaderboard = sorted.slice(0, 10);

  return state;
};

module.exports = makeLeaderboard;
