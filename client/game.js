/* eslint-disable no-shadow */
/* global io */
import { setUpKeyListeners } from './keypress';
const constants = require('../shared/constants');
import getMapFromState from './getMapFromState';
import { getUTF8Size } from './utils';
import renderMap from './renderMap';

// initialize canvas
const canvas = document.getElementById('canvas');
canvas.width = constants.CANVAS_WIDTH;
canvas.height = constants.CANVAS_HEIGHT;
const ctx = canvas.getContext('2d');
ctx.font = '20px Courier';

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
      console.log(
        `%cLAG: %c${avgLag}ms%c SIZE: %c${avgStateSize} bytes`,
        '',
        'background-color: navy; color: white;',
        '',
        'background-color: darkred; color: white;'
      );

      stateSizes = [];
      deltas = [];
    }
    // console.log('state', state);
    const map = getMapFromState(state);
    renderMap(ctx, map);
  });
};

export default startGame;
