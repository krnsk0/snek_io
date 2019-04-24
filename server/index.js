const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const morgan = require('morgan');

// initialize express
const app = express();

// logging middleware
app.use(morgan('dev'));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '.', 'static')));

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static/index.html'));
});

// serve static files and index.html for anything else
const PORT = 3000;
const server = app.listen(PORT, () => console.log(`Serving on ${PORT}`));

// initialize socket.io
const io = socketio(server);

// log connections & disconnections
io.on('connection', socket => {
  console.log('connection:', socket.id);
  console.log();
  socket.on('disconnect', () => {
    console.log('disconnection:', socket.id);
  });
});

/**************
 *    GAME
 **************/

// constants
const BOARD_WIDTH = 80;
const BOARD_HEIGHT = 60;
const UPDATES_PER_SECOND = 10;

// create an empty map
const mapFactory = () => {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => Math.floor(Math.random() * 10))
  );
};

setInterval(() => {
  const map = mapFactory();
  io.emit('state', { map });
}, 100);

// listening
io.on('connection', socket => {
  // listen for direction changes
  socket.on('direction', direction => console.log(direction));
});
