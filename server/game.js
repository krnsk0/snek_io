/* eslint-disable complexity */
/* eslint-disable function-paren-newline */
const Filter = require('bad-words');
const constants = require('../shared/constants');
const { gameStateFactory, newPlayerFactory } = require('./factories');
const { restartPlayer } = require('./restartPlayer');

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

    // direction listener
    socket.on(constants.MSG.DIRECTION, dir => {
      // don't allow the player to stop once started
      if (dir) {
        player.direction = dir;
      }
    });

    // name listener
    socket.on(constants.MSG.SET_NAME, name => {
      // trim to 16 chars
      const cleaned = profanityFilter.clean(name);
      player.name = cleaned.substring(0, 16);
    });

    // destroy player on disconnect
    socket.on(constants.MSG.DISCONNECT, () => {
      state.players = state.players.filter(player => player.id !== socket.id);
    });
  });

  // tick
  setInterval(() => {
    // process player changes
    state.players = state.players.map(player => {
      // if alive & if moving...
      if (player.direction) {
        // push previous head to the tail array
        player.tail.push([player.x, player.y]);

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
          player.x === constants.BOARD_WIDTH ||
          player.y === constants.BOARD_HEIGHT
        ) {
          player.alive = false;
        }

        // check for head collisions with all other players
        const filteredPlayerList = state.players.filter(
          p => p.id !== player.id
        );
        for (let otherPlayer of filteredPlayerList) {
          if (player.x === otherPlayer.x && player.y === otherPlayer.y) {
            player.alive = false;
            otherPlayer.alive = false;
            break;
          }
        }

        // check for tail collisions with all players including curent
        for (let otherPlayer of state.players) {
          for (let tailSegment of otherPlayer.tail) {
            if (player.x === tailSegment[0] && player.y === tailSegment[1]) {
              player.alive = false;
              break;
            }
          }
        }
      }

      // check to see if we hit another payer
      return player;
    });

    // restart dead players
    state.players = state.players.map(player => {
      if (player.alive) return player;
      else return restartPlayer(player, state.players);
    });

    // add a timestamp to the state
    // TODO

    // send state to clients
    io.emit(constants.MSG.SEND_STATE, state);
  }, 1000 / constants.SERVER_TICKS_PER_SECOND);
};
