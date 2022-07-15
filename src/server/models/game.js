import React from 'react'
import Piece from './piece';
import { SOCKET_START_GAME_RES } from '../../client/actions/socket';

function rand(max) {
    return Math.floor(Math.random() * max);
}

export default class Game {
    constructor() {
        // list of all players
        this.players = [];

        // all pieces stocked here
        // [Piece, StartingColumn][]
        this.pieces = [];

        // host id
        this.host = undefined;

        // falling timeout
        this.timeout = undefined;
    }

    launchGame(time) {
        this.pieces = [[new Piece(rand(7), rand(4)), rand(10)]];

        const falling = () => {
            setTimeout(() => {
                for (let player of this.players) {
                    if (player.alive) {
                        player.piece[2] += 1;
                    }
                }

                for (let player of this.players) {
                    console.log(player);
                    player.emit('action', { type: SOCKET_START_GAME_RES, game: { ...this } })
                }

                falling();
            }, time);
        }

        for (let player of this.players) {
            player.pieceIndex = 0;
            player.piece = [...this.pieces[0], 0]
        }
        falling();
    }

    addPlayer(player) {
        this.players.push(player);
        if (!this.host) {
            this.host = player.id;
        }
    }
}