import { Action, ActionType } from "@src/common/actions";
import { Socket } from "socket.io";
import Game from "./game";
import Player from './player'

export default class GamesMonitor {

  games: Game[];
  dandlingSocket: Socket[];
  playerMap: Map<string, number>;

  constructor() {
    // list of all games
    this.games = [];

    // list of dandling Sockets
    this.dandlingSocket = []

    // map of socketId and guestId
    this.playerMap = new Map();
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

    const emitPlayerChange = (player: Player, game: Game, playerIndex: number) => {
      player.socket.emit('response', {
        type: 'SRV_EMIT_PLAYER_CHANGES' as ActionType,
        payload: {
            player: player.short(),
            index: playerIndex
          }
      })
    }

    let game: Game | undefined = this.games.find(g => g.players.some(p => p.id == socket.id));
    let player: Player | undefined = undefined;
    let playerIndex: number = -1;
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
        if (this.playerMap.get(socket.id) == undefined)
          this.playerMap.set(socket.id, this.playerMap.size + 1);
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
        player = new Player(socket, payload.playerName ?? `guest-${this.playerMap.get(socket.id)}`);
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
        playerIndex = game?.players.findIndex(p => p.id == socket.id) ?? -1; 
        if (playerIndex == -1 || !game?.players[playerIndex].alive) break;
        game.players[playerIndex].placePiece();
        emitPlayerChange(game.players[playerIndex], game, playerIndex);
        break;
      case 'GAME_MONITOR_MOVE_DOWN':
        playerIndex = game?.players.findIndex(p => p.id == socket.id) ?? -1; 
        if (playerIndex == -1 || !game?.players[playerIndex].alive) break;
        game.players[playerIndex].moveDown();
        emitPlayerChange(game.players[playerIndex], game, playerIndex);
        break;
      case 'GAME_MONITOR_MOVE_LEFT':
        player = game?.players.find(p => p.id == socket.id);
        if (!game || !game.running || !player || !player.alive) break;
        player.moveLeft();
        player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: game.short() });
        break;
      case 'GAME_MONITOR_MOVE_RIGHT':
        playerIndex = game?.players.findIndex(p => p.id == socket.id) ?? -1; 
        if (playerIndex == -1 || !game?.players[playerIndex].alive) break;
        game.players[playerIndex].moveRight();
        emitPlayerChange(game.players[playerIndex], game, playerIndex);
        break;
      case 'GAME_MONITOR_ROTATE_RIGHT':
        playerIndex = game?.players.findIndex(p => p.id == socket.id) ?? -1; 
        if (playerIndex == -1 || !game?.players[playerIndex].alive) break;
        game.players[playerIndex].rotate();
        emitPlayerChange(game.players[playerIndex], game, playerIndex);
        break;
      case 'GAME_MONITOR_ROTATE_LEFT':
        playerIndex = game?.players.findIndex(p => p.id == socket.id) ?? -1; 
        if (playerIndex == -1 || !game?.players[playerIndex].alive) break;
        game.players[playerIndex].rotateRev();
        emitPlayerChange(game.players[playerIndex], game, playerIndex);
        break;
    }
  };
}