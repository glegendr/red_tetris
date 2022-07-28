import { Socket } from "socket.io";
import Piece from "../../src/server/models/piece";
import Player from "../../src/server/models/player";
import Terrain from "../../src/server/models/terrain";

var assert = require('assert');
describe('Player', function () {
    describe('constructor', function () {
        it(`new Player(...)`, function () {
            const player = new Player({ id: 'My super socket id' } as Socket, 'My player name');
            assert.equal(player.name, 'My player name');
            assert.equal(player.pieceIndex, 0);
            assert.equal(player.piece, undefined);
            assert.equal(player.position.x, 0);
            assert.equal(player.position.y, 0);
            assert.equal(JSON.stringify(player.terrain), JSON.stringify(new Terrain(20, 10)));
            assert.equal(player.id, 'My super socket id');
            assert.equal(JSON.stringify(player.socket), JSON.stringify({ id: 'My super socket id' }));
            assert.equal(player.alive, false);
            assert.equal(player.playing, false);
            assert.equal(player.score, 0);
        })
    })
    
    const player = new Player({ id: 'My super socket id' } as Socket, 'My player name');
    const {piece, x} = Piece.genRandomPiece(2);
    x;
    player.piece = piece;

    describe('functions', function () {
        it(`render`, function () {
            assert.equal(player.render() !== undefined, true);
        })

        it(`short`, function () {
            const res = {...player.short()};
            assert.equal(res.id, 'My super socket id');
            assert.equal(JSON.stringify(res.piece), JSON.stringify(piece));
            assert.equal(JSON.stringify(res.position), JSON.stringify(player.position));
            assert.equal(JSON.stringify(res.terrain), JSON.stringify({tiles: player.terrain.tiles}));
            assert.equal(res.alive, false);
            assert.equal(res.playing, false);
            assert.equal(res.score, player.score);
            assert.equal(res.name, 'My player name');
        })
    })

    it(`moveRight`, function () {
        const position = {...player.position};
        player.moveRight();
        assert.equal(player.position.x, position.x + 1);
    })

    it(`moveLeft`, function () {
        const position = {...player.position};
        player.moveLeft();
        assert.equal(player.position.x, position.x - 1);
    })

    it(`moveDown`, function () {
        const position = {...player.position};
        player.moveDown();
        assert.equal(player.position.y, position.y + 1);
    })

    it(`placePiece`, function () {
        const position = {...player.position};
        player.placePiece();
        assert.equal(player.position.y > position.y, true);
        assert.equal(player.score > 0, true);
    })

    it(`rotate`, function () {
        let piece = new Piece();
        Object.assign(piece, player.piece);
        player.rotate()
        // assert.equal(JSON.stringify(player.piece), JSON.stringify(piece.rotate()));
    })

    it(`rotateRev`, function () {
        let piece = new Piece();
        Object.assign(piece, player.piece);
        player.rotateRev()
        // assert.equal(JSON.stringify(player.piece), JSON.stringify(piece.rotateRev()));
    })
})