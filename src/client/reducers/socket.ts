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
  tick: number
  refresh: number
  gameList: GameResume[]
  socket: SocketIOClient.Socket,
  refreshmentRate: number
}

const initSocketState = (): SocketState  => {
  const socket: SocketIOClient.Socket = io('http://localhost:3004');

  return {
    socket,
    gameList: [],
    tick: 0,
    refresh: 0,
    refreshmentRate: 3,
  }
}

const reducer = (state: SocketState = initSocketState(), action: Action) => {
  switch (action.type) {
    case 'SET_REFRESHMENT_RATE':
      return {
        ...state,
        refreshmentRate: action.payload
      }
    case 'SOCKET_CONNECT':
      return state
    case 'SRV_EMIT_GAME':
      return {
        ...state,
        tick: 0,
        game: action.payload
      }
    case 'SRV_EMIT_GAME_LIST':
      return {
        ...state,
        gameList: action.payload
      }
    case 'SRV_EMIT_PLAYER_CHANGES':
      let newGame = state.game && {...state.game};
      if (newGame?.players) {
        newGame.players[action.payload.index] = action.payload.player;
      }
      return {
        ...state,
        game: newGame
      }
    case 'SRV_UPDATE_GAME':
      if (state.game) {
        state.game = {
          ...state.game,
          players: action.payload.players,
          running: action.payload.running
        } as Game
      }
      return {
        ...state,
        tick: state.tick + 1,
        refresh: state.tick % state.refreshmentRate == 0 || state.game?.running == false ? state.refresh + 1 : state.refresh
      }
    default:
      return state
  }
}

export default reducer

