import React from 'react'
import Piece from './piece';

function rand(max) {
    return Math.floor(Math.random() * max);
}

export default class Game {
    constructor() {
        // list of all players
        this.players = [];

        // all pieces stocked here
        // [Piece, StartingColumn][]
        this.pieces = [[new Piece(rand(7), rand(4)), rand(10)]];

        // host id
        this.host = undefined;
    }

    addPlayer(player) {
        this.players.push(player);
        if (!this.host) {
            this.host = player.id;
        }
    }
}