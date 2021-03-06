import Game from '@src/server/models/game';
import * as React from 'react'
import { connect } from 'react-redux'
import { GlobalState } from '../reducers';
import { useDispatch } from 'react-redux'
import { launchGame } from '../actions/socket';
import styled from 'styled-components';
import { Action } from '@src/common/actions';
import Player from '@src/server/models/player';
import Gamepad from 'react-gamepad'

const PlayerContainer = styled.div<{ float?: string }>`
    display: inline-block;
    float: ${p => p.float};
    margin: 10px;
    background-color: #cd4436;
    padding: 0 10px;
    border-radius: 15px;
    color: white;
`

const Panel = styled.div<{ single?: boolean }>`
    width: 33%;
    min-height: 500px;
    ${p => p.single && `
        display: flex;
        justify-content: center;
    `}
    
`
const CenteredText = styled.div<{ isTitle?: boolean }>`
    text-align: center;
    font-weight: ${p => p.isTitle ? 600 : 500};
`
const Tile = styled.div<{ color?: string, x: number, y: number, other?: boolean, alive: boolean, spectrum?: string }>`
    height: ${p => p.other ? 10 : 25}px;
    width: ${p => p.other ? 10 : 25}px;
    background-color: ${p => p.color ? p.alive ? p.color : '#cd4436' : 'black'};
    border-bottom: 2px solid #171717;
    border-right: 2px solid #171717;
    border-left: ${p => p.x == 0 ? '2px solid #171717' : ''};
    border-top: ${p => p.y == 0 ? '2px solid #171717' : ''};
    border-radius: 3px;
    ${p => p.spectrum && `
        box-shadow: ${p.x !== 0 ? `-2px 0px 0px 0px ${p.spectrum},` : ''} 0px -2px 0px 0px ${p.spectrum};
        border-left: ${p.x == 0 && `2px solid ${p.spectrum}`};
        border-right: 2px solid ${p.spectrum};
        border-bottom: 2px solid ${p.spectrum};
    `}
`;

const Row = styled.div`
    display: flex;
    background-color: #171717;
`

const HostButton = styled.button<{ play?: boolean }>`
    position: absolute;
    left: calc(50%);
    top: calc(50% ${p => p.play ? '-' : '+'} 35px);
    transform: translate(-50%,-50%);
    height: 60px;
    width: 200px;
    background-color: ${p => p.play ? '#00f200' : '#cd4436'};
    border: none;
    border-radius: 15px;
    color: white;
    font-weight: 600;
    font-size: 25px;
    cursor: pointer;
`

function renderPlayer2(player: Player, other?: boolean, float?: string, spectrum?: number) {
    return <PlayerContainer float={float}>
        <div>
            <CenteredText isTitle>{other ? player.name : 'You'}</CenteredText>
            {...player.terrain.tiles.map((row, y) => {
                let row_ret = row.reduce((acc: JSX.Element[], color, x) => {
                    let border = undefined;
                    if (!color && player.piece) {
                        if (player.piece.form[y - player.position.y]?.[x - player.position.x])
                            color = player.piece.color;
                        else if (spectrum && player.piece.form[y - spectrum]?.[x - player.position.x])
                            border = player.piece.color;
                    }
                    acc.push(<Tile key={`board[${x}][${y}]`} x={x} y={y} color={color} other={other} alive={player.alive} spectrum={border} />);
                    return acc;
                }, []);
                return <Row>{row_ret}</Row>
            })}
            <CenteredText isTitle>Score</CenteredText>
            <CenteredText>{player.score}</CenteredText>
        </div>
    </PlayerContainer>
}

function renderPlayer(game?: Game, socket?: SocketIOClient.Socket, spectrum?: number) {
    let player = game?.players?.find(p => p.id == socket?.id);
    if (!player) return undefined;
    return renderPlayer2(player, undefined, undefined, spectrum)

}

