/* eslint-disable function-paren-newline */
const constants = require('../shared/constants');
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const morgan = require('morgan');
const { startGame } = require('./game');
const PORT = process.env.PORT || 3000;

// initialize express
const app = express();

// logging middleware
app.use(morgan('tiny'));

// static file-serving middleware
app.use(express.static(path.join(__dirname, '.', 'static')));

// sends index.html
app.use('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'static/index.html'));
});

// serve static files and index.html for anything else
const server = app.listen(PORT, () => console.log(`Serving on ${PORT}`));

// initialize socket.io
const io = socketio(server);

// log connections & disconnections
io.on(constants.MSG.CONNECTION, socket => {
  console.log('connection:', socket.id);
  socket.on(constants.MSG.DISCONNECT, reason => {
    console.log('disconnection:', socket.id);
    console.log('reason:', reason);
  });
});

// start game engine
startGame(io);
