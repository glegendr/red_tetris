import alertReducer from '../../src/client/reducers/alert';
import socketReducer from '../../src/client/reducers/socket';
import Game from '../../src/server/models/game'

var assert = require('assert');
describe('Reducer', function () {
    it(`Alert`, function () {
        let res = alertReducer(undefined, { type: 'GAME_MONITOR_SET_GAME_SPEED' });
        assert.equal(JSON.stringify(res), JSON.stringify({}));
        res = alertReducer(undefined, { type: 'ALERT_POP', payload: 'my message' });
        assert.equal(res.message, 'my message');
    })
    it('Socket', function () {
        let res = socketReducer(undefined, { type: 'GAME_MONITOR_SET_GAME_SPEED' });
        assert.equal(res.gameList.length, 0);
        assert.equal(res.tick, 0);
        assert.equal(res.refresh, 0);
        assert.equal(res.refreshmentRate, 3);
        res = socketReducer(undefined, { type: 'SET_REFRESHMENT_RATE', payload: 10 });
        assert.equal(res.refreshmentRate, 10);
        res = socketReducer(undefined, { type: 'SET_GAMEPAD', payload: 3 });
        assert.equal(res.gamepad, 3);
        res = socketReducer(undefined, { type: 'SOCKET_CONNECT' });
        res = socketReducer(undefined, { type: 'SRV_EMIT_GAME', payload: new Game('my game name').short() });
        assert.equal(res.game.name, 'my game name');
        assert.equal(res.game.players.length, 0);
        res = socketReducer(undefined, { type: 'SRV_EMIT_GAME_LIST', payload: [] });
        assert.equal(res.gameList.length, 0);
        res = socketReducer(undefined, { type: 'SRV_EMIT_PLAYER_CHANGES', payload: { spectrum: 13 } });
        assert.equal(res.game, undefined);
        assert.equal(res.spectrum, 13);
        res = socketReducer(undefined, { type: 'SRV_UPDATE_GAME', payload: { spectrum: 2 } });
        assert.equal(res.spectrum, 2);
        assert.equal(res.tick, 1);
        assert.equal(res.refresh, true);
    })
})