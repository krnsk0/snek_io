/* eslint-disable complexity */
/* eslint-disable function-paren-newline */
const Filter = require('bad-words');
const profanityFilter = new Filter();

// constants
const BOARD_WIDTH = 80;
const BOARD_HEIGHT = 60;
const UPDATES_PER_SECOND = 10;

const mapFactory = () => {
  const emptyCellFactory = () => {
    return {
      color: 0,
      name: ''
    };
  };

  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => emptyCellFactory())
  );
};
const map = mapFactory();

const randomCell = () => {
  const x = Math.floor(Math.random() * BOARD_WIDTH);
  const y = Math.floor(Math.random() * BOARD_HEIGHT);
  return [x, y];
};

const gameStateFactory = () => {
  return {
    players: []
  };
};
let state = gameStateFactory();

const newPlayerFactory = id => {
  const [x, y] = randomCell();
  let player = {
    id,
    x,
    y,
    direction: false,
    hue: Math.floor(Math.random() * 360),
    tail: [],
    alive: true,
    justSpwaned: true,
    connected: true,
    name: ''
  };
  return player;
};

const restartPlayer = player => {
  const [x, y] = randomCell();
  player.x = x;
  player.y = y;
  player.tail = [];
  player.alive = true;
  player.direction = false;
  return player;
};

const startGame = io => {
  // on first connection
  io.on('connection', socket => {
    // send the current map state
    socket.emit('sync_map', map);

    // make a new player and add to the players array
    const player = newPlayerFactory(socket.id);
    state.players.push(player);

    // direction listener
    socket.on('direction', dir => {
      // don't allow the player to stop once started
      if (dir) {
        player.direction = dir;
      }
    });

    // name listener
    socket.on('set_name', name => {
      // trim to 16 chars
      const cleaned = profanityFilter.clean(name);
      player.name = cleaned.substring(0, 16);
    });

    // destroy player on disconnect
    socket.on('disconnect', () => {
      console.log('killing player');
      player.connected = false;
    });
  });

  // tick
  setInterval(() => {
    // process player changes
    state.players = state.players.map(player => {
      // push previous head to the tail array
      player.tail.push([player.x, player.y]);

      // if moving...
      if (player.direction) {
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
          player.x === BOARD_WIDTH ||
          player.y === BOARD_HEIGHT
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

    // update the map
    state.players.forEach(player => {
      // for living players...
      if (player.alive && player.connected) {
        // make the last player position the tail color and turn off name
        const lastHead = player.tail[player.tail.length - 1];
        map[lastHead[1]][lastHead[0]].color = `hsl(${player.hue}, 40%, 30%)`;
        map[lastHead[1]][lastHead[0]].name = '';

        // render player heads
        map[player.y][player.x].color = `hsl(${player.hue}, 100%, 50%)`;
        map[player.y][player.x].name = player.name;
      }
      // erase dead players' tails
      if (!player.alive || !player.connected) {
        player.tail.forEach(segment => {
          map[segment[1]][segment[0]].color = 0;
          map[segment[1]][segment[0]].name = '';
        });
      }
    });

    // delete disconnected players
    state.players = state.players.filter(player => player.connected);

    // restart dead players
    state.players = state.players.map(player => {
      if (player.alive) return player;
      else return restartPlayer(player);
    });

    // send the map to clients
    // callback kill players if messages not received
    io.emit('sync_map', map);
  }, 1000 / UPDATES_PER_SECOND);
};

// export
module.exports = startGame;
