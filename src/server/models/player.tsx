import { Socket } from 'socket.io';
import Piece from './piece';
import Terrain from './terrain'
import * as React from 'react'
import styled from 'styled-components';

export type Position = {
    x: number;
    y: number;
}

const CenteredText = styled.div<{isTitle?: boolean}>`
    text-align: center;
    font-weight: ${p => p.isTitle ? 600 : 500};
`

export default class Player {

    pieceIndex: number;
    piece?: Piece;
    position: Position;
    terrain: Terrain;
    id: string;
    socket: Socket;
    alive: boolean;
    playing: boolean;
    score: number;
    name: string;

    constructor(socket: Socket, name: string) {
        // current piece index in Server's piece list
        this.pieceIndex = 0;

        // current piece
        this.piece = undefined

        // current piece position
        this.position = { x: 0, y: 0 };

        // player's game terrain
        this.terrain = new Terrain(20, 10);

        // player's socket id
        this.id = socket.id;

        // socket.emit function
        this.socket = socket;

        // is the player alive
        this.alive = false;

        // is the player playing
        this.playing = false;

        // player current score
        this.score = 0;

        // player name
        this.name = name;
    }

    fall(): boolean {
        if (this.piece) {
            this.position.y += 1;
            for (let i = this.piece.length - 1; i >= 0; i--) {
                if (this.piece.form[i].some(tile => tile)) {
                    if (this.position.y + i >= this.terrain.height || this.piece.form[i].some((tile, x) => tile && this.terrain.tiles[this.position.y + i][this.position.x + x])) {
                        this.terrain.replacePiece(this.piece, this.position.x, this.position.y - 1, this.piece.color);
                        if (this.position.y == 1)
                            this.alive = false;
                        else
                            this.score += this.terrain.deleteLines();
                        return true;
                    }
                }
            }
        }
        return false
    }

    render(other?: boolean) {
        return <div>
            <CenteredText isTitle>{other ? this.name : 'You'}</CenteredText>
            {this.terrain.render(this.alive, { piece: this.piece, position: this.position }, other)}
            <CenteredText isTitle>Score</CenteredText>
            <CenteredText>{this.score}</CenteredText>
        </div>
    }

    short() {
        return {
            id: this.id,
            piece: this.piece,
            position: this.position,
            terrain: { tiles: this.terrain.tiles },
            alive: this.alive,
            playing: this.playing,
            score: this.score,
            name: this.name
        }
    }

    reset(piece: [Piece, number]) {
        this.terrain = new Terrain(this.terrain.height, this.terrain.width);
        this.alive = true;
        this.pieceIndex = 0;
        this.piece = piece[0]
        this.position = {
            x: piece[1],
            y: 0
        };
        this.score = 0;
        this.playing = true;
    }

    private hasError(moveX: number, moveY: number) {
        if (this.piece) {
            return this.piece.form.reduce((acc, row, y) => {
                return acc || row.reduce((acc, tile, x) => {
                    let posX = this.position.x + x + moveX;
                    let posY = this.position.y + y + moveY;
                    return acc || (tile && (posY > this.terrain.height - 1 || posY < 0 || posX > this.terrain.width - 1 || posX < 0 || this.terrain.tiles[posY][posX] !== undefined))
                }, false);
            }, false);
        }
        return true
    }

    moveLeft() {
        if (!this.hasError(-1, 0)) {
            this.position.x -= 1;
        }
    }

    moveRight() {
        if (!this.hasError(1, 0)) {
            this.position.x += 1;
        }
    }

    moveDown() {
        if (!this.hasError(0, 1)) {
            this.score += 1;
            this.position.y += 1;
        }
    }

    placePiece() {
        let i = 0;
        while (!this.hasError(0, 1)) {
            this.position.y += 1;
            i += 1;
        }
        this.score += i * 2
    }

    rotate() {
        if (this.piece) {
            this.piece = this.piece.rotate();
            while (this.piece.getEndX() + this.position.x > this.terrain.width - 1)
                this.position.x -= 1;
            while (this.piece.getStartX() + this.position.x < 0)
                this.position.x += 1;
            while (this.piece.getEndY() + this.position.y > this.terrain.height)
                this.position.y -= 1;
        }
    }

    rotateRev() {
        if (this.piece) {
            this.piece = this.piece.rotateRev();
            while (this.piece.getEndX() + this.position.x > this.terrain.width - 1)
                this.position.x -= 1;
            while (this.piece.getStartX() + this.position.x < 0)
                this.position.x += 1;
            while (this.piece.getEndY() + this.position.y > this.terrain.height)
                this.position.y -= 1;
        }
    }
}