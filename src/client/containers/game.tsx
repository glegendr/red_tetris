import Game from '@src/server/models/game';
import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../reducers';
import { useDispatch } from 'react-redux'
import { addPlayerToGame } from '../actions/socket';
import Terrain from '@src/server/models/terrain';

function renderPlayer(game?: Game, socket?: SocketIOClient.Socket) {
    let terrain = game?.players?.find(p => p.id == socket?.id);
    if (!terrain) return undefined;
    return new Terrain(terrain).render();
}

const Tetris = (props: { game?: Game, socket?: SocketIOClient.Socket }) => {
    const { game, socket } = props; 
    console.log(game);
    const isHost = game && socket && game?.host == socket?.id;
    const dispatch = useDispatch();
    console.log(game && socket && game?.host == socket?.id, game?.host, socket?.id);

    React.useEffect(() => {
        dispatch(addPlayerToGame('testGame01'));
    }, [])

    return (
        <div>
            {renderPlayer(game, socket)}
            {isHost && <button>launch game</button>}
        </div>
    )
}

const mapStateToProps = (state: GlobalState) => {
    return {
        game: state.socket.game,
        socket: state.socket.socket
    }
}

export default connect(mapStateToProps, null)(Tetris)  