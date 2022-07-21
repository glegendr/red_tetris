import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import reducer, { GlobalState } from './reducers'
import App from './containers/app'
import { alert } from './actions/alert'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Action } from '@src/common/actions'

function initSocketReducer(store: any)  {
  const state: GlobalState = store.getState();
  const dispatch = store.dispatch;
  state.socket.socket.on('response', (action: Action) => dispatch(action));
}

const socketIoMiddleWare = (store: any) => (next: any) => (action: Action) => {
  const state: GlobalState = store.getState();
  const socket = state.socket.socket;
  if (socket && action.type && action.type.indexOf('SOCKET_') === 0)
    socket.emit('action', action)
  return next(action)
}

const store = createStore(
  reducer,
  applyMiddleware(
    socketIoMiddleWare,
    createLogger()
  )
)

initSocketReducer(store);

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('tetris'))

store.dispatch(alert('Soon, will be here a fantastic Tetris ...'));