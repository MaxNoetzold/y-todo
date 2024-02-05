/*
    Copied from: https://github.com/yjs/y-websocket/blob/master/bin/callback.js
    Only adjusted for ts.
*/

import http from "http";
import { IWSSharedDoc } from "./interfaces.js";

const CALLBACK_URL = process.env.CALLBACK_URL
  ? new URL(process.env.CALLBACK_URL)
  : null;
const CALLBACK_TIMEOUT = parseInt(process.env.CALLBACK_TIMEOUT || "5000", 10);
const CALLBACK_OBJECTS = process.env.CALLBACK_OBJECTS
  ? JSON.parse(process.env.CALLBACK_OBJECTS)
  : {};

const isCallbackSet = !!CALLBACK_URL;

const callbackHandler = (
  update: Uint8Array,
  origin: any,
  doc: IWSSharedDoc
) => {
  const dataToSend: { room: string; data: { [key: string]: any } } = {
    room: doc.name,
    data: {},
  };
  const sharedObjectList = Object.keys(CALLBACK_OBJECTS);
  sharedObjectList.forEach((sharedObjectName) => {
    const sharedObjectType = CALLBACK_OBJECTS[sharedObjectName];
    dataToSend.data[sharedObjectName] = {
      type: sharedObjectType,
      content: getContent(sharedObjectName, sharedObjectType, doc).toJSON(),
    };
  });
  if (
    CALLBACK_URL &&
    CALLBACK_TIMEOUT &&
    Object.keys(dataToSend.data).length > 0
  ) {
    callbackRequest(CALLBACK_URL, CALLBACK_TIMEOUT, dataToSend);
  }
};

const callbackRequest = (url: URL, timeout: number, data: Object) => {
  const dataStr = JSON.stringify(data);
  const options = {
    hostname: url.hostname,
    port: url.port,
    path: url.pathname,
    timeout,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": dataStr.length,
    },
  };
  const req = http.request(options);
  req.on("timeout", () => {
    console.warn("Callback request timed out.");
    req.destroy();
  });
  req.on("error", (e) => {
    console.error("Callback request error.", e);
    req.destroy();
  });
  req.write(dataStr);
  req.end();
};

const getContent = (objName: string, objType: string, doc: IWSSharedDoc) => {
  switch (objType) {
    case "Array":
      return doc.getArray(objName);
    case "Map":
      return doc.getMap(objName);
    case "Text":
      return doc.getText(objName);
    case "XmlFragment":
      return doc.getXmlFragment(objName);
    case "XmlElement":
      throw new Error("XmlElement is not supported.");
    default:
      throw new Error("Unknown shared object type.");
  }
};

export { callbackHandler, isCallbackSet };
