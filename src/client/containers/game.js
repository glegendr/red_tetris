import React from 'react'
import { connect } from 'react-redux'
import { useStore } from 'react-redux'
import { createGame } from '../actions/socket'

const Game = ({ game }) => {
    let store = useStore();
    console.log(game)

    React.useEffect(() => {
        store.dispatch(createGame());
    }, [])

    return (
        <div>
            ZZCC
            {game && game.players && game.players[0].render}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        game: state.socket.game,
    }
}

export default connect(mapStateToProps, null)(Game)  