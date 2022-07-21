import { Action } from "@src/common/actions"
import Game from "@src/server/models/game"
import * as io from 'socket.io-client'

export type SocketState = {
  game?: Game
  socket: SocketIOClient.Socket
}

const initSocketState = () => {
  const socket: SocketIOClient.Socket = io('http://localhost:3004');

  return {
    socket
  }
}

const reducer = (state: SocketState = initSocketState(), action: Action) => {
  switch (action.type) {
    case 'SOCKET_CONNECT':
      return state
    default:
      return state
  }
}

export default reducer

