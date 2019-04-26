const constants = require('../shared/constants');

const emptyMapFactory = () => {
  const emptyCellFactory = () => {
    return {
      color: 0,
      name: ''
    };
  };

  return Array.from({ length: constants.BOARD_HEIGHT }, () =>
    Array.from({ length: constants.BOARD_WIDTH }, () => emptyCellFactory())
  );
};

const getMapFromState = state => {
  // make an empty map
  const map = emptyMapFactory();

  // update the map
  state.players.forEach(player => {
    // for living players...
    if (player.alive) {
      // render player heads
      map[player.y][player.x].color = `hsl(${player.hue}, 100%, 50%)`;

      // render player name
      map[player.y][player.x].name = player.name;

      // render player tail
      player.tail.forEach(tailSegment => {
        map[tailSegment[1]][tailSegment[0]].color = `hsl(${
          player.hue
        }, 40%, 30%)`;
      });
    }
  });

  return map;
};

export default getMapFromState;
