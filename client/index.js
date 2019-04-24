/* eslint-disable no-shadow */
import { direction } from './keypress';

// constants
const CELL_SIZE = 10;
const BOARD_WIDTH = 80;
const BOARD_HEIGHT = 60;

// initialize canvas
const canvas = document.getElementById('canvas');
canvas.width = CELL_SIZE * BOARD_WIDTH;
canvas.height = CELL_SIZE * BOARD_HEIGHT;
canvas.style.border = '2px solid black';
const context = canvas.getContext('2d');

// create an empty map
const mapFactory = () => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => Math.floor(Math.random() * 2))
  );
};
const map = mapFactory();

// draw the map
const renderMap = (context, map) => {
  for (let y = 0; y < BOARD_HEIGHT; y += 1) {
    for (let x = 0; x < BOARD_WIDTH; x += 1) {
      const currentCell = map[y][x];
      context.fillStyle = currentCell ? '#000000' : '#ffffff';
      context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
};
renderMap(context, map);
