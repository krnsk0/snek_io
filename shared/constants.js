module.exports = Object.freeze({
  MAP_WIDTH: 150,
  MAP_HEIGHT: 150,
  SERVER_TICKS_PER_SECOND: 15,
  ZOOM: 1.8, // float between 0.5 and 1.8
  MSG: {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    CONNECT: 'connect',
    SEND_STATE: 'S',
    SET_NAME: 'S',
    DIRECTION: 'D'
  }
});
