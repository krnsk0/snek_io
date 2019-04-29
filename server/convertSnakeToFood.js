const constants = require('../shared/constants');
const makeFood = require('./makeFood');

const convertSnakeToFood = (state, player) => {
  const killedPlayer = state.players.find(p => p.id === player.id);

  // produce at most this much food
  let foodToProduce = Math.floor(
    (killedPlayer.length - 10) / constants.FOOD_NUTRITION
  );

  killedPlayer.tail.forEach(block => {
    let chance = Math.floor(Math.random() * constants.FOOD_NUTRITION);
    if (chance === 0 && foodToProduce > 0) {
      foodToProduce -= 1;
      makeFood(state, true, block[0], block[1]);
    }
  });

  // if we didn't produce enough food, make some food in random locations
  if (foodToProduce > 0) {
    makeFood(state, true);
  }

  return state;
};

module.exports = convertSnakeToFood;
