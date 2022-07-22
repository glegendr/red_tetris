import Game from '@src/server/models/game';
import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../reducers';
import { useDispatch } from 'react-redux'
import { launchGame } from '../actions/socket';
import styled from 'styled-components';
import { Action } from '@src/common/actions';
import Player from '@src/server/models/player';

const PlayerContainer = styled.div`
    display: inline-block;
    margin: 20px;
`

function renderPlayer(game?: Game, socket?: SocketIOClient.Socket) {
    let player = game?.players?.find(p => p.id == socket?.id);
    if (!player) return undefined;

    return <PlayerContainer>{Player.fromShort(player).render()}</PlayerContainer>;
}

function renderOtherPlayer(game?: Game, socket?: SocketIOClient.Socket) {
    let players = game?.players?.filter(p => p.id !== socket?.id);
    return players?.map(player => <PlayerContainer>{Player.fromShort(player).render(true)}</PlayerContainer>)
}

const Tetris = (props: { game?: Game, socket?: SocketIOClient.Socket }) => {
    const { game, socket } = props;
    if (!game) return <></>
    const isHost = game && socket && game?.host == socket?.id;
    const dispatch: (act: Action) => void = useDispatch();

    function handleKey(event: React.KeyboardEvent<HTMLDivElement>) {
        switch (event.keyCode) {
            case 32:
                // Space
                dispatch({ type: 'SOCKET_FALL' });
                break;
            case 40:
            case 83:
                // Down
                dispatch({ type: 'SOCKET_MOVE_DOWN' });
                break;
            case 39:
            case 68:
                // Right
                dispatch({ type: 'SOCKET_MOVE_RIGHT' });
                break;
            case 37:
            case 65:
                // Left
                dispatch({ type: 'SOCKET_MOVE_LEFT' });
                break;
            case 38:
            case 87:
            case 69:
                // Up && E
                dispatch({ type: 'SOCKET_ROTATE_RIGHT' });
                break;
            case 81:
                // Q
                dispatch({ type: 'SOCKET_ROTATE_LEFT' });
                break;
        }
    }

    return (
        <div onKeyDown={handleKey} tabIndex={0}>
            {renderPlayer(game, socket)}
            {renderOtherPlayer(game, socket)}
            {isHost && !game?.running && <button onClick={() => dispatch(launchGame())}>launch game</button>}
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