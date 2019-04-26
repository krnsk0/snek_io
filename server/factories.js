const { randomCell } = require('./utils');

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
    justSpwaned: true,
    name: ''
  };
  return player;
};
