/* eslint-disable no-shadow */
/* global io */
const constants = require('../shared/constants');
import { setUpKeyListeners } from './keypress';
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

  // turn on the key listeners
  setUpKeyListeners(socket);

  // save this connection's id
  let id = '';
  socket.on(constants.MSG.CONNECT, () => {
    id = socket.id;
    console.log('connection id:', id);
  });

  // send the user's player name
  socket.emit(constants.MSG.SET_NAME, name);

  // listen for state updates from the server
  socket.on(constants.MSG.SEND_STATE, state => {
    // build a map from the state
    const map = getMapFromState(state);

    // render the map
    renderMap(ctx, map);
  });

  // debugging stuff
  let time = new Date().getTime();
  let deltas = [];
  let stateSizes = [];
  socket.on(constants.MSG.SEND_STATE, state => {
    let newTime = new Date().getTime();
    let delta = newTime - time;
    time = newTime;
    deltas.push(delta);
    stateSizes.push(getUTF8Size(state));
    // every second print some stuff
    if (deltas.length >= constants.SERVER_TICKS_PER_SECOND) {
      let avgLag = Math.floor(
        deltas.reduce((acc, d) => acc + d, 0) / deltas.length
      );

      let stateKilobytesPerSecond = (
        stateSizes.reduce((acc, d) => acc + d, 0) / 1000
      ).toFixed(2);
      console.log(
        `%cAVG DELTA TIME: %c${avgLag}ms%c \nSIZE: %c${stateKilobytesPerSecond} kbps`,
        '',
        'background-color: navy; color: white;',
        '',
        'background-color: darkred; color: white;'
      );
      stateSizes = [];
      deltas = [];
    }
  });
};

export default startGame;
