const constants = require('../shared/constants');

const decompressState = state => {
  return {
    players: state[constants.KEYS.PLAYERS],
    kill: state[constants.KEYS.KILL],
    leave: state[constants.KEYS.LEAVE],
    food: state[constants.KEYS.FOOD],
    make: state[constants.KEYS.MAKE],
    eat: state[constants.KEYS.EAT]
  };
};

export default decompressState;
