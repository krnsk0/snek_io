const constants = require('../shared/constants');

const renderView = (ctx, view) => {
  ctx.fillStyle = '#222222';
  ctx.fillRect(0, 0, constants.CANVAS_WIDTH, constants.CANVAS_HEIGHT);

  for (let y = 0; y < view.length; y += 1) {
    for (let x = 0; x < view[0].length; x += 1) {
      const currentCell = view[y][x];

      // the +1 allows the bg to come through as grid lines
      ctx.fillStyle = currentCell.color ? currentCell.color : `#000000`;
      ctx.fillRect(
        x * constants.CELL_SIZE + 1,
        y * constants.CELL_SIZE + 1,
        constants.CELL_SIZE - 1,
        constants.CELL_SIZE - 1
      );

      // draw name
      if (currentCell.name) {
        const name = currentCell.name;
        const length = name.length;
        ctx.fillStyle = 'white';
        ctx.fillText(
          currentCell.name,
          x * constants.CELL_SIZE - 10 * (length / 2),
          y * constants.CELL_SIZE - 10
        );
      }
    }
  }
};

export default renderView;
