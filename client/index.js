/* eslint-disable no-shadow */
import { direction } from './keypress';
const socket = io();

// constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const CELL_SIZE = 10;

// initialize canvas
const canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
const context = canvas.getContext('2d');

// draw the map
const renderMap = (context, map) => {
  for (let y = 0; y < map.length; y += 1) {
    for (let x = 0; x < map[0].length; x += 1) {
      const currentCell = map[y][x];
      context.fillStyle = currentCell ? '#000000' : '#ffffff';
      context.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
};

// render inside socket
socket.on('state', state => renderMap(context, state.map));
