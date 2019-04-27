const constants = require('../shared/constants');

let CELL_SIZE;
let CAMERA_WIDTH;
let CAMERA_HEIGHT;
let BASELINE_HEIGHT_CELLS = 45;
let BASELINE_WIDTH_CELLS = Math.ceil(BASELINE_HEIGHT_CELLS * constants.ZOOM);
let ZOOM_ADJUSTMENT = 0.6;

// changes stuff on window resize event
window.addEventListener('resize', () => {
  CELL_SIZE = Math.floor(
    Math.max(
      window.innerHeight / BASELINE_HEIGHT_CELLS,
      window.innerWidth / BASELINE_WIDTH_CELLS
    ) * ZOOM_ADJUSTMENT
  );

  CAMERA_WIDTH =
    Math.min(Math.floor(window.innerWidth / CELL_SIZE), BASELINE_WIDTH_CELLS) *
    (1 / ZOOM_ADJUSTMENT);
  CAMERA_HEIGHT = Math.min(
    Math.floor(window.innerHeight / CELL_SIZE),
    BASELINE_HEIGHT_CELLS * (1 / ZOOM_ADJUSTMENT)
  );
});

// initialize on page load
window.dispatchEvent(new Event('resize'));

// closures to allow access to these vars
export const calculateCameraWidth = () => {
  return CAMERA_WIDTH;
};
export const calculateCameraHeight = () => {
  return CAMERA_HEIGHT;
};
export const getCellSizePx = () => {
  return CELL_SIZE;
};
