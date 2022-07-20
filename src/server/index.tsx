import fs from 'fs'
import debug from 'debug'
import GamesMonitor from './models/gamesMonitor'
import { Socket } from 'socket.io';

const gamesMonitor = new GamesMonitor();

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')

const initApp = (app: any, params: any, cb: any) => {
  // const { host, port } = params
  const handler = (req: any, res: any) => {
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

  app.listen({ host: params?.host, port: params?.port }, () => {
    loginfo(params?.host, params?.port, params)
    loginfo(`tetris listen on ${params?.url}`)
    cb()
  })
}


const initEngine = (io: any) => {
  io.on('connection', function (socket: Socket) {

    loginfo("Socket connected: " + socket.id)
    socket.on('action', (action) => {
      switch (action.type) {
        case 'JOIN_GAME':
          gamesMonitor.dispatch({ type: 'GAME_MONITOR_ADD_PLAYER', payload: action.payload }, socket)
          break;
      }
    })
  })
}

export function create(params: any) {
  const promise = new Promise((resolve, reject) => {
    const app = require('http').createServer()
    initApp(app, params, () => {
      const io = require('socket.io')(app)
      const stop = (cb: () => void) => {
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
