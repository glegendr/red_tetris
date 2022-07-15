import fs from 'fs'
import debug from 'debug'
import { SOCKET_PING, SOCKET_PONG, SOCKET_START_GAME_RES, SOCKET_START_GAME } from '../client/actions/socket'
import Game from './models/game'
import Player from './models/player'

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {
  const { host, port } = params
  const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html'
    fs.readFile(__dirname + file, (err, data) => {
      if (err) {
        logerror(err)
        res.writeHead(500)
        return res.end('Error loading index.html')
      }
      res.writeHead(200)
      res.end(data)
    })
  }

  app.on('request', handler)

  app.listen({ host, port }, () => {
    loginfo(`tetris listen on ${params.url}`)
    cb()
  })
}

const initEngine = (io, game) => {
  io.on('connection', function (socket) {

    game.addPlayer(new Player(socket));


    loginfo("Socket connected: " + socket.id)
    socket.on('action', (action) => {
      switch (action.type) {
        case SOCKET_PING:
          socket.emit('action', { type: SOCKET_PONG });
          break;
        case SOCKET_START_GAME:
          socket.emit('action', { type: SOCKET_START_GAME_RES, game: game });
          break;
      }
    })
  })
}

export function create(params) {
  const promise = new Promise((resolve, reject) => {
    const game = new Game();
    const app = require('http').createServer()
    initApp(app, params, () => {
      const io = require('socket.io')(app)
      const stop = (cb) => {
        io.close()
        app.close(() => {
          app.unref()
        })
        loginfo(`Engine stopped.`)
        cb()
      }

      initEngine(io, game)
      resolve({ stop })
    })
  })
  return promise
}
