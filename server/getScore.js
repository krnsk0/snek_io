const constants = require('../shared/constants');
let counter = 0;

const getScores = state => {
  counter += 1;
  if (counter === constants.SERVER_TICKS_PER_SECOND) {
    state.players.forEach(player => {
      player.score = player.score + player.length;
    });
    counter = 0;
  }
  return state;
};

module.exports = getScores;
