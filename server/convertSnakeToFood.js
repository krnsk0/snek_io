const constants = require('../shared/constants');
const makeFood = require('./makeFood');

const convertSnakeToFood = (state, player) => {
  const killedPlayer = state.players.find(p => p.id === player.id);

  let foodToProduce = Math.floor((killedPlayer.length - 10) / 5);

  killedPlayer.tail.forEach(block => {
    let chance = Math.floor(Math.random() * 5);
    if (chance === 0) {
      foodToProduce -= 1;
      makeFood(state, true, block[0], block[1]);
    }
  });

  if (foodToProduce > 0) {
    makeFood(state, true);
  }

  return state;
};

module.exports = convertSnakeToFood;
