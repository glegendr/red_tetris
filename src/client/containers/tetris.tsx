import Game from '@src/server/models/game';
import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../reducers';
import { useDispatch } from 'react-redux'
import { launchGame } from '../actions/socket';
import styled from 'styled-components';
import { Action } from '@src/common/actions';
import Player from '@src/server/models/player';

const PlayerContainer = styled.div<{float?: string}>`
    display: inline-block;
    float: ${p => p.float};
    margin: 10px;
    background-color: #919191;
    padding: 0 10px;
    border-radius: 15px;
    color: white;
`

const Panels = styled.div<{ single?: boolean }>`
    float: right;
    width: 33%;
    ${p => p.single && `
        display: flex;
        justify-content: center;
    `}
    
`
const CenteredText = styled.div<{isTitle?: boolean}>`
    text-align: center;
    font-weight: ${p => p.isTitle ? 600 : 500};
`
const Tile = styled.div<{ color?: string, x: number, y: number, other?: boolean, alive: boolean }>`
    height: ${p => p.other ? 10 : 25}px;
    width: ${p => p.other ? 10 : 25}px;
    background-color: ${p => p.color ? p.alive ? p.color : '#919191' :'black'};
    border-bottom: 2px solid #171717;
    border-right: 2px solid #171717;
    border-left: ${p => p.x == 0 ? '2px solid #171717' : ''};
    border-top: ${p => p.y == 0 ? '2px solid #171717' : ''};
    border-radius: 3px;
`;

const Row = styled.div`
    display: flex;
    background-color: #171717;
`

function renderPlayer2(player: Player, other?: boolean, float?: string) {
    return <PlayerContainer float={float}>
    <div>
        <CenteredText isTitle>{other ? player.name : 'You'}</CenteredText>
        {...player.terrain.tiles.map((row, y) => {
        let row_ret = row.reduce((acc: JSX.Element[], color, x) => {
            if (!color && player.piece) {
                if (player.piece.form[y - player.position.y]?.[x - player.position.x])
                color = player.piece.color;
            }
            acc.push(<Tile key={`board[${x}][${y}]`} x={x} y={y} color={color} other={other} alive={player.alive}/>);
            return acc;
        }, []);
        return <Row>{row_ret}</Row>
        })}
        <CenteredText isTitle>Score</CenteredText>
        <CenteredText>{player.score}</CenteredText>
    </div>
    </PlayerContainer>
}

function renderPlayer(game?: Game, socket?: SocketIOClient.Socket) {
    let player = game?.players?.find(p => p.id == socket?.id && p.playing);
    if (!player) return undefined;
    return renderPlayer2(player)
    
}

function renderOtherPlayer(game?: Game, socket?: SocketIOClient.Socket): [JSX.Element[], JSX.Element[]] | undefined {
    let players = game?.players?.filter(p => p.id !== socket?.id && p.playing);
    if (!players) return undefined
    let half = Math.ceil(players.length / 2);
    const firstHalf = players.slice(0, half)
    const secondHalf = players.slice(half)
    return [firstHalf.map(player => renderPlayer2(player, true, 'right')), secondHalf.map(player => renderPlayer2(player, true, 'left'))]
}

const Tetris = (props: { game?: Game, socket?: SocketIOClient.Socket, refresh?: number }) => {
    const { game, socket, refresh } = props;
    if (!game) return <></>

    React.useEffect(() => {
        if (game && socket) {
            var url_ob = new URL(document.URL);
            url_ob.hash = `#${game.name}[${game.players.find(p => p.id == socket.id)?.name}]`;
            // new url
            var new_url = url_ob.href;

            // change the current url
            document.location.href = new_url;
        }
    }, [game]);

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
    let otherPlayers = React.useMemo(() => renderOtherPlayer(game, socket), [refresh])

    return (
        <div onKeyDown={handleKey} tabIndex={0}>
            <Panels>
                {otherPlayers?.[1]}
            </Panels>
            <Panels single>
                {renderPlayer(game, socket)}
            </Panels>
            <Panels>
                {otherPlayers?.[0]}
            </Panels>
            {isHost && !game?.running && <button onClick={() => dispatch(launchGame())}>launch game</button>}
        </div>
    )
}

const mapStateToProps = (state: GlobalState) => {
    return {
        game: state.socket.game,
        refresh: state.socket.refresh,
        socket: state.socket.socket
    }
}

export default connect(mapStateToProps, null)(Tetris)  