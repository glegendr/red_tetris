import React from 'react'
import { connect } from 'react-redux'
import { useStore } from 'react-redux'
import { createGame } from '../actions/socket'
import Player from '../../server/models/player'

function renderPlayer(game) {
    if (!game || !game.players || !game.players[0])
        return undefined;
    return new Player(game.players[0]).render();
}

const Tetris = ({ game }) => {
    let store = useStore();
    console.log(game)

    React.useEffect(() => {
        store.dispatch(createGame());
    }, [])

    return (
        <div>
            {renderPlayer(game)}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        game: state.socket.game,
    }
}

export default connect(mapStateToProps, null)(Tetris)  