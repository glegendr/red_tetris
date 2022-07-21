import { Socket } from 'socket.io';
import Piece from './piece';
import Terrain from './terrain'

type Position = {
    x: number;
    y: number;
}

export default class Player {

    pieceIndex: number;
    piece?: Piece;
    position: Position;
    terrain: Terrain;
    id: string;
    socket: Socket;
    alive: boolean;

    constructor(socket: Socket) {
        // current piece index in Server's piece list
        this.pieceIndex = 0;

        // current piece
        this.piece = undefined

        // current piece position
        this.position = { x: 0, y: 0 };

        // player's game terrain
        this.terrain = new Terrain(20, 10);

        // player's socket id
        this.id = socket.id;

        // socket.emit function
        this.socket = socket;

        // is the player alive
        this.alive = false;
    }

    fall(): boolean {
        if (this.piece) {
            for (let i = this.piece.length - 1; i >= 0; i--) {
                if (this.piece.form[i].some(tile => tile)) {
                    if (this.position.y + i >= this.terrain.height || this.piece.form[i].some((tile, x) => tile && this.terrain.tiles[this.position.y + i][this.position.x + x] && !this.piece?.form[i + 1]?.[x])) {
                        if (this.position.y == 0)
                            this.alive = false;
                        return true;
                    }
                }
            }
            if (this.position.y !== 0) {
                this.terrain.replacePiece(this.piece, this.position.x, this.position.y - 1);
            }
            this.terrain.replacePiece(this.piece, this.position.x, this.position.y, this.piece.color);
            this.position.y += 1;
        }
        return false
    }

    render() {
        return this.terrain.render()
    }

    short() {
        return {
            id: this.id,
            piece: this.piece,
            terrain: this.terrain,
            alive: this.alive
        }
    }

    reset(piece: [Piece, number]) {
        this.terrain = new Terrain(20, 10);
        this.alive = true;
        this.pieceIndex = 0;
        this.piece = piece[0]
        this.position = {
            x: piece[1],
            y: 0
        };
    }

    moveLeft() {
        if (this.piece) {
            let terrain = new Terrain(JSON.parse(JSON.stringify(this.terrain)));
            let x = this.position.x;
            let y = this.position.y;
            terrain.replacePiece(this.piece, x, y);
            terrain.replacePiece(this.piece, x - 1, y, this.piece.color);
            this.terrain = terrain;
            this.position.x -= 1;
        }
    }

    moveRight() {
        if (this.piece) {
            let terrain = new Terrain(JSON.parse(JSON.stringify(this.terrain)));
            let x = this.position.x;
            let y = this.position.y;
            terrain.replacePiece(this.piece, x, y);
            terrain.replacePiece(this.piece, x + 1, y, this.piece.color);
            this.terrain = terrain;
            this.position.x += 1;
        }
    }
}