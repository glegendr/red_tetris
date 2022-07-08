export const SOCKET_CONNECT = 'SOCKET_CONNECT'
export const SOCKET_PING = 'SOCKET_PING'
export const SOCKET_PONG = 'SOCKET_PONG'

export const ping = () => {
    return {
      type: SOCKET_PING
    }
  }
  