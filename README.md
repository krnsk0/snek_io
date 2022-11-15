# snekio

A multiplayer, socket-io-based clone of the classic Snake game.

Deployed via fly.io [here](https://snekio.fly.dev/)

# State shape
```js
{
  players: Array<{
    hue: string;
    id: string;
    length: number;
    name: string;
    score: number;
    x: number;
    y: number
    tail: Array<[number, number]>
  }>,
  kill: Array<{
    id: string
  }>,
  leave: Array<{
    id: string
  }>,
  make: Array<{
    x: number,
    y: number,
  }>,
  eat: Array<{
    x: number,
    y: number
  }>,
}
```
