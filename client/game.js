/* eslint-disable no-shadow */
/* global io */
const constants = require('../shared/constants');
import { setUpKeyListeners } from './keypress';
import getViewFromState from './getViewFromState';
import { printKBPS } from './utils';
import renderView from './renderView';
import renderLeaderboard from './renderLeaderboard';

// initialize canvas
const canvas = document.getElementById('canvas');

// set up a local state store
let stateStore;

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
  // socket.emit(constants.MSG.SET_NAME, name);

  // send name on request
  socket.on(constants.MSG.GET_NAME, () => {
    socket.emit(constants.MSG.SET_NAME, name);
  });

  // print kbps on state updates
  window.kbps = false;
  console.log("set 'window.kbps = true' to print data rate");
  printKBPS(socket);

  // store the initial state
  socket.on(constants.MSG.SEND_INITIAL_STATE, state => {
    stateStore = state;
  });

  // listen for state updates from the server
  socket.on(constants.MSG.SEND_STATE, state => {
    // handle disconnects
    state.leave.forEach(leaveId => {
      // erase player from store
      stateStore.players = stateStore.players.filter(
        player => player.id !== leaveId
      );
    });

    // handle kill/restarts
    state.kill.forEach(killId => {
      // erase tails
      let playerToKill = stateStore.players.find(
        player => player.id === killId
      );
      playerToKill.tail = [];
    });

    // if any players in incoming state are new, add them
    let storedPlayerIds = stateStore.players.map(player => player.id);
    state.players.forEach(player => {
      if (!storedPlayerIds.includes(player.id)) {
        stateStore.players.push(player);
      }
    });

    // push changes to state store
    state.players.forEach(player => {
      // grab the stored player
      let storedStatePlayer = stateStore.players.find(
        storedPlayer => storedPlayer.id === player.id
      );

      // copy in any tail deltas
      player.tail.forEach(block => {
        storedStatePlayer.tail.push(block);
      });

      // copy x and y, name, score
      storedStatePlayer.x = player.x;
      storedStatePlayer.y = player.y;
      storedStatePlayer.name = player.name;
      storedStatePlayer.score = player.score;
    });

    // get the current player's x and y
    const clientPlayer = stateStore.players.find(
      player => player.id === socket.id
    );
    const cameraX = clientPlayer.x;
    const cameraY = clientPlayer.y;

    // build a view from the state
    const view = getViewFromState(stateStore, cameraX, cameraY);

    // render the view
    renderView(canvas, view);

    // render the high scores
    renderLeaderboard(stateStore);
  });
};

export default startGame;
