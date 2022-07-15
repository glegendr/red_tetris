export const SOCKET_CONNECT = 'SOCKET_CONNECT'
export const SOCKET_PING = 'SOCKET_PING'
export const SOCKET_PONG = 'SOCKET_PONG'
export const SOCKET_NEXT_PIECE = 'SOCKET_NEXT_PIECE'
export const SOCKET_NEXT_PIECE_RES = 'SOCKET_NEXT_PIECE_RES'
export const SOCKET_START_GAME = 'SOCKET_START_GAME'
export const SOCKET_START_GAME_RES = 'SOCKET_START_GAME_RES'

export const ping = () => {
  return {
    type: SOCKET_PING
  }
}

export const nextPiece = () => {
  return {
    type: SOCKET_NEXT_PIECE
  }
}

export const createGame = () => {
  return {
    type: SOCKET_START_GAME
  }
}