/* eslint-disable complexity */
const isCellOccupied = (cell, state) => {
  const [x, y] = [cell[0], cell[1]];
  for (let player of state.players) {
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

    // check for food collitions
    for (let food of state.food) {
      if (food[0] === x && food[1] === y) {
        return true;
      }
    }

    return false;
  }
};
module.exports = isCellOccupied;
