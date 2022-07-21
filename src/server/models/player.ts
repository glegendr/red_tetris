import { Socket } from 'socket.io';
import Piece from './piece';
import Terrain from './terrain'

export default class Player {

    pieceIndex: number;
    piece?: [Piece, number, number];
    terrain: Terrain;
    id: string;
    socket: Socket;
    alive: boolean;

    constructor(socket: Socket) {
        // current piece index in Server's piece list
        this.pieceIndex = 0;

        // current piece and his position
        this.piece = undefined

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
            for (let i = this.piece[0].length - 1; i >= 0; i--) {
                if (this.piece[0].form[i].some(tile => tile)) {
                    if (this.piece[2] + i >= this.terrain.height || this.piece[0].form[i].some((tile, x) => tile && this.terrain.tiles[(this.piece?.[2] ?? 0) + i][(this.piece?.[1] ?? 0) + x] && !this.piece?.[0].form[i + 1]?.[x])) {
                        if (this.piece[2] == 0)
                            this.alive = false;
                        return true;
                    }
                }
            }
            if (this.piece[2] !== 0) {
                this.terrain.replacePiece(this.piece[0], this.piece[1], this.piece[2] - 1);
            }
            this.terrain.replacePiece(this.piece[0], this.piece[1], this.piece[2], this.piece[0].color);
            this.piece[2] += 1;
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
        this.piece = [...piece, 0];

    }
}