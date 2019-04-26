/* eslint-disable no-shadow */
/* global io */
import { setUpKeyListeners } from './keypress';
const constants = require('../shared/constants');
import getMapFromState from './getMapFromState';
import { getUTF8Size } from './utils';

// initialize canvas
const canvas = document.getElementById('canvas');
canvas.width = constants.CANVAS_WIDTH;
canvas.height = constants.CANVAS_HEIGHT;
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

const startGame = name => {
  const socket = io();
  setUpKeyListeners(socket);

  // save this connection's id
  let id = '';
  socket.on(constants.MSG.CONNECT, () => {
    id = socket.id;
    console.log('connection id:', id);
  });

  // send the user's player name
  socket.emit(constants.MSG.SET_NAME, name);

  // receive and paint initial map sent by server

  let time = new Date().getTime();
  let deltas = [];
  let stateSizes = [];
  socket.on(constants.MSG.SEND_STATE, state => {
    let newTime = new Date().getTime();
    let delta = newTime - time;
    time = newTime;
    deltas.push(delta);
    stateSizes.push(getUTF8Size(state));
    if (deltas.length >= 20) {
      let avgLag = Math.floor(
        deltas.reduce((acc, d) => acc + d, 0) / deltas.length
      );

      let avgStateSize = Math.floor(
        stateSizes.reduce((acc, d) => acc + d, 0) / stateSizes.length
      );
      console.log(`LAG: ${avgLag}ms SIZE: ${avgStateSize} bytes`);

      stateSizes = [];
      deltas = [];
    }
    // console.log('state', state);
    const map = getMapFromState(state);
    renderMap(ctx, map);
  });
};

export default startGame;
