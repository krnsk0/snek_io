const constants = require('../shared/constants');

module.exports.randomCell = () => {
  const x = Math.floor(Math.random() * constants.MAP_WIDTH);
  const y = Math.floor(Math.random() * constants.MAP_HEIGHT);
  return [x, y];
};
