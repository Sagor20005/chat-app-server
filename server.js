const express = require("express")
const { createServer } = require('node:http');
const { Server } = require('socket.io')


const App = express()
const server = createServer(App)
const io = new Server(server,{
  cors: {
    origin: process.env.FRONTEND_URL
  }
});

module.exports = {
 express, App, server, io
}