import { Socket } from "socket.io";
import Game from "../../src/server/models/game";
import Player from "../../src/server/models/player";

var assert = require('assert');
describe('Game', function () {
    describe('constructor', function () {
      it(`new Game('My game name')`, function () {
        const game = new Game('My game name');
        assert.equal(game.name, 'My game name');
        assert.equal(game.players.length, 0);
        assert.equal(game.pieces.length, 0);
        assert.equal(game.host, undefined);
        assert.equal(game.interval, undefined);
        assert.equal(game.running, false);
        assert.equal(game.speed, 1000);
      })
    })

    const game = new Game('My game name');

    describe('functions', function () {
        it(`addPlayer`, function () {
            game.addPlayer(new Player({ id: 'My super socket id' } as Socket, 'My player name'));
            assert.equal(game.host, 'My super socket id');
            assert.equal(JSON.stringify(game.players), JSON.stringify([new Player({ id: 'My super socket id' } as Socket, 'My player name')]));
        })

        it(`short`, function () {
            let res = game.short();
            assert.equal(res.name, 'My game name')
            assert.equal(res.host, 'My super socket id');
            assert.equal(res.pieces.length, 0);
            assert.equal(res.running, false);
            assert.equal(res.speed, 1000);
        })

        it(`resume`, function () {
            let res = game.resume();
            assert.equal(res.name, 'My game name')
            assert.equal(JSON.stringify(res.players), JSON.stringify(['My player name']))
            assert.equal(res.running, false);
        })

    })

})