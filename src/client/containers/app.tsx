import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../reducers'
import Game from './game'

const App = (props: { message?: string }) => {
  return (
    <span>
      {props.message}
      <Game />
    </span>
  )
}

const mapStateToProps = (state: GlobalState) => {
  return {
    message: state.alert.message
  }
}

export default connect(mapStateToProps, null)(App)  