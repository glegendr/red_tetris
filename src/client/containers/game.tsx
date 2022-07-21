import Game from '@src/server/models/game';
import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../reducers';
import { useDispatch } from 'react-redux'
import { addPlayerToGame } from '../actions/socket';

function renderPlayer(game?: Game) {
    if (!game || !game.players || !game.players[0])
        return undefined;
    return game.players[0].render();
}

const Tetris = (props: { game?: Game }) => {
    const { game } = props; 
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(addPlayerToGame('testGame01'));
    }, [])

    return (
        <div>
            {renderPlayer(game)}
        </div>
    )
}

const mapStateToProps = (state: GlobalState) => {
    return {
        game: state.socket.game,
    }
}

export default connect(mapStateToProps, null)(Tetris)  