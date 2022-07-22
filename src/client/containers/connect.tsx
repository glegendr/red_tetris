import { Action } from "@src/common/actions";
import Game from "@src/server/models/game";
import * as React from "react"
import { connect, useDispatch } from "react-redux"
import styled from "styled-components";
import { addPlayerToGame } from "../actions/socket";
import { GlobalState } from "../reducers"
import { GameResume } from "../reducers/socket";

const Table = styled.table`
    border: 1px solid #333;
    text-align: center;
`

const Column = styled.td`
    border: 1px solid #333;
`
const ColumnTitle = styled.th`
    border: 1px solid #333;
    background-color: #333;
    color: white;
`

const Loader = styled.div`
    	content: ' ';
    	display: block;
    	width: 15px;
    	height: 15px;
    	margin: auto;
    	border-radius: 50%;
    	border: 2px solid #fff;
    	border-color: black transparent black transparent;
    	animation: lds-dual-ring 1.2s linear infinite;
    	@keyframes lds-dual-ring {
    	    0% {
    	        transform: rotate(0deg);
    	    }
    	    100% {
    	        transform: rotate(360deg);
    	    }
    	}
`

const ConnectLobby = (props: { gameList?: GameResume[], game?: Game }): JSX.Element => {
    const { gameList, game } = props;
    if (game) return <></>

    const dispatch: (act: Action) => void = useDispatch();
    
    React.useEffect(() => dispatch({ type: 'SOCKET_GET_GAME_LIST' }), [])

    const [roomName, setRoomName] = React.useState<string>()
    const [playerName, setPlayerName] = React.useState<string>()

    return (
        <div>
            <input type='text' onChange={e => setRoomName(e.target.value)} value={roomName}/>
            <input type='text' onChange={e => setPlayerName(e.target.value)} value={playerName}/>
            <button
                disabled={!roomName || roomName.length < 3 || (playerName?.length ?? 4) < 3}
                onClick={() => {
                    if (roomName)
                        dispatch(addPlayerToGame(roomName, playerName));
                }}
            >
                create game
            </button>
            <Table>
                <thead>
                    <tr>
                        <ColumnTitle>
                            game name
                        </ColumnTitle>
                        <ColumnTitle>
                            player nb
                        </ColumnTitle>
                        <ColumnTitle>
                            running
                        </ColumnTitle>
                    </tr>
                </thead>
                <tbody>
                    {gameList?.filter(resume => resume.name.includes(roomName ?? '')).map(resume => {
                        return <tr
                            onClick={() =>  dispatch(addPlayerToGame(resume.name, playerName))}
                            style={{ cursor: 'pointer' }}
                        >
                            <Column>
                                {resume.name}
                            </Column>
                            <Column>
                                {resume.players.length}
                            </Column>
                            <Column>
                                {resume.running ? <Loader /> : <></>}
                            </Column>
                        </tr>
                    })}
                </tbody>
            </Table>
        </div>
    )
}

const mapStateToProps = (state: GlobalState) => {
    return {
        gameList: state.socket.gameList,
        game: state.socket.game
    }
}

export default connect(mapStateToProps, null)(ConnectLobby)  