import Terrain from './terrain'

export default class Player {

    constructor(id_or_json, emit) {
        if (id_or_json instanceof Object) {
            Object.assign(this, id_or_json);
            return
        }

        // current piece index in Server's piece list
        this.pieceIndex = 0;

        // current piece and his position
        this.piece = undefined

        // player's game terrain
        this.terrain = new Terrain(20, 10);

        // player's socket id
        this.id = id_or_json;

        // socket.emit function
        this.emit = emit;

        // is the player alive
        this.alive = true;
    }

    render() {
        return new Terrain(this.terrain).render()
    }
}