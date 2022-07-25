import Piece from "../../src/server/models/piece";

var assert = require('assert');
describe('Piece', function () {
    describe('constructor', function () {
        it(`new Piece(...)`, function () {
            const piece = new Piece(5, 2);
            assert.equal(piece.color, '#9900ff')
            assert.equal(piece.length, 3)
            assert.equal(JSON.stringify(piece.form), JSON.stringify([
                [false, false, false],
                [true, true, true],
                [false, true, false]
            ]))
        })
    })
    
    const piece = new Piece(5, 2);
    describe('functions', function () {
        it(`genRandomPiece`, function () {
            let randPiece = Piece.genRandomPiece(3);
            assert.equal(randPiece.piece.length !== undefined, true)
            assert.equal(randPiece.piece.form !== undefined, true)
            assert.equal(randPiece.piece.color !== undefined, true)
            assert.equal(randPiece.x >= 0 && randPiece.x < 3, true)
        })

        it(`getStartX`, function () {
            assert.equal(piece.getStartX(), 0);
        })

        it(`getEndY`, function () {
            assert.equal(piece.getEndY(), 2);
        })

        it(`getEndX`, function () {
            assert.equal(piece.getEndX(), 2);
        })

        it(`rotate`, function () {
            let rotated = piece.rotate();
            assert.equal(rotated.color, piece.color);
            assert.equal(rotated.length, piece.length);
            assert.equal(JSON.stringify(rotated.form), JSON.stringify([
                [false, true, false],
                [true, true, false],
                [false, true, false]
            ]));
        })

        it(`rotateRev`, function () {
            let rotated = piece.rotateRev();
            assert.equal(rotated.color, piece.color);
            assert.equal(rotated.length, piece.length);
            assert.equal(JSON.stringify(rotated.form), JSON.stringify([
                [false, true, false],
                [false, true, true],
                [false, true, false]
            ]));
        })
    })

})