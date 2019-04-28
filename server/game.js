/* eslint-disable complexity */
/* eslint-disable function-paren-newline */
const Filter = require('bad-words');
const constants = require('../shared/constants');
const { gameStateFactory, newPlayerFactory } = require('./factories');
const { restartPlayer } = require('./restartPlayer');
const compressState = require('./compressState');
const { printServerInfo } = require('./utils');

// initialize some things
let state = gameStateFactory();
const profanityFilter = new Filter();

// initialize the game
module.exports.startGame = io => {
  // on first connection
  io.on(constants.MSG.CONNECTION, socket => {
    // make a new player and add to the players array
    const player = newPlayerFactory(socket.id);
    state.players.push(player);

    // ask for name
    socket.emit(constants.MSG.GET_NAME);

    // send the initial state to new player
    socket.emit(constants.MSG.SEND_INITIAL_STATE, state);

    // direction listener
    socket.on(constants.MSG.DIRECTION, dir => {
      // don't allow the player to stop once started
      if (dir) {
        // filter keypresses that would kill the player
        if (dir === 'up' && player.direction !== 'down') {
          player.direction = dir;
        }
        if (dir === 'down' && player.direction !== 'up') {
          player.direction = dir;
        }
        if (dir === 'left' && player.direction !== 'right') {
          player.direction = dir;
        }
        if (dir === 'right' && player.direction !== 'left') {
          player.direction = dir;
        }
      }
    });

    // name listener
    socket.on(constants.MSG.SET_NAME, name => {
      // trim to 16 chars
      const cleaned = profanityFilter.clean(name);
      player.name = cleaned.substring(0, 12);
    });

    // destroy player on disconnect
    socket.on(constants.MSG.DISCONNECT, () => {
      state.players = state.players.filter(player => player.id !== socket.id);
      state.leave.push(socket.id);
    });
  });

  // tick
  setInterval(() => {
    // process player changes
    state.players = state.players.map(player => {
      // if moving...
      if (player.direction) {
        // push previous head to the tail array
        player.tail.push([player.x, player.y]);

        // calculate score
        player.score = player.tail.length;

        // do the move
        const vectors = {
          left: [-1, 0],
          right: [1, 0],
          up: [0, -1],
          down: [0, 1]
        };
        player.x += vectors[player.direction][0];
        player.y += vectors[player.direction][1];

        // check for wall death
        if (
          player.x < 0 ||
          player.y < 0 ||
          player.x > constants.MAP_WIDTH ||
          player.y > constants.MAP_HEIGHT
        ) {
          state.kill.push(player.id);
          restartPlayer(player, state.players);
        }

        // check for head collisions with all other players
        const filteredPlayerList = state.players.filter(
          p => p.id !== player.id
        );
        for (let otherPlayer of filteredPlayerList) {
          if (player.x === otherPlayer.x && player.y === otherPlayer.y) {
            state.kill.push(player.id);
            state.kill.push(otherPlayer.id);
            restartPlayer(player, state.players);
            restartPlayer(otherPlayer, state.players);
            break;
          }
        }

        // check for tail collisions with all players including curent
        for (let otherPlayer of state.players) {
          for (let tailSegment of otherPlayer.tail) {
            if (player.x === tailSegment[0] && player.y === tailSegment[1]) {
              state.kill.push(player.id);
              restartPlayer(player, state.players);
              break;
            }
          }
        }
      }

      // return the update player
      return player;
    }); // end of state.players.map()

    // prepare state to send to client
    let compressedState = compressState(state);

    // set up logging
    printServerInfo(compressedState, state);

    // send state to clients
    io.emit(constants.MSG.SEND_STATE, compressedState);

    // clear our the kill and leave lists
    state.kill = [];
    state.leave = [];
  }, 1000 / constants.SERVER_TICKS_PER_SECOND);
};
