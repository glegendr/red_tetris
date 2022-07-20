import { Action } from "@src/common/actions"
import Game from "@src/server/models/game"

export type SocketState = {
  game?: Game
}

const reducer = (state: SocketState = {}, action: Action) => {
  switch (action.type) {
    case 'SOCKET_CONNECT':
      return state
    default:
      return state
  }
}

export default reducer

