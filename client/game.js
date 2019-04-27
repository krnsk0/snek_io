/* eslint-disable no-shadow */
/* global io */
const constants = require('../shared/constants');
import { setUpKeyListeners } from './keypress';
import getViewFromState from './getViewFromState';
import { printKBPS } from './utils';
import renderView from './renderView';

// initialize canvas
const canvas = document.getElementById('canvas');
canvas.width = constants.CAMERA_WIDTH * constants.CELL_SIZE_PX;
canvas.height = constants.CAMERA_HEIGHT * constants.CELL_SIZE_PX;
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

  // print kbps on state updates
  window.kbps = false;
  console.log("set 'window.kbps = true' to print data rate");
  printKBPS(socket);

  // listen for state updates from the server
  socket.on(constants.MSG.SEND_STATE, state => {
    // build a view from the state
    const view = getViewFromState(state);

    // render the view
    renderView(ctx, view);
  });
};

export default startGame;
