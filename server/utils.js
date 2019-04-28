const constants = require('../shared/constants');
const { getUTF8Size } = require('../shared/utils');

module.exports.randomCell = () => {
  const x = Math.floor(Math.random() * constants.MAP_WIDTH);
  const y = Math.floor(Math.random() * constants.MAP_HEIGHT);
  return [x, y];
};

let stateSizes = [];
let playersOnline = [];
module.exports.printServerInfo = (compressedState, state) => {
  stateSizes.push(getUTF8Size(compressedState));
  playersOnline.push(state.players.length);

  // every X seconds print some stuff
  if (
    stateSizes.length >=
    constants.SERVER_TICKS_PER_SECOND * constants.SERVER_LOG_TIME_SECS
  ) {
    let avgPlayers = (
      playersOnline.reduce((acc, d) => acc + d, 0) / playersOnline.length
    ).toFixed(2);
    let stateKilobytesPerSecond = (
      avgPlayers *
      (stateSizes.reduce((acc, d) => acc + d, 0) /
        (1000 * constants.SERVER_TICKS_PER_SECOND))
    ).toFixed(2);

    // print
    console.log(`\nAVG PLAYERS: ${avgPlayers}`);
    console.log(`\nAVG TOTAL DATA RATE: ${stateKilobytesPerSecond} kbps`);

    // clear
    stateSizes = [];
    playersOnline = [];
  }
};
