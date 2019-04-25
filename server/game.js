// constants
const BOARD_WIDTH = 80;
const BOARD_HEIGHT = 60;
const UPDATES_PER_SECOND = 10;

const mapFactory = () => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => 0)
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
  return {
    id,
    x,
    y,
    direction: false,
    hue: Math.floor(Math.random() * 360),
    tail: [],
    alive: true
  };
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
      player.direction = dir;
    });

    // destroy player on disconnect
    socket.on('disconnect', () => {
      player.alive = false;
    });
  });

  // tick
  setInterval(() => {
    // move players
    state.players = state.players.map(player => {
      // push previous head to the tail array
      player.tail.push([player.x, player.y]);

      // do the move
      const vectors = {
        left: [-1, 0],
        right: [1, 0],
        up: [0, -1],
        down: [0, 1]
      };
      if (player.direction) {
        player.x += vectors[player.direction][0];
        player.y += vectors[player.direction][1];
      }

      // check for wall death
      if (
        player.x < 0 ||
        player.y < 0 ||
        player.x === BOARD_WIDTH ||
        player.y === BOARD_HEIGHT
      ) {
        player.alive = false;
      }
      return player;
    });

    // update the map
    state.players.forEach(player => {
      // for living players...
      if (player.alive) {
        // make the last player position the tail color
        const lastHead = player.tail[player.tail.length - 1];
        map[lastHead[1]][lastHead[0]] = `hsl(${player.hue}, 40%, 30%)`;

        // render player heads
        map[player.y][player.x] = `hsl(${player.hue}, 100%, 50%)`;
      }
      // erase dead players' tails
      if (!player.alive) {
        player.tail.forEach(segment => {
          map[segment[1]][segment[0]] = 0;
        });
      }
    });

    // delete dead players from the state
    state.players = state.players.filter(player => player.alive);

    io.emit('sync_map', map);
  }, 1000 / UPDATES_PER_SECOND);
};

// export
module.exports = startGame;
