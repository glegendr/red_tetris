import Piece from './piece';
import Player from './player';
import Timeout = NodeJS.Timeout;

function rand(max: number) {
    return Math.floor(Math.random() * max);
}

export default class Game {

    name: string;
    players: Player[];
    pieces: [Piece, number][];
    host?: string;
    interval?: Timeout;

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
    }

    launchGame(time?: number) {
        this.pieces = [[new Piece(rand(7), rand(4)), rand(10)]];

        for (let player of this.players) {
            player.pieceIndex = 0;
            player.piece = [...this.pieces[0], 0]
        }

        this.interval = setInterval(() => {
            this.players.forEach(p => {
                if (p.alive) {
                    console.log("DISPATCH")
                }
            });
        }, time ?? 500);
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