/* eslint-disable complexity */
const { randomCell } = require('./utils');
const isCellOccupied = require('./isCellOccupied');
const constants = require('../shared/constants');

module.exports.restartPlayer = (player, state) => {
  let cell = randomCell();
  while (isCellOccupied(cell, state)) {
    cell = randomCell();
  }
  player.x = cell[0];
  player.y = cell[1];
  player.tail = [];
  player.direction = false;
  player.score = Math.floor(player.score / 10);
  player.length = constants.INITIAL_SNAKE_LENGTH;
  return player;
};
