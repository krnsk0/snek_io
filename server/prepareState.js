const clonedeep = require('lodash/clonedeep');

const prepareState = state => {
  let clone = clonedeep(state);

  let players = clone.players.map(player => {
    delete player.direction;
    return player;
  });

  return {
    players,
    leaderboard: clone.leaderboard
  };
};

module.exports = prepareState;
