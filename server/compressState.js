const { cloneDeep } = require('lodash');
const constants = require('../shared/constants');

const compressState = state => {
  // copy the state
  let clone = cloneDeep(state);

  clone.players = clone.players.map(player => {
    // delete the direction key, not needed on client side
    delete player.direction;

    // only send the last tail block
    if (player.tail.length) {
      player.tail = [player.tail.pop()];
    }

    return player;
  });

  // delete the food key
  delete clone.food;
  return {
    [constants.KEYS.PLAYERS]: clone.players,
    [constants.KEYS.KILL]: clone.kill,
    [constants.KEYS.LEAVE]: clone.leave,
    [constants.KEYS.FOOD]: clone.food,
    [constants.KEYS.MAKE]: clone.make,
    [constants.KEYS.EAT]: clone.eat
  };
};

module.exports = compressState;
