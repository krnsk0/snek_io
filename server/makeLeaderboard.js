const { leaderBoardEntryFactory } = require('./factories');

const makeLeaderboard = state => {
  // sort it
  let sorted = state.players
    .slice()
    .sort((a, b) => Number(a.score) > Number(b.score));

  // trim to ten
  let trimmed = sorted.slice(0, 10);

  // create entries
  state.leaderboard = trimmed.map(player =>
    leaderBoardEntryFactory(player.name, player.hue, player.score)
  );

  return state;
};

module.exports = makeLeaderboard;
