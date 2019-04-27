/* eslint-disable no-shadow */
const { randomCell } = require('./utils');

module.exports.gameStateFactory = () => {
  return {
    players: [],
    leaderboard: []
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

module.exports.leaderBoardEntryFactory = (name, hue, score) => {
  return {
    name,
    hue,
    score
  };
};
