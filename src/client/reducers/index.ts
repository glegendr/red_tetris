import alert, { AlertState } from './alert'
import socket, { SocketState } from './socket'
import { combineReducers } from 'redux'

export type GlobalState = {
    socket: SocketState
    alert: AlertState
}

export default combineReducers({alert, socket})



