import fs from 'fs'
import debug from 'debug'
import GamesMonitor, { GAME_MONITOR_ADD_PLAYER } from './models/gamesMonitor'

const gamesMonitor = new GamesMonitor();

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


const initEngine = (io) => {
  io.on('connection', function (socket) {

    loginfo("Socket connected: " + socket.id)
    socket.on('action', (action) => {
      switch (action.type) {
        case JOIN_GAME:
          gamesMonitor.dispatch({ type: GAME_MONITOR_ADD_PLAYER, gameName: action.gameName }, socket)
          break;
      }
    })
  })
}

export function create(params) {
  const promise = new Promise((resolve, reject) => {
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

      initEngine(io)
      resolve({ stop })
    })
  })
  return promise
}
