/* eslint-disable no-shadow */
import { setUpKeyListeners } from './keypress';

// set up socket
// eslint-disable-next-line no-undef
const socket = io();

// constants
const BOARD_WIDTH = 80;
const BOARD_HEIGHT = 60;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const CELL_SIZE = 10;

// initialize keypress module
setUpKeyListeners(socket);

// initialize canvas
const canvas = document.getElementById('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');
ctx.fillStyle = '#222222';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const renderMap = (ctx, map) => {
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[0].length; x += 1) {
      const currentCell = map[y][x];
      ctx.fillStyle = currentCell ? '#ffffff' : '#000000';
      // the +1 allow the bg to come through as grid lines
      ctx.fillRect(
        x * CELL_SIZE + 1,
        y * CELL_SIZE + 1,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    }
  }
};

// save this connection's id
let id = '';
socket.on('connect', () => {
  id = socket.id;
  console.log('connection id:', id);
});

// receive and paint initial map sent by server
socket.on('sync_map', map => {
  renderMap(ctx, map);
});
