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

    let game: Game | undefined = this.games.find(g => g.players.some(p => p.id == socket.id));
    let player: Player | undefined = undefined;
    switch (action.type) {
      case 'GAME_MONITOR_LAUNCH_GAME': {
          game = this.games.find(g => g.host == socket.id);
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
          game = this.games.find(g => g.name == action.payload);
          player = new Player(socket);
          if (game) {
            game.addPlayer(player)
          } else {
            game = new Game(action.payload);
            game.addPlayer(player);
            this.games.push(game);
          }
          player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: game.short() });
          break;
      case 'GAME_MONITOR_MOVE_LEFT':
        player = game?.players.find(p => p.id == socket.id);
        if (!game || !game.running || !player || !player.alive) break;
        player.moveLeft();
        player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: game.short() });
        break;
      case 'GAME_MONITOR_MOVE_RIGHT':
        player = game?.players.find(p => p.id == socket.id);
        if (!game || !game.running || !player || !player.alive) break;
        player.moveRight();
        player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: game.short() });
        break;
        break;
      case 'GAME_MONITOR_ROTATE_RIGHT':
        break;
      case 'GAME_MONITOR_ROTATE_LEFT':
        break;
    }
  };
}