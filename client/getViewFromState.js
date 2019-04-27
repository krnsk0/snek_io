const constants = require('../shared/constants');

const emptyViewCellFactory = () => {
  return {
    color: 0,
    name: ''
  };
};

const emptyViewFactory = () => {
  return Array.from({ length: constants.MAP_HEIGHT }, () =>
    Array.from({ length: constants.MAP_WIDTH }, () => emptyViewCellFactory())
  );
};

const getViewFromState = state => {
  // make an empty view
  const view = emptyViewFactory();

  // update the view
  state.players.forEach(player => {
    // render player heads
    view[player.y][player.x].color = `hsl(${player.hue}, 100%, 50%)`;

    // render player name
    view[player.y][player.x].name = player.name;

    // render player tail
    player.tail.forEach(tailSegment => {
      view[tailSegment[1]][tailSegment[0]].color = `hsl(${
        player.hue
      }, 40%, 30%)`;
    });
  });

  return view;
};

export default getViewFromState;
