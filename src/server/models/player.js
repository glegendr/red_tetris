import React from 'react'
import Terrain from './terrain'

export default class Player {
    constructor(socket) {
        // current piece index in Server's piece list
        this.pieceIndex = 0;

        // player's game terrain
        this.terrain = new Terrain(20, 10);

        // player's socket id
        this.id = socket.id;

        this.socket = socket;
    }

    render() {
        return this.terrain.render();
    }
}