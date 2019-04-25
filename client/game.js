/* global io */
import { setUpKeyListeners } from './keypress';

// constants
const BOARD_WIDTH = 80;
const BOARD_HEIGHT = 60;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const CELL_SIZE = 10;

// initialize canvas
const canvas = document.getElementById('canvas');
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');
ctx.font = '20px Courier';

// render
const renderMap = (ctx, map) => {
  ctx.fillStyle = '#222222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[0].length; x += 1) {
      const currentCell = map[y][x];

      // the +1 allows the bg to come through as grid lines
      ctx.fillStyle = currentCell.color ? currentCell.color : `#000000`;
      ctx.fillRect(
        x * CELL_SIZE + 1,
        y * CELL_SIZE + 1,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );

      // draw name

      if (currentCell.name) {
        const name = currentCell.name;
        const length = name.length;
        ctx.fillStyle = 'white';
        ctx.fillText(
          currentCell.name,
          x * CELL_SIZE - 10 * (length / 2),
          y * CELL_SIZE - 10
        );
      }
    }
  }
};

const startGame = name => {
  const socket = io();
  setUpKeyListeners(socket);

  // save this connection's id
  let id = '';
  socket.on('connect', () => {
    id = socket.id;
    console.log('connection id:', id);
  });

  // send the user's player name
  socket.emit('set_name', name);

  // receive and paint initial map sent by server

  let time = new Date().getTime();
  let deltas = [];
  socket.on('sync_map', map => {
    let newTime = new Date().getTime();
    let delta = newTime - time;
    time = newTime;
    deltas.push(delta);
    if (deltas.length >= 20) {
      let avg = Math.floor(
        deltas.reduce((acc, d) => acc + d, 0) / deltas.length
      );
      console.log('avg lag:', avg);
      deltas = [];
    }
    renderMap(ctx, map);
  });
};

export default startGame;
