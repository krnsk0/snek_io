/* eslint-disable complexity */
// eslint-disable-next-line no-undef
const socket = io();

/********************
 *  KEYPRESS LOGIC
 ********************/

let dirStack = [];
let currentDir;
const getCurrentDirFromStack = dirStack => {
  if (dirStack.length === 0) {
    return false;
  } else {
    return dirStack[dirStack.length - 1];
  }
};
document.addEventListener('keydown', evt => {
  if (evt.repeat === false) {
    if (evt.keyCode === 38) {
      // up
      dirStack.push('up');
    } else if (evt.keyCode === 40) {
      // down
      dirStack.push('down');
    } else if (evt.keyCode === 37) {
      // left
      dirStack.push('left');
    } else if (evt.keyCode === 39) {
      // right
      dirStack.push('right');
    }
    currentDir = getCurrentDirFromStack(dirStack);
    console.log(currentDir);
  }
});
document.addEventListener('keyup', evt => {
  if (evt.keyCode === 38) {
    // up
    dirStack = dirStack.filter(dir => dir !== 'up');
  } else if (evt.keyCode === 40) {
    // down
    dirStack = dirStack.filter(dir => dir !== 'down');
  } else if (evt.keyCode === 37) {
    // left
    dirStack = dirStack.filter(dir => dir !== 'left');
  } else if (evt.keyCode === 39) {
    // right
    dirStack = dirStack.filter(dir => dir !== 'right');
  }
  currentDir = getCurrentDirFromStack(dirStack);
  console.log(currentDir);
});
