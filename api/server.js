const express = require("express");

const configureMiddleware = require("./configure-middleware");
const apiRouter = require("./api-router");

const server = express();
configureMiddleware(server);

server.use("/api", apiRouter);
server.use("/docs", express.static("./docs"));

module.exports = server;
