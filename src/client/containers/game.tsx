import Game from '@src/server/models/game';
import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../reducers';
import { useDispatch } from 'react-redux'
import { addPlayerToGame, launchGame } from '../actions/socket';
import Terrain from '@src/server/models/terrain';
import styled from 'styled-components';

const PlayerContainer = styled.div`
    display: inline-block;
    margin: 20px;
`

function renderPlayer(game?: Game, socket?: SocketIOClient.Socket) {
    let terrain = game?.players?.find(p => p.id == socket?.id)?.terrain;
    if (!terrain) return undefined;
    return <PlayerContainer>{new Terrain(terrain).render()}</PlayerContainer>;
}

function renderOtherPlayer(game?: Game, socket?: SocketIOClient.Socket) {
    let players = game?.players?.filter(p => p.id !== socket?.id);
    return players?.map(player => <PlayerContainer>{new Terrain(player.terrain).render(true)}</PlayerContainer>)
}

const Tetris = (props: { game?: Game, socket?: SocketIOClient.Socket }) => {
    const { game, socket } = props; 
    const isHost = game && socket && game?.host == socket?.id;
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(addPlayerToGame('testGame01'));
    }, [])

    return (
        <div>
            {renderPlayer(game, socket)}
            {renderOtherPlayer(game, socket)}
            {isHost && game?.players.every(p => !p.alive) && <button onClick={() => dispatch(launchGame())}>launch game</button>}
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