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
      const currentCell = view[y][x];

      // the +1 allows the bg to come through as grid lines
      ctx.fillStyle = currentCell.color ? currentCell.color : `#000000`;
      ctx.fillRect(
        x * constants.CELL_SIZE_PX + 1,
        y * constants.CELL_SIZE_PX + 1,
        constants.CELL_SIZE_PX - 1,
        constants.CELL_SIZE_PX - 1
      );

      // draw name
      if (currentCell.name) {
        const name = currentCell.name;
        const length = name.length;
        ctx.fillStyle = 'white';
        ctx.fillText(
          currentCell.name,
          x * constants.CELL_SIZE_PX - 10 * (length / 2),
          y * constants.CELL_SIZE_PX - 10
        );
      }
    }
  }
};

export default renderView;
