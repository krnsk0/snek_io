/* eslint-disable complexity */
import {
  calculateCameraWidth,
  calculateCameraHeight,
  getCellSizePx
} from './calculateCamera';

const renderView = (canvas, view) => {
  // allow canvas resizing
  canvas.width = calculateCameraWidth() * getCellSizePx();
  canvas.height = calculateCameraHeight() * getCellSizePx();
  const ctx = canvas.getContext('2d');
  ctx.font = '20px Courier';

  // clear the canvas
  ctx.fillStyle = '#222222';
  ctx.fillRect(
    0,
    0,
    calculateCameraWidth() * getCellSizePx(),
    calculateCameraHeight() * getCellSizePx()
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
          x * getCellSizePx(),
          y * getCellSizePx(),
          getCellSizePx(),
          getCellSizePx()
        );
      } else {
        ctx.fillRect(
          x * getCellSizePx() + 1,
          y * getCellSizePx() + 1,
          getCellSizePx() - 1,
          getCellSizePx() - 1
        );
      }

      // draw name
      if (cell.name) {
        const name = cell.name;
        const length = name.length;
        ctx.fillStyle = 'white';
        ctx.fillText(
          cell.name,
          x * getCellSizePx() - 10 * (length / 2),
          y * getCellSizePx() - 10
        );
      }
    }
  }
};

export default renderView;
