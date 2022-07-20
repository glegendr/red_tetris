
export const SOCKET_CONNECT = 'SOCKET_CONNECT'
export const SOCKET_PING = 'SOCKET_PING'
export const SOCKET_PONG = 'SOCKET_PONG'
export const JOIN_GAME = 'JOIN_GAME'

export const ping = () => {
  return {
    type: SOCKET_PING
  }
}

export const addPlayerToGame = (name: string) => {
  return {
    type: JOIN_GAME,
    gameName: name
  }
}