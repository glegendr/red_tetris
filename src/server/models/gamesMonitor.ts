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

    const removePlayer = () => {
      this.games.forEach(g => {
        let index = g.players.findIndex(p => p.id == socket.id);
        if (index >= 0) {
          g.players.splice(index, 1);
        }
        if (g.host == socket.id) {
          g.host = g.players[0]?.id;
        }
        g.players.forEach(player => player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: g.short() }))
      })
      this.games = this.games.filter(g => g.host)
    }

    switch (action.type) {
      case 'GAME_MONITOR_LAUNCH_GAME': {
          let game: Game | undefined = this.games.find(g => g.host == socket.id);
  
          if (game) {
            game.launchGame(1000);
          }

          break;
      }
      case 'GAME_MONITOR_DISCONNECT_PLAYER':
        removePlayer();
        break;
      case 'GAME_MONITOR_ADD_PLAYER':
        removePlayer();
        let game: Game | undefined = this.games.find(g => g.name == action.payload);
        let player = new Player(socket);
        if (game) {
          game.addPlayer(player)
        } else {
          game = new Game(action.payload);
          game.addPlayer(player);
          this.games.push(game);
        }
        player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: game.short() });
        break;
    }
  };
}