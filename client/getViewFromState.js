const constants = require('../shared/constants');
import { calculateCameraWidth, calculateCameraHeight } from './calculateCamera';

const emptyViewFactory = () => {
  return Array.from({ length: constants.MAP_HEIGHT }, () => {
    return Array.from({ length: constants.MAP_WIDTH }, () => ({
      type: 'empty'
    }));
  });
};

const getViewFromState = (state, cameraX, cameraY) => {
  // make an empty view
  const view = emptyViewFactory();

  // set up viewport boundaries
  const minX = cameraX - Math.floor(calculateCameraWidth() / 2);
  const minY = cameraY - Math.floor(calculateCameraHeight() / 2);
  const maxX = cameraX + Math.floor(calculateCameraWidth() / 2);
  const maxY = cameraY + Math.floor(calculateCameraHeight() / 2);

  // function for boundary checking with these in scope
  const inBounds = (x, y) => {
    return x >= minX && y >= minY && x < maxX && y < maxY;
  };

  // add in walls
  for (const [y, row] of view.entries()) {
    for (const [x, cell] of row.entries()) {
      if (
        minX + x < 0 ||
        minY + y < 0 ||
        minX + x > constants.MAP_WIDTH ||
        minY + y > constants.MAP_HEIGHT
      ) {
        cell.type = 'wall';
      }
    }
  }

  // update the view
  state.players.forEach(player => {
    // render player head & name if in range
    if (inBounds(player.x, player.y)) {
      view[player.y - minY][player.x - minX].type = 'head';
      view[player.y - minY][player.x - minX].hue = player.hue;
      view[player.y - minY][player.x - minX].name = player.name;
    }

    // render player tail segments if in bounds
    player.tail.forEach(tailSegment => {
      if (inBounds(tailSegment[0], tailSegment[1])) {
        view[tailSegment[1] - minY][tailSegment[0] - minX].type = 'tail';
        view[tailSegment[1] - minY][tailSegment[0] - minX].hue = player.hue;
      }
    });
  });

  // render food
  state.food.forEach(food => {
    if (inBounds(food.x, food.y)) {
      view[food.y - minY][food.x - minX].type = 'food';
    }
  });

  return view;
};

export default getViewFromState;
