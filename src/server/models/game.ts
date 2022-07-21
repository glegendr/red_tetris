import Piece from './piece';
import Player from './player';
import Timeout = NodeJS.Timeout;


export default class Game {

    name: string;
    players: Player[];
    pieces: [Piece, number][];
    host?: string;
    interval?: Timeout;
    running: boolean;

    constructor(name: string) {
        this.name = name;

        // list of all players
        this.players = [];

        // all pieces stocked here
        // [Piece, StartingColumn][]
        this.pieces = [];

        // host id
        this.host = undefined;

        // falling timeout
        this.interval = undefined;

        this.running = false;
    }

    launchGame(time?: number) {
        if (this.running) return
        this.running = true;
        let { piece, x } = Piece.genRandomPiece(10)
        this.pieces = [[piece, x]];

        for (let player of this.players) {
            player.reset(this.pieces[0]);
            // player.alive = true;
            // player.pieceIndex = 0;
            // player.piece = [...this.pieces[0], 0]
        }

        this.interval = setInterval(() => {
            if (this.players.every(p => !p.alive)) {
                this.running = false;
                clearInterval(this.interval);
                this.interval = undefined;
            }
            this.players.forEach(player => {
                if (player.alive) {
                    if (player.fall()) {
                        player.pieceIndex += 1;
                        if (!this.pieces[player.pieceIndex]) {
                            let { piece, x } = Piece.genRandomPiece(10)
                            this.pieces.push([piece, x]);
                        }
                        player.piece = [...this.pieces[player.pieceIndex], 0];
                    }
                }
            });
            this.players.forEach(player => player.socket.emit('response', { type: 'SRV_EMIT_GAME', payload: this.short() }))
        }, 100);

    }

    addPlayer(player: Player) {
        this.players.push(player);
        if (!this.host) {
            this.host = player.id;
        }
    }

    short() {
        return {
            name: this.name,
            players: this.players.map(p => p.short()),
            pieces: this.pieces,
            host: this.host
        }
    }
}