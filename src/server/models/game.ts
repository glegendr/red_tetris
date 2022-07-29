import Piece from './piece';
import Player from './player';
import Timeout = NodeJS.Timeout;


export default class Game {

    name: string;
    players: Player[];
    pieces: [Piece, number][];
    host?: string;
    interval?: Timeout;
    speed: number;
    running: boolean;

    constructor(name: string) {
        // game's name
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

        // is game running
        this.running = false;

        // falling speed
        this.speed = 1000;
    }

    launchGame() {
        if (this.running) return
        this.running = true;
        let { piece, x } = Piece.genRandomPiece(10)
        this.pieces = [[piece, x]];

        for (let player of this.players) {
            player.reset(this.pieces[0]);
        }

        this.players.forEach(player => player.socket.emit('response', {
            type: 'SRV_UPDATE_GAME',
            payload: {
                players: this.players.map(p => p.short()),
                running: this.running,
                spectrum: player.alive ? player.getSpectrum() : undefined
            }
        }))

        this.interval = setInterval(() => {
            if (!this.running || this.players.filter(p => p.playing).every(p => !p.alive) || (this.players.filter(p => p.alive && p.playing).length == 1 && this.players.filter(p => p.playing).length > 1)) {
                this.running = false;
                clearInterval(this.interval);
                this.interval = undefined;
            }
            this.players.forEach(player => {
                if (player.alive) {
                    player.lock = false;
                    if (player.fall()) {
                        if (!player.alive) return;
                        player.pieceIndex += 1;
                        if (!this.pieces[player.pieceIndex]) {
                            let { piece, x } = Piece.genRandomPiece(10)
                            this.pieces.push([piece, x]);
                        }
                        player.piece = this.pieces[player.pieceIndex][0];
                        player.position = {
                            x: this.pieces[player.pieceIndex][1],
                            y: 0 - this.pieces[player.pieceIndex][0].getStartY()
                        }
                        if (player.hasError(0, 0)) {
                            player.alive = false;
                            player.piece = undefined;
                        }
                    }
                }
            });

            this.players.filter(p => p.playing && p.alive && p.lastDeleted > 0).forEach(player => {
                this.players.filter(p => p.playing && p.alive).forEach(player2 => {
                    if (player.id !== player2.id) {
                        player2.addLines(player.lastDeleted);
                    }
                })
                player.lastDeleted = 0;
            });

            this.players.forEach(player => player.socket.emit('response', {
                type: 'SRV_UPDATE_GAME',
                payload: {
                    players: this.players.map(p => p.short()),
                    running: this.running,
                    spectrum: player.alive ? player.getSpectrum() : undefined
                }
            }))
        }, this.speed);

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
            host: this.host,
            running: this.running,
            speed: this.speed
        }
    }

    resume() {
        return {
          name: this.name,
          players: this.players.map(p => p.name),
          running: this.running
        }
    }
}