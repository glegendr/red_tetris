import GamesMonitor from '../../src/server/models/gamesMonitor'
import Piece from '../../src/server/models/piece';

var assert = require('assert');
describe('Game monitor', function () {

  let emit: (response: any) => void = () => {};
  describe('constructor', function () {
    it('new GamesMonitor()', function () {
      const gamesMonitor = new GamesMonitor();
      assert.equal(gamesMonitor.dandlingSocket.length, 0);
      assert.equal(gamesMonitor.games.length, 0);
      assert.equal(gamesMonitor.playerMap.size, 0);
    })
  })

  const gamesMonitor = new GamesMonitor();
  const socket: any = {
    emit,
    id: 'mySuperSocketId',
  };

  describe('dispatch', function () {

    it('GAME_MONITOR_CONNECT_PLAYER', function () {
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_CONNECT_PLAYER' }, socket)
      assert.equal(gamesMonitor.dandlingSocket[0]?.id, 'mySuperSocketId');
    })

    it('GAME_MONITOR_ADD_PLAYER', function () {
      socket.emit = (...resp: any[]) => {
        assert.equal(resp?.[1]?.payload?.name, 'salut');
        assert.equal(resp?.[1]?.payload?.players.length, 1);
        assert.equal(resp?.[1]?.payload?.host, 'mySuperSocketId');
        assert.equal(resp?.[1]?.payload?.running, false);
        assert.equal(resp?.[1]?.payload?.speed, 1000);
      }
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_ADD_PLAYER', payload: { gameName: 'salut', name: 'mySuperName' } }, socket)
    });

    it('GAME_MONITOR_SET_GAME_SPEED', function () {
      socket.emit = (...resp: any[]) => {
        assert.equal(resp?.[1]?.payload?.speed, 500);
      }
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_SET_GAME_SPEED', payload: 500 }, socket)
    });

    it('GAME_MONITOR_GET_GAME_LIST', function () {
      socket.emit = (...resp: any[]) => {
        assert.equal(JSON.stringify(resp?.[1]?.payload), JSON.stringify([ { name: 'salut', players: [ 'guest-1' ], running: false } ]));
      }
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_GET_GAME_LIST' }, socket)
    });

    it('GAME_MONITOR_LAUNCH_GAME', function () {
      socket.emit = (...resp: any[]) => {}
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_LAUNCH_GAME' }, socket)
    });


    it('GAME_MONITOR_MOVE_DOWN', function () {
      let positions = {...gamesMonitor.games[0].players[0].position};
      socket.emit = (...resp: any[]) => {
        assert.equal(resp[1].payload.player.position.y, positions.y + 1)
      }
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_MOVE_DOWN' }, socket)
    });
    
    it('GAME_MONITOR_MOVE_RIGHT', function () {
      gamesMonitor.games[0].players[0].position.x = 5;
      let positions = {...gamesMonitor.games[0].players[0].position};
      socket.emit = (...resp: any[]) => {
        assert.equal(resp[1].payload.player.position.x, positions.x + 1)
      }
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_MOVE_RIGHT' }, socket)
    });
    
    it('GAME_MONITOR_MOVE_LEFT', function () {
      gamesMonitor.games[0].players[0].position.x = 5;
      let positions = {...gamesMonitor.games[0].players[0].position};
      socket.emit = (...resp: any[]) => {
        assert.equal(resp[1].payload.player.position.x, positions.x - 1)
      }
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_MOVE_LEFT' }, socket)
    });
    
    it('GAME_MONITOR_ROTATE_RIGHT', function () {
      let piece = new Piece();
      Object.assign(piece, gamesMonitor.games[0].players[0].piece);
      socket.emit = (...resp: any[]) => {
        assert.equal(JSON.stringify(resp[1].payload.player.piece), JSON.stringify(piece.rotate()))
      }
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_ROTATE_RIGHT' }, socket)
    });
    
    it('GAME_MONITOR_ROTATE_LEFT', function () {
      let piece = new Piece();
      Object.assign(piece, gamesMonitor.games[0].players[0].piece);
      socket.emit = (...resp: any[]) => {
        assert.equal(JSON.stringify(resp[1].payload.player.piece), JSON.stringify(piece.rotateRev()))
      }
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_ROTATE_LEFT' }, socket)
    });

    it('GAME_MONITOR_DISCONNECT_PLAYER', function () {
      gamesMonitor.dispatch({ type: 'GAME_MONITOR_DISCONNECT_PLAYER' }, socket)
    })

  });
});
