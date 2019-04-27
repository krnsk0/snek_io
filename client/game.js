/* eslint-disable no-shadow */
/* global io */
const constants = require('../shared/constants');
import { setUpKeyListeners } from './keypress';
import getViewFromState from './getViewFromState';
import { printKBPS } from './utils';
import renderView from './renderView';

// initialize canvas
const canvas = document.getElementById('canvas');

// passed up to the html form handler
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
    // get the current player's x and y
    const clientPlayer = state.players.find(player => player.id === socket.id);
    const cameraX = clientPlayer.x;
    const cameraY = clientPlayer.y;

    // build a view from the state
    const view = getViewFromState(state, cameraX, cameraY);

    // render the view
    renderView(canvas, view);
  });
};

export default startGame;
