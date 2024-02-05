import "dotenv/config";
import http from "http";
import { WebSocketServer } from "ws";
import * as Y from "yjs";
import { MongodbPersistence } from "y-mongodb-provider";
import { setPersistence, setupWSConnection } from "./websocket/utils.js";
import { IWSSharedDoc } from "./websocket/interfaces.js";

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

// y-websocket
const wss = new WebSocketServer({ server });
wss.on("connection", setupWSConnection);

/*
 * y-mongodb-provider
 */
if (!process.env.MONGO_URL) {
  throw new Error("Please define the MONGO_URL environment variable");
}
const mdb = new MongodbPersistence(process.env.MONGO_URL, {
  flushSize: 100,
  multipleCollections: true,
});

setPersistence({
  bindState: async (docName: string, ydoc: IWSSharedDoc) => {
    // Here you listen to granular document updates and store them in the database
    // You don't have to do this, but it ensures that you don't lose content when the server crashes
    // See https://github.com/yjs/yjs#Document-Updates for documentation on how to encode
    // document updates

    // official default code from: https://github.com/yjs/y-websocket/blob/37887badc1f00326855a29fc6b9197745866c3aa/bin/utils.js#L36
    const persistedYdoc = await mdb.getYDoc(docName);
    const newUpdates = Y.encodeStateAsUpdate(ydoc);
    mdb.storeUpdate(docName, newUpdates);
    Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
    ydoc.on("update", async (update: Uint8Array) => {
      mdb.storeUpdate(docName, update);
    });
  },
  writeState: (docName: string, ydoc: IWSSharedDoc) => {
    // This is called when all connections to the document are closed.
    // In the future, this method might also be called in intervals or after a certain number of updates.
    return new Promise((resolve) => {
      // When the returned Promise resolves, the document will be destroyed.
      // So make sure that the document really has been written to the database.
      resolve(true);
    });
  },
});

server.listen(process.env.PORT, () => {
  console.log("listening on port:" + process.env.PORT);
});
