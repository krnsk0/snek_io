module.exports = Object.freeze({
  MAP_WIDTH: 150, // no smaller than 150
  MAP_HEIGHT: 150, // no smaller than 120
  SERVER_TICKS_PER_SECOND: 15,
  ZOOM: 1.8, // float between 0.5 and 1.8
  SERVER_LOG_TIME_SECS: 5,
  STARTING_FOOD: 100,
  INITIAL_SNAKE_LENGTH: 10,
  MSG: {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
    CONNECT: 'connect',
    SEND_STATE: 'S',
    SET_NAME: 'N',
    DIRECTION: 'D',
    SEND_INITIAL_STATE: 'I',
    GET_NAME: 'G'
  }
});
