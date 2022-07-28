import { alert } from '../../src/client/actions/alert';
import { addPlayerToGame, launchGame, ping } from '../../src/client/actions/socket';


var assert = require('assert');
describe('Action', function () {
    describe('Alert', function () {
        it(`alert`, function () {
            let res = alert('MyMessage');
            assert.equal(res.type, 'ALERT_POP');
            assert.equal(res.payload, 'MyMessage');
        })
    })
    describe('Socket', function () {
        it(`ping`, function () {
            let res = ping();
            assert.equal(res.type, 'SOCKET_PING');
        })

        it(`launchGame`, function () {
            let res = launchGame();
            assert.equal(res.type, 'SOCKET_LAUNCH_GAME');
        })

        it(`addPlayerToGame`, function () {
            let res = addPlayerToGame('game name', 'player name');
            assert.equal(res.type, 'SOCKET_JOIN_GAME');
            assert.equal(res.payload.gameName, 'game name');
            assert.equal(res.payload.playerName, 'player name');
        })
    })
})