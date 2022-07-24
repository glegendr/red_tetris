import { Action } from '@src/common/actions'
import Game from '@src/server/models/game'
import * as React from 'react'
import { connect, useDispatch } from 'react-redux'
import { addPlayerToGame } from '../actions/socket'
import { GlobalState } from '../reducers'
import Connect from './connect'
import Tetris from './tetris'

const App = (props: { game?: Game }) => {
  
  const dispatch: (act: Action) => void = useDispatch();
  
  React.useEffect(() => {
    const onHashChanged = () => {
      const hash = new URL(document.URL).hash;
      console.log(hash);
      let { room, name } = hash.split('').reduce((acc: {room: string, name?: string, isName: boolean}, char) => {
        if (char == '[') {
          if (acc.isName)
            acc.room += '['
          acc.isName = true;
          acc.room += acc.name ?? '';
          acc.name = undefined;
        } else if (acc.isName) {
          if (acc.name == undefined)
            acc.name = '';
          acc.name += char;
        } else {
          acc.room += char;
        }
        return acc
      }, {room: '', isName: false});
      if (name?.slice(-1) == ']') {
        name = name.slice(0, -1);
      }
      if (name == '') {
        name = undefined;
      }
      room = room.slice(1);
      console.log(room, name);
      if (room.length >= 3 && (!name || name.length >= 3))
        dispatch(addPlayerToGame(room, name));
    };
    onHashChanged();


    window.addEventListener("hashchange", onHashChanged);

    return () => {
        window.removeEventListener("hashchange", onHashChanged);
    };
  }, []);

  return (
    <span>
      <Connect />
      <Tetris />
    </span>
  )
}

const mapStateToProps = (state: GlobalState) => {
  return {
    game: state.socket.game
  }
}

export default connect(mapStateToProps, null)(App)  