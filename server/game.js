/* eslint-disable complexity */
/* eslint-disable function-paren-newline */
const Filter = require('bad-words');
const constants = require('../shared/constants');
const { gameStateFactory, newPlayerFactory } = require('./factories');
const { restartPlayer } = require('./restartPlayer');
const makeLeaderboard = require('./makeLeaderboard');
const prepareState = require('./prepareState');

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
      player.name = cleaned.substring(0, 12);
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
          restartPlayer(player, state.players);
        }

        // check for head collisions with all other players
        const filteredPlayerList = state.players.filter(
          p => p.id !== player.id
        );
        for (let otherPlayer of filteredPlayerList) {
          if (player.x === otherPlayer.x && player.y === otherPlayer.y) {
            restartPlayer(player, state.players);
            restartPlayer(otherPlayer, state.players);
            break;
          }
        }

        // check for tail collisions with all players including curent
        for (let otherPlayer of state.players) {
          for (let tailSegment of otherPlayer.tail) {
            if (player.x === tailSegment[0] && player.y === tailSegment[1]) {
              restartPlayer(player, state.players);
              break;
            }
          }
        }
      }

      // return the update player
      return player;
    }); // end of state.players.map()

    // add leaderboard
    state = makeLeaderboard(state);

    // prepare state to send to client
    let preparedState = prepareState(state);

    // send state to clients
    io.emit(constants.MSG.SEND_STATE, preparedState);
  }, 1000 / constants.SERVER_TICKS_PER_SECOND);
};
