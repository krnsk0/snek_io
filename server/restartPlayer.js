const { randomCell } = require('./utils');

const isCellOccupied = (cell, players) => {
  const [x, y] = [cell[0], cell[1]];
  for (let player of players) {
    // check for head collisions
    if (x === player.x && y === player.y) {
      return true;
    }
    // check for tail collisions
    for (let tailSegment of player.tail) {
      if (x === tailSegment[0] && y === tailSegment[1]) {
        return true;
      }
    }
    return false;
  }
};

module.exports.restartPlayer = (player, players) => {
  let cell = randomCell();
  while (isCellOccupied(cell, players)) {
    cell = randomCell();
  }
  player.x = cell[0];
  player.y = cell[1];
  player.tail = [];
  player.direction = false;
  player.score = 0;
  return player;
};
