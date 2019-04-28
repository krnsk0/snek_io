const { cloneDeep } = require('lodash');

const compressState = state => {
  // copy the state
  let clone = cloneDeep(state);

  clone.players = clone.players.map(player => {
    // delete the direction key, not needed on clinet side
    delete player.direction;

    // only send the last tail block
    if (player.tail.length) {
      player.tail = [player.tail.pop()];
    }

    return player;
  });

  return clone;
};

module.exports = compressState;
