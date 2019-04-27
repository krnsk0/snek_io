const constants = require('../shared/constants');

const emptyViewFactory = () => {
  return Array.from({ length: constants.MAP_HEIGHT }, () => {
    return Array.from({ length: constants.MAP_WIDTH }, () => ({
      type: 'empty'
    }));
  });
};

const getViewFromState = state => {
  // make an empty view
  const view = emptyViewFactory();

  // update the view
  state.players.forEach(player => {
    // render player head & name
    view[player.y][player.x].type = 'head';
    view[player.y][player.x].hue = player.hue;
    view[player.y][player.x].name = player.name;

    // render player tail
    player.tail.forEach(tailSegment => {
      view[tailSegment[1]][tailSegment[0]].type = 'tail';
      view[tailSegment[1]][tailSegment[0]].hue = player.hue;
    });
  });

  return view;
};

export default getViewFromState;
