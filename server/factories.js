/* eslint-disable no-shadow */
const { randomCell } = require('./utils');
const constants = require('../shared/constants');

module.exports.gameStateFactory = () => {
  return {
    players: [],
    kill: [],
    leave: [],
    food: [],
    make: [],
    eat: []
  };
};

module.exports.newPlayerFactory = id => {
  const [x, y] = randomCell();
  let player = {
    id,
    x,
    y,
    direction: false,
    nextDirection: false,
    hue: Math.floor(Math.random() * 360),
    tail: [],
    name: '',
    score: 0,
    length: constants.INITIAL_SNAKE_LENGTH
  };
  return player;
};

module.exports.foodFactory = (x, y) => {
  return { x, y };
};