function renderOtherPlayer(game?: Game, socket?: SocketIOClient.Socket): [JSX.Element[], JSX.Element[]] | undefined {
    let players = game?.players?.filter(p => p.id !== socket?.id);
    if (!players) return undefined
    let half = Math.ceil(players.length / 2);
    const firstHalf = players.slice(0, half)
    const secondHalf = players.slice(half)
    return [firstHalf.map(player => renderPlayer2(player, true, 'right')), secondHalf.map(player => renderPlayer2(player, true, 'left'))]
}


function checkEscapePressed(dispatch: (act: Action) => void, openOptions: () => void) {

    const handleKey = React.useCallback((event: any) => {
        switch (event.keyCode) {
            case 27:
                openOptions();
                break;
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
    }, []);

    React.useEffect(() => {
        document.addEventListener('keydown', handleKey);

        return () => {
            document.removeEventListener('keydown', handleKey);
        };
    }, [handleKey]);
}

function Tetris(props: { game?: Game, socket?: SocketIOClient.Socket, refresh?: number, refreshmentRate?: number, spectrum?: number, gamepad?: number }) {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [localTimeout, setLocalTimeout] = React.useState<NodeJS.Timeout | undefined>(undefined);
    const { game, socket, refresh, spectrum } = props;

    let otherPlayers = React.useMemo(() => renderOtherPlayer(game, socket), [refresh, game?.players.length])
    const isHost = game && socket && game?.host == socket?.id;
    const dispatch: (act: Action) => void = useDispatch();

    checkEscapePressed(dispatch, () => setIsOpen(!isOpen));

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

    if (!game) return <></>


    return (
        <Gamepad
            gamepadIndex={props.gamepad}
            onAxisChange={(stickName, value) => {
                clearInterval(localTimeout);
                switch (stickName) {
                    case 'LeftStickX':
                    case 'RightStickX':
                        if (value > 0.5) {
                            dispatch({ type: 'SOCKET_MOVE_RIGHT' });
                            setLocalTimeout(setInterval(() => { dispatch({ type: 'SOCKET_MOVE_RIGHT' }); }, 100))
                        } else if (value < -0.5) {
                            dispatch({ type: 'SOCKET_MOVE_LEFT' });
                            setLocalTimeout(setInterval(() => { dispatch({ type: 'SOCKET_MOVE_LEFT' }); }, 100))
                        }
                        return
                    case 'LeftStickY':
                    case 'RightStickY':
                        if (value < -0.5) {
                            dispatch({ type: 'SOCKET_MOVE_DOWN' });
                            setLocalTimeout(setInterval(() => { dispatch({ type: 'SOCKET_MOVE_DOWN' }); }, 100))
                        }
                        return
                }
            }}
            onButtonDown={(buttonName) => {
                console.log(buttonName);
                switch (buttonName) {
                    case 'Start':
                        setIsOpen(!isOpen);
                        return
                    case 'A':
                    case 'B':
                    case 'X':
                    case 'Y':
                        if (game?.running) {
                            dispatch({ type: 'SOCKET_FALL' });
                        } else if (isHost) {
                            dispatch(launchGame());
                        }
                        return
                    case 'RT':
                    case 'RB':
                        dispatch({ type: 'SOCKET_ROTATE_RIGHT' });
                        return
                    case 'LT':
                    case 'LB':
                        dispatch({ type: 'SOCKET_ROTATE_LEFT' });
                        return
                    case 'DPadLeft':
                        dispatch({ type: 'SOCKET_MOVE_LEFT' });
                        return
                    case 'DPadRight':
                        dispatch({ type: 'SOCKET_MOVE_RIGHT' });
                        return
                    case 'DPadUp':
                        dispatch({ type: 'SOCKET_ROTATE_RIGHT' });
                        return
                    case 'DPadDown':
                        dispatch({ type: 'SOCKET_MOVE_DOWN' });
                        return

                }
            }}
        >
            <div>
                <div style={{
                    display: ' flex',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    <Panel>
                        {otherPlayers?.[0]}
                    </Panel>
                    <Panel single>
                        {renderPlayer(game, socket, spectrum)}
                    </Panel>
                    <Panel>
                        {otherPlayers?.[1]}
                    </Panel>
                {isHost && !isOpen && !game?.running && <HostButton onClick={() => dispatch(launchGame())} play>PLAY</HostButton>}
                {!isOpen && !game?.running && <HostButton onClick={() => setIsOpen(true)}>OPTIONS</HostButton>}
                </div>
                <PopUp
                    isOpen={isOpen}
                    toggle={() => setIsOpen(!isOpen)}
                    refreshmentRate={props.refreshmentRate ?? 3}
                    speed={game?.speed ?? 1000}
                    gamepad={props.gamepad ?? 0}
                    isHost={isHost ?? false}
                />
            </div>
        </Gamepad>
    )
}

const PopUpContainer = styled.div`
    position: absolute;
    background-color: white;
    top: 50%;
    left: calc(50% + 7px);
    min-height: 250px;
    width: 500px;
    transform: translate(-50%,-50%);
    text-align: center;
    padding: 20px; 
`

const OkButton = styled.button`
    height: 35px;
    width: 75px;
    background-color: #00f200;
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
`

const RadioContainer = styled.div`
    display: flex;
    flex-grow: inherit;
    justify-content: space-between;
    width: 75%;
    padding: 20px 7%;
    border-bottom: 1px black solid;
    margin: 20px 5.5%;
`

const Radio = styled.input`

`

const RadioContainer2 = styled.div`
`

function PopUp(props: {
    isOpen: boolean,
    toggle: () => void,
    refreshmentRate: number,
    speed: number,
    isHost: boolean,
    gamepad: number
}): JSX.Element {
    const dispatch: (act: Action) => void = useDispatch();
    const speedList = [
        { value: 1000, label: '1s' },
        { value: 750, label: '0.75s' },
        { value: 500, label: '0.5s' },
        { value: 250, label: '0.25s' },
        { value: 100, label: '0.1s' },
    ]

    const refrehmentList = [
        { value: 1, label: 'All' },
        { value: 2, label: '1/2' },
        { value: 3, label: '1/3' },
        { value: 5, label: '1/5' },
        { value: 10, label: '1/10' },
    ]

    const gamepadList = [
        { value: 0, label: '0' },
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
    ]
    return <PopUpContainer hidden={!props.isOpen}>
        {props.isHost && (
            <>
                Speed
                {/* @ts-ignore */}
                <RadioContainer onChange={e => dispatch({ type: 'SOCKET_SET_GAME_SPEED', payload: e.target.value })}>
                    {speedList.map(({ value, label }) =>
                        <RadioContainer2 >
                            <Radio type="radio" value={value} name="speed" checked={props.speed == value} key={`speed[${value}]`} /> {label}
                        </RadioContainer2>
                    )}
                </RadioContainer>
            </>
        )}
        Refreshement
        {/* @ts-ignore */}
        <RadioContainer onChange={e => dispatch({ type: 'SET_REFRESHMENT_RATE', payload: e.target.value })}>
            {refrehmentList.map(({ value, label }) =>
                <RadioContainer2 >
                    <Radio type="radio" value={value} name="refreshment" checked={props.refreshmentRate == value} key={`refreshment[${value}]`} /> {label}
                </RadioContainer2>
            )}
        </RadioContainer>
        Controller
        {/* @ts-ignore */}
        <RadioContainer onChange={e => dispatch({ type: 'SET_GAMEPAD', payload: e.target.value })}>
            {gamepadList.map(({ value, label }) =>
                <RadioContainer2 >
                    <Radio type="radio" value={value} name="gamepad" checked={props.gamepad == value} key={`gamepad[${value}]`} /> {label}
                </RadioContainer2>
            )}
        </RadioContainer>
        <OkButton onClick={props.toggle}>Ok</OkButton>
    </PopUpContainer>
}

const mapStateToProps = (state: GlobalState) => {
    return {
        game: state.socket.game,
        refresh: state.socket.refresh,
        socket: state.socket.socket,
        refreshmentRate: state.socket.refreshmentRate,
        spectrum: state.socket.spectrum,
        gamepad: state.socket.gamepad
    }
}

export default connect(mapStateToProps, null)(Tetris)  