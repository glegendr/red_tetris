import Game from '@src/server/models/game'
import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../reducers'
import Connect from './connect'
import Tetris from './tetris'

const App = (props: { game?: Game }) => {

  return (
    <span>
      <Connect />
      <Tetris />
    </span>
  )
}

const mapStateToProps = (state: GlobalState) => {
  return {
    game: state.socket.game
  }
}

export default connect(mapStateToProps, null)(App)  