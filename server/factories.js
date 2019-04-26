const constants = require('../shared/constants');
const { randomCell } = require('./utils');

module.exports.mapFactory = () => {
  const emptyCellFactory = () => {
    return {
      color: 0,
      name: ''
    };
  };

  return Array.from({ length: constants.BOARD_HEIGHT }, () =>
    Array.from({ length: constants.BOARD_WIDTH }, () => emptyCellFactory())
  );
};

module.exports.gameStateFactory = () => {
  return {
    players: []
  };
};

module.exports.newPlayerFactory = id => {
  const [x, y] = randomCell();
  let player = {
    id,
    x,
    y,
    direction: false,
    hue: Math.floor(Math.random() * 360),
    tail: [],
    alive: true,
    justSpwaned: true,
    connected: true,
    name: ''
  };
  return player;
};
