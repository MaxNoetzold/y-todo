# Y-Websocket & Y-Mongodb-Provider

This is a simple Node server that runs [y-websocket](https://github.com/yjs/y-websocket/) with [persistence](https://github.com/MaxNoetzold/y-mongodb-provider) for [Mongodb](https://www.mongodb.com/de-de). It is written in TypeScript and requires Node v20.

This server is a simplified version of the [official example for a y-websocket server](https://github.com/yjs/y-websocket/tree/master/bin).

## Directories

This backend was implemented with three systems in mind: CommonJS, ESM, and Bundling (with Rollup). The goal is to ensure that the y-mongodb-provider works in all three environments.
