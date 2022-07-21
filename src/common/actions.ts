export type ActionType
    = 'GAME_MONITOR_ADD_PLAYER'
    | 'SOCKET_CONNECT'
    | 'SOCKET_PING'
    | 'SOCKET_PONG'
    | 'SOCKET_JOIN_GAME'
    | 'ALERT_POP'

export type Action = {
    type: ActionType
    payload?: any
}