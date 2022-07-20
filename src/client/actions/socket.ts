import { Action } from "@src/common/actions"

export const ping = (): Action => {
  return {
    type: 'SOCKET_PING'
  }
}

export const addPlayerToGame = (name: string): Action => {
  return {
    type: 'JOIN_GAME',
    payload: name
  }
}