const { randomCell } = require('./utils');
const isCellOccupied = require('./isCellOccupied');
const { foodFactory } = require('./factories');

const makeFood = (state, addToEatList = true, x, y) => {
  // if no x, y passed in, randomize
  let cell = randomCell();
  if (x === undefined && y === undefined) {
    while (isCellOccupied(cell, state)) {
      cell = randomCell();
    }
  } else {
    cell = [x, y];
  }

  let food = foodFactory(...cell);
  state.food.push(food);
  if (addToEatList) {
    state.make.push(food);
  }

  return state;
};

module.exports = makeFood;
