const { randomCell } = require('./utils');
const isCellOccupied = require('./isCellOccupied');
const { foodFactory } = require('./factories');

const makeFood = (state, addToEatList = true) => {
  let cell = randomCell();
  while (isCellOccupied(cell, state)) {
    cell = randomCell();
  }
  let food = foodFactory(...cell);
  state.food.push(food);
  if (addToEatList) {
    state.make.push(food);
  }

  return state;
};

module.exports = makeFood;
