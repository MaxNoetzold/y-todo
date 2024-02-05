# Y-Websocket & Y-Mongodb-Provider

A simple Node server to run a [y-websocket](https://github.com/yjs/y-websocket/) with [persistence](https://github.com/MaxNoetzold/y-mongodb-provider) for a [Mongodb](https://www.mongodb.com/de-de).

It is written in Typescript with Node v20.

The server is a simplified version of the [official example for a y-websocket server](<(https://github.com/yjs/y-websocket/tree/master/bin)>).

## How to run?

Install dependencies first: `npm install`.

Copy the `EXAMPLE.env`, rename it to `.env` and edit the entries.

To compile and run the server code: `npm run build` and `npm run start` or just `npm run dev`.

## Random Notes

Note on my nodemon script: I wanted to use `ts-node`, but unfortunately it [does not work on Node v20 anymore](https://github.com/TypeStrong/ts-node/issues/1997). So I went back to a simpler variant with `tsc` building.
