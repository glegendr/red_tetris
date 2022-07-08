export default class Piece {
    constructor(pieceId, rotationNb) {
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
                break;
            // Reverse L
            case 1:
                this.form = [
                    [true, false, false],
                    [true, true, true],
                    [false, false, false]
                ]
                this.length = 3;
                break;
            // L
            case 2:
                this.form = [
                    [true, false, false],
                    [true, true, true],
                    [false, false, false]
                ]
                this.length = 3;
                break;
            // Square
            case 3:
                this.form = [
                    [true, true],
                    [true, true]
                ];
                this.length = 2;
                break;
            // Reverse Z
            case 4:
                this.form = [
                    [false, true, true],
                    [true, true, false],
                    [false, false, false]
                ];
                this.length = 3;
                break;
            // T
            case 5:
                this.form = [
                    [false, true, false],
                    [true, true, true],
                    [false, false, false]
                ];
                this.length = 3;
                break;
            // Z
            case 6:
                this.form = [
                    [true, true, false],
                    [false, true, true],
                    [false, false, false]
                ];
                this.length = 3;
                return
        }

        // ROTATE PIECE
        for (let i = 0; i < rotationNb % 4; i++) {
            this.form = this.rotate();
        }
    }

    rotate() {
        let newForm = [];
        for (let i = 0; i < this.length; i++) {
            for (let y = this.length - 1; y >= 0; y--) {
                if (newForm[i] == undefined) {
                    newForm[i] = [];
                }
                newForm[i].push(this.form[y][i]);
            }
        }
        return newForm;
    }
}