/* eslint-disable no-shadow */
const { randomCell } = require('./utils');

module.exports.gameStateFactory = () => {
  return {
    players: [],
    kill: [],
    leave: []
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
    name: '',
    score: 0
  };
  return player;
};
