const constants = require('../shared/constants');

module.exports.randomCell = () => {
  const x = Math.floor(Math.random() * constants.BOARD_WIDTH);
  const y = Math.floor(Math.random() * constants.BOARD_HEIGHT);
  return [x, y];
};
