import { Action } from "@src/common/actions"
import Game from "@src/server/models/game"
import * as io from 'socket.io-client'

export type GameResume = {
  name: string,
  players: string[],
  running: boolean
}

export type SocketState = {
  game?: Game
  gameList: GameResume[]
  socket: SocketIOClient.Socket
}

const initSocketState = () => {
  const socket: SocketIOClient.Socket = io('http://localhost:3004');

  return {
    socket,
    gameList: []
  }
}

const reducer = (state: SocketState = initSocketState(), action: Action) => {
  switch (action.type) {
    case 'SOCKET_CONNECT':
      return state
    case 'SRV_EMIT_GAME':
      return {
        ...state,
        game: action.payload
      }
    case 'SRV_EMIT_GAME_LIST':
      return {
        ...state,
        gameList: action.payload
      }
    default:
      return state
  }
}

export default reducer

