import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import App from './containers/app'
import { alert } from './actions/alert'
import { ping } from './actions/socket'
import io from 'socket.io-client'
import params from '../../params'

const initialState = {}

const socketIoMiddleWare = socket => ({ dispatch, getState }) => {
  if (socket) socket.on('action', dispatch)
  return next => action => {
    if (socket && action.type && action.type.indexOf('SOCKET_') === 0) socket.emit('action', action)
    return next(action)
  }
}

const socket = io(params.server.url)
const store = createStore(
  reducer,
  initialState,
  applyMiddleware(
    thunk,
    socketIoMiddleWare(socket),
    createLogger()
  )
)

ReactDom.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('tetris'))

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'));
// store.dispatch(ping());