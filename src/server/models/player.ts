import Piece from './piece';
import Terrain from './terrain'

export default class Player {

    pieceIndex: number;
    piece?: [Piece, number, number];
    terrain: Terrain;
    id: string;
    emit: (eventName: string | symbol, ...args: any[]) => boolean;
    alive: boolean;

    constructor(id: string, emit: (eventName: string | symbol, ...args: any[]) => boolean) {
        // current piece index in Server's piece list
        this.pieceIndex = 0;

        // current piece and his position
        this.piece = undefined

        // player's game terrain
        this.terrain = new Terrain(20, 10);

        // player's socket id
        this.id = id;

        // socket.emit function
        this.emit = emit;

        // is the player alive
        this.alive = true;
    }

    render() {
        return this.terrain.render()
    }
}