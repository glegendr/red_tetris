import React from 'react'
import { connect } from 'react-redux'
import Game from './game'

const App = ({ message }) => {
  return (
    <span><Game /></span>
  )
}

const mapStateToProps = (state) => {
  return {
    message: state.alert.message
  }
}

export default connect(mapStateToProps, null)(App)  