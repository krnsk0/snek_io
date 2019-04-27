const constants = require('../shared/constants');

let CELL_SIZE;
let CAMERA_WIDTH;
let CAMERA_HEIGHT;

window.addEventListener('resize', () => {
  CELL_SIZE = Math.floor(
    Math.min(window.innerHeight / 45, window.innerWidth / 80)
  );

  CAMERA_WIDTH = Math.min(Math.floor(window.innerWidth / CELL_SIZE), 80);
  CAMERA_HEIGHT = Math.min(Math.floor(window.innerHeight / CELL_SIZE), 45);
});

window.dispatchEvent(new Event('resize'));

export const calculateCameraWidth = () => {
  return CAMERA_WIDTH;
};
export const calculateCameraHeight = () => {
  return CAMERA_HEIGHT;
};
export const getCellSizePx = () => {
  return CELL_SIZE;
};
