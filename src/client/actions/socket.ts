import { Action } from "@src/common/actions"

export const ping = (): Action => {
  return {
    type: 'SOCKET_PING'
  }
}

export const launchGame = (): Action => {
  return {
    type: 'SOCKET_LAUNCH_GAME',
  }
}

export const addPlayerToGame = (gameName: string, playerName?: string): Action => {
  return {
    type: 'SOCKET_JOIN_GAME',
    payload: {
      gameName,
      playerName
    }
  }
}