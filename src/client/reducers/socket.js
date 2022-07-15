import { SOCKET_CONNECT, SOCKET_START_GAME_RES } from "../actions/socket"

const reducer = (state = {}, action) => {
  switch (action.type) {
    case SOCKET_CONNECT:
      return state
    case SOCKET_START_GAME_RES:
      return {
        ...state,
        game: action.game
      }
    default:
      return state
  }
}

export default reducer

