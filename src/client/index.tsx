import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer from './reducers'
import App from './containers/app'
import { alert } from './actions/alert'
import * as io from 'socket.io-client'
import params from '../../params'
import { Action } from '@src/common/actions'
import * as React from 'react'
import * as ReactDOM from 'react-dom'


const initialState = {}

const socketIoMiddleWare = (a: SocketIOClient.Socket) => (localSocket: any) => {
  // if (localSocket) localSocket.on('action', localSocket.dispatch)
  return (next: (act: any) => void) => (action: Action) => {
    if (localSocket && action.type && action.type.indexOf('SOCKET_') === 0) localSocket.emit('action', action)
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

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('tetris'))

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'));
// store.dispatch(ping());