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
    hue: Math.floor(Math.random() * 360)
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
      map[player.y][player.x] = 0;
      state.players = state.players.filter(p => socket.id !== p.id);
    });
  });

  // tick
  setInterval(() => {
    // move players
    state.players = state.players.map(player => {
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
      return player;
    });

    // draw players
    state.players.forEach(player => {
      map[player.y][player.x] = player.hue;
    });

    io.emit('sync_map', map);
  }, 1000 / UPDATES_PER_SECOND);
};

// export
module.exports = startGame;
