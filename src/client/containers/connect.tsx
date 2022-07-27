import { Action } from "@src/common/actions";
import Game from "@src/server/models/game";
import * as React from "react"
import { connect, useDispatch } from "react-redux"
import styled from "styled-components";
import { addPlayerToGame } from "../actions/socket";
import { GlobalState } from "../reducers"
import { GameResume } from "../reducers/socket";

const Table = styled.table`
    text-align: center;
`

const Column = styled.td`
    color: #191919;
`
const ColumnTitle = styled.th`
    color: white;
    padding: 15px;
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

const LeftContainer = styled.div<{ expanded: boolean }>`
    width: ${p => p.expanded ? 100 : 49}vw;
    float: left;
    height: 100vh;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 30px;
    transition: 0.5s;
`

const RightContainer = styled.div<{ expanded: boolean }>`
    background-color: #cd4436;
    width: ${p => p.expanded ? 0 : 49}vw;
    float: right;
    height: 100vh;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    transition: 0.5s;
`

const InputAndTitle = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
`

const Input = styled.input`
    border-radius: 16px;
    padding: 5px;
    background-color: #cd4436;
    border: none;
    text-align: center;
    color: white;
    font-family: Segoe UI;
`

const CreateButton = styled.button`
    width: 175px;
    border-radius: 16px;
    border: none;
    height: 26px;
    margin-top: 30px;
`

const ConnectLobby = (props: { gameList?: GameResume[], game?: Game }): JSX.Element => {
    const { gameList, game } = props;
    if (game) return <></>

    const dispatch: (act: Action) => void = useDispatch();
    
    React.useEffect(() => dispatch({ type: 'SOCKET_GET_GAME_LIST' }), [])

    const [roomName, setRoomName] = React.useState<string>()
    const [playerName, setPlayerName] = React.useState<string>()

    const expanded = (gameList?.filter(resume => resume.name.includes(roomName ?? '')) ?? []).length == 0;
    return (
        <div>
            <LeftContainer expanded={expanded}>
                <img src='paper_plane_no_back.png'/>
                <InputAndTitle>
                    Room Name
                    <Input type='text' onChange={e => setRoomName(e.target.value)} value={roomName}/>
                </InputAndTitle>
                <InputAndTitle>
                    Player Name
                    <Input type='text' onChange={e => setPlayerName(e.target.value)} value={playerName}/>
                </InputAndTitle>
                <CreateButton
                    disabled={!roomName || roomName.length < 3 || ((playerName?.length ?? 4) < 3 && playerName !== '')}
                    onClick={() => {
                        if (roomName)
                            dispatch(addPlayerToGame(roomName, playerName));
                    }}
                >
                    create game
                </CreateButton>
            </LeftContainer>
            <RightContainer expanded={expanded}>
                {!expanded && (
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
                )}
            </RightContainer>
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