import Game from "./game";
import Player from './player'

export const GAME_MONITOR_ADD_PLAYER = 'GAME_MONITOR_ADD_PLAYER';

export default class GamesMonitor {

  games: Game[];

  constructor() {
    // list of all games
    this.games = [];
  }

  dispatch(action, socket) {
    switch (action.type) {
      case GAME_MONITOR_ADD_PLAYER:
        let game: Game | undefined = this.games.find(g => g.name == action.gameName);
        if (game) {
          game.addPlayer(new Player(socket.id, socket.emit))
          break;
        }
        let newGame = new Game(action.gameName);
        newGame.addPlayer(new Player(socket.id, socket.emit));
        this.games.push(newGame);
        break;
    }
    console.log(this);
  };
}