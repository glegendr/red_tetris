function rand(max: number) {
    return Math.floor(Math.random() * max);
}

export default class Piece {
    form: boolean[][];
    length: number;
    color: string;

    constructor(pieceId: number = 0, rotationNb: number = 0) {

        // DEFINE PIECE
        switch (pieceId % 7) {
            // line
            case 0:
                this.form = [
                    [false, false, false, false],
                    [true, true, true, true],
                    [false, false, false, false],
                    [false, false, false, false]
                ]
                this.length = 4;
                this.color = '#00ffff';
                break;
            // Reverse L
            case 1:
                this.form = [
                    [true, false, false],
                    [true, true, true],
                    [false, false, false]
                ]
                this.length = 3;
                this.color = '#0000ff';
                break;
            // L
            case 2:
                this.form = [
                    [false, false, true],
                    [true, true, true],
                    [false, false, false]
                ]
                this.length = 3;
                this.color = '#ffaa00';
                break;
            // Square
            case 3:
                this.form = [
                    [true, true],
                    [true, true]
                ];
                this.length = 2;
                this.color = '#ffff00';
                break;
            // Reverse Z
            case 4:
                this.form = [
                    [false, true, true],
                    [true, true, false],
                    [false, false, false]
                ];
                this.length = 3;
                this.color = '#00ff00';
                break;
            // T
            case 5:
                this.form = [
                    [false, true, false],
                    [true, true, true],
                    [false, false, false]
                ];
                this.length = 3;
                this.color = '#9900ff';
                break;
            // Z
            default:
                this.form = [
                    [true, true, false],
                    [false, true, true],
                    [false, false, false]
                ];
                this.length = 3;
                this.color = '#ff0000';
                break;
        }

        // ROTATE PIECE
        for (let i = 0; i < rotationNb % 4; i++) {
            this.form = this.rotate().form;
        }
    }

    rotate(): Piece {
        let newPiece = new Piece();
        Object.assign(newPiece, this);
        let newForm: boolean[][] = [];
        for (let i = 0; i < this.length; i++) {
            for (let y = this.length - 1; y >= 0; y--) {
                if (newForm[i] == undefined) {
                    newForm[i] = [];
                }
                newForm[i].push(this.form[y][i]);
            }
        }
        newPiece.form = newForm;
        return newPiece;
    }

    rotateRev(): Piece {
        let newPiece = new Piece();
        Object.assign(newPiece, this);
        let newForm: boolean[][] = [];
        for (let i = this.length - 1; i >= 0; i--) {
            for (let y = 0; y < this.length; y++) {
                if (newForm[this.length - 1 - i] == undefined) {
                    newForm[this.length - 1 - i] = [];
                }
                newForm[this.length - 1 - i].push(this.form[y][i]);
            }
        }
        newPiece.form = newForm;
        return newPiece;
    }

    static genRandomPiece(width: number) {
        let piece = new Piece(rand(7), rand(4));
        let x = rand(width - 1);
        while (x + piece.length > width && x > 0) {
            x -= 1;
        }
        return {
            piece,
            x
        }
    }

    getEndY(): number {
        let i = this.length - 1;
        while (i > 0 && this.form[i].every(tile => !tile))
            --i;
        return i
    }

    getStartY(): number {
        let i = 0;
        while (i < this.length && this.form[i].every(tile => !tile))
            ++i;
        return i
    }

    getEndX(): number {
        return this.form.reduce((acc, row) => Math.max(acc, row.lastIndexOf(true)), 0)
    }

    getStartX(): number {
        return this.form.reduce((acc, row) => {
            let index = row.indexOf(true);
            if (index >= 0)
                return Math.min(acc, index)
            return acc
        }, this.length)
    }
}