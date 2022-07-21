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
        this.alive = true;
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
}