import { Action } from "@src/common/actions";
import { Socket } from "socket.io";
import Game from "./game";
import Player from './player'

export default class GamesMonitor {

  games: Game[];
  dandlingSocket: Socket[];

  constructor() {
    // list of all games
    this.games = [];

    // list of dandling Sockets
    this.dandlingSocket = []
  }

  emitDandlingSocket(action: Action) {
    this.dandlingSocket.forEach(socket => socket.emit('response', action))
  }

  dispatch(action: Action, socket: Socket) {

    const removePlayer = () => {
      this.dandlingSocket = this.dandlingSocket.filter(dandling => dandling.id !== socket.id);
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
      case 'GAME_MONITOR_GET_GAME_LIST':
        socket.emit('response', { type: 'SRV_EMIT_GAME_LIST', payload: this.games.map(game => game.resume())});
        break;
      case 'GAME_MONITOR_LAUNCH_GAME': {
        game = this.games.find(g => g.host == socket.id);
        if (game) {
          game.launchGame(500);
          this.emitDandlingSocket({ type: 'SRV_EMIT_GAME_LIST', payload: this.games.map(game => game.resume())});
        }
        break;
      }
      case 'GAME_MONITOR_CONNECT_PLAYER':
        this.dandlingSocket.push(socket);
        break;
      case 'GAME_MONITOR_DISCONNECT_PLAYER':
        removePlayer();
        this.emitDandlingSocket({ type: 'SRV_EMIT_GAME_LIST', payload: this.games.map(game => game.resume())});
        break;
      case 'GAME_MONITOR_ADD_PLAYER':
        let payload: { gameName: string, playerName?: string } = action.payload;
        removePlayer();
        game = this.games.find(g => g.name == payload.gameName);
        player = new Player(socket, payload.playerName ?? `Player[${(game?.players.length ?? 0) + 1}]`);
        if (game) {
          game.addPlayer(player)
        } else {
          game = new Game(payload.gameName);
          game.addPlayer(player);
          this.games.push(game);
        }
        game?.players.forEach(player => game && player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: game.short() }));
        this.emitDandlingSocket({ type: 'SRV_EMIT_GAME_LIST', payload: this.games.map(game => game.resume())});
        break;
      case 'GAME_MONITOR_FALL':
        player = game?.players.find(p => p.id == socket.id);
        if (!game || !game.running || !player || !player.alive) break;
        player.placePiece();
        player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: game.short() });
        break;
      case 'GAME_MONITOR_MOVE_DOWN':
        player = game?.players.find(p => p.id == socket.id);
        if (!game || !game.running || !player || !player.alive) break;
        player.moveDown();
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
      case 'GAME_MONITOR_ROTATE_RIGHT':
        player = game?.players.find(p => p.id == socket.id);
        if (!game || !game.running || !player || !player.alive) break;
        player.rotate();
        player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: game.short() });
        break;
      case 'GAME_MONITOR_ROTATE_LEFT':
        player = game?.players.find(p => p.id == socket.id);
        if (!game || !game.running || !player || !player.alive) break;
        player.rotateRev();
        player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: game.short() });
        break;
    }
  };
}