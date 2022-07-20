import { Action } from "@src/common/actions";
import { Socket } from "socket.io";
import Game from "./game";
import Player from './player'

export default class GamesMonitor {

  games: Game[];

  constructor() {
    // list of all games
    this.games = [];
  }

  dispatch(action: Action, socket: Socket) {
    switch (action.type) {
      case 'GAME_MONITOR_ADD_PLAYER':
        let game: Game | undefined = this.games.find(g => g.name == action.payload);
        if (game) {
          game.addPlayer(new Player(socket.id, socket.emit))
          break;
        }
        let newGame = new Game(action.payload);
        newGame.addPlayer(new Player(socket.id, socket.emit));
        this.games.push(newGame);
        break;
    }
    console.log(this);
  };
}