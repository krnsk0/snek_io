const constants = require('../shared/constants');
const { getUTF8Size } = require('../shared/utils');

export const printKBPS = socket => {
  // print packet sizes
  let stateSizes = [];
  socket.on(constants.MSG.SEND_STATE, state => {
    stateSizes.push(getUTF8Size(state));
    // every second print some stuff
    if (stateSizes.length >= constants.SERVER_TICKS_PER_SECOND) {
      let stateKilobytesPerSecond = (
        stateSizes.reduce((acc, d) => acc + d, 0) / 1000
      ).toFixed(2);

      // only print if we have flag set
      if (window.kbps === true) {
        console.log(
          `%c${stateKilobytesPerSecond} kbps`,
          'background-color: navy; color: white;'
        );
      }
      stateSizes = [];
    }
  });
};
