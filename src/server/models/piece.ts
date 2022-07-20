export default class Piece {

    form: boolean[][];
    length: number;
    color: string;

    constructor(pieceId: number, rotationNb: number) {

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
                    [true, false, false],
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
            this.form = this.rotate();
        }
    }

    rotate() {
        let newForm: boolean[][] = [];
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