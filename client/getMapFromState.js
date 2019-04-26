const constants = require('../shared/constants');

const emptyMapCellFactory = () => {
  return {
    color: 0,
    name: ''
  };
};

const emptyMapFactory = () => {
  return Array.from({ length: constants.BOARD_HEIGHT }, () =>
    Array.from({ length: constants.BOARD_WIDTH }, () => emptyMapCellFactory())
  );
};

const getMapFromState = state => {
  // make an empty map
  const map = emptyMapFactory();

  // update the map
  state.players.forEach(player => {
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
  });

  return map;
};

export default getMapFromState;
