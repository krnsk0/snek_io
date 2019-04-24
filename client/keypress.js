/* eslint-disable complexity */
// eslint-disable-next-line no-undef
const socket = io();

/********************
 *  KEYPRESS LOGIC
 ********************/

let dirList = [];
export let direction = false;

// helper function to get the current direction from a list
// this will be the most recent keypress
const getDirectionFromStack = list => {
  if (list.length === 0) {
    return false;
  } else {
    return list[list.length - 1];
  }
};

// keydowns push to list
document.addEventListener('keydown', evt => {
  if (evt.repeat === false) {
    if (evt.keyCode === 38) {
      // up
      dirList.push('up');
    } else if (evt.keyCode === 40) {
      // down
      dirList.push('down');
    } else if (evt.keyCode === 37) {
      // left
      dirList.push('left');
    } else if (evt.keyCode === 39) {
      // right
      dirList.push('right');
    }
    direction = getDirectionFromStack(dirList);
    socket.emit('direction', direction);
  }
});

// keyups remove their key from the list
document.addEventListener('keyup', evt => {
  if (evt.keyCode === 38) {
    // up
    dirList = dirList.filter(dir => dir !== 'up');
  } else if (evt.keyCode === 40) {
    // down
    dirList = dirList.filter(dir => dir !== 'down');
  } else if (evt.keyCode === 37) {
    // left
    dirList = dirList.filter(dir => dir !== 'left');
  } else if (evt.keyCode === 39) {
    // right
    dirList = dirList.filter(dir => dir !== 'right');
  }
  direction = getDirectionFromStack(dirList);
  socket.emit('direction', direction);
});
