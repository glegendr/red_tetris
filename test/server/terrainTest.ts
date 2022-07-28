import Piece from "../../src/server/models/piece";
import Terrain from "../../src/server/models/terrain";

var assert = require('assert');
describe('Terrain', function () {
    describe('constructor', function () {
        it(`new Terrain(...)`, function () {
            const terrain = new Terrain(13, 10);
            assert.equal(terrain.width, 10);
            assert.equal(terrain.height, 13);
            assert.equal(terrain.tiles.length, 13);
            assert.equal(terrain.tiles[0].length, 10);
            
        })
    })
    
    const terrain = new Terrain(13, 10);

    describe('functions', function () {
        it(`render`, function () {
            assert.equal(terrain.render(false) !== undefined, true);
            assert.equal(terrain.render(true) !== undefined, true);
        })

        it(`replacePiece`, function () {
            terrain.replacePiece(new Piece(0, 0), 0, 0, 'red');
            assert.equal(terrain.tiles[1][0], 'red');
            assert.equal(terrain.tiles[1][1], 'red');
            assert.equal(terrain.tiles[1][2], 'red');
            assert.equal(terrain.tiles[1][3], 'red');
            assert.equal(terrain.tiles[1][4], null);
        })

        it(`deleteLines`, function () {
            terrain.deleteLines();
        })
    })

  
})