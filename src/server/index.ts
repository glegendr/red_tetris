import debug from 'debug'
import GamesMonitor from './models/gamesMonitor'
import { Socket } from 'socket.io';
import { Action, ActionType } from '@src/common/actions';
import * as express from 'express';
import {Server} from 'http';

const gamesMonitor = new GamesMonitor();

const loginfo = debug('tetris:info')

const initEngine = (io: any) => {
    io.on('connection', function (socket: Socket) {

    loginfo("Socket connected: " + socket.id)

    socket.on('disconnect', () => {
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_DISCONNECT_PLAYER' }, socket)
    });

    socket.on('action', (action: Action) => {
      switch (action.type) {
        case 'SOCKET_JOIN_GAME':
          gamesMonitor.dispatch({ type: 'GAME_MONITOR_ADD_PLAYER', payload: action.payload }, socket)
          break;
        default:
          let type = action.type.substring(6);
          type = 'GAME_MONITOR' + type;
          gamesMonitor.dispatch({ type: type as ActionType, payload: action.payload }, socket)
          break;
      }
    })
  })
}

export function create(params: any) {
  const app = express();

  app.use(express.static('build'));
  const server = new Server(app);

  const io = require('socket.io')(server);

  initEngine(io)

  server.listen(params.port, () => {
    console.log('Listening on:', params.port);
  });
}
