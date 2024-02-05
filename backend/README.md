# Y-Websocket & Y-Mongodb-Provider

This is a simple Node server that runs [y-websocket](https://github.com/yjs/y-websocket/) with [persistence](https://github.com/MaxNoetzold/y-mongodb-provider) for [Mongodb](https://www.mongodb.com/de-de). It is written in TypeScript and requires Node v20.

This server is a simplified version of the [official example for a y-websocket server](https://github.com/yjs/y-websocket/tree/master/bin).

## How to run?

First, install the dependencies with `npm install`.

Next, copy the `EXAMPLE.env` file, rename it to `.env`, and edit the entries as needed.

To compile and run the server code, use `npm run build` and `npm run start`, or simply use `npm run dev`.

## Random Notes

Regarding my nodemon script: I initially wanted to use `ts-node`, but it [does not work with Node v20 anymore](https://github.com/TypeStrong/ts-node/issues/1997). As a result, I reverted to a simpler variant using `tsc` for building.
