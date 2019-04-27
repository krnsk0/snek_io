/* eslint-disable complexity */
const constants = require('../shared/constants');

const renderView = (ctx, view) => {
  ctx.fillStyle = '#222222';
  ctx.fillRect(
    0,
    0,
    constants.CAMERA_WIDTH * constants.CELL_SIZE_PX,
    constants.CAMERA_HEIGHT * constants.CELL_SIZE_PX
  );

  for (let y = 0; y < view.length; y += 1) {
    for (let x = 0; x < view[0].length; x += 1) {
      const cell = view[y][x];

      // set colors
      if (cell.type === 'head') {
        ctx.fillStyle = `hsl(${cell.hue}, 100%, 50%)`;
      } else if (cell.type === 'tail') {
        ctx.fillStyle = `hsl(${cell.hue}, 40%, 30%)`;
      } else if (cell.type === 'wall') {
        ctx.fillStyle = 'rgb(63, 63, 63)';
      } else if (cell.type === 'empty') {
        ctx.fillStyle = 'black';
      }

      // fill the cell depending on its type
      // the +1 allows the bg to come through as grid lines
      if (cell.type === 'wall') {
        ctx.fillRect(
          x * constants.CELL_SIZE_PX,
          y * constants.CELL_SIZE_PX,
          constants.CELL_SIZE_PX,
          constants.CELL_SIZE_PX
        );
      } else {
        ctx.fillRect(
          x * constants.CELL_SIZE_PX + 1,
          y * constants.CELL_SIZE_PX + 1,
          constants.CELL_SIZE_PX - 1,
          constants.CELL_SIZE_PX - 1
        );
      }

      // draw name
      if (cell.name) {
        const name = cell.name;
        const length = name.length;
        ctx.fillStyle = 'white';
        ctx.fillText(
          cell.name,
          x * constants.CELL_SIZE_PX - 10 * (length / 2),
          y * constants.CELL_SIZE_PX - 10
        );
      }
    }
  }
};

export default renderView;
