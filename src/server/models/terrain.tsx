import * as React from 'react'
import styled from 'styled-components';
import Piece from './piece';
import { Position } from './player';

const Tile = styled.div<{ color?: string, x: number, y: number, other?: boolean, alive: boolean }>`
    height: ${p => p.other ? 10 : 25}px;
    width: ${p => p.other ? 10 : 25}px;
    background-color: ${p => p.color ? p.alive ? p.color : '#919191' :'black'};
    border-bottom: 2px solid #171717;
    border-right: 2px solid #171717;
    border-left: ${p => p.x == 0 ? '2px solid #171717' : ''};
    border-top: ${p => p.y == 0 ? '2px solid #171717' : ''};
`;


export default class Terrain {

    height: number;
    width: number;
    tiles: (string | undefined)[][];

    constructor(height?: number | Object, width?: number) {
        if (height instanceof Object) {
            this.width = width ?? 10;
            this.height = 20;
            this.tiles = new Array(this.height);
            Object.assign(this, height);
            return
        }
        this.width = width ?? 10;
        this.height = height ?? 20;
        this.tiles = new Array(this.height);
        for (let i = 0; i < this.height; i++) {
            this.tiles[i] = new Array(this.width).fill(undefined);
        }
    }

    render(alive: boolean, pieceInfo?: { piece?: Piece, position: Position }, other?: boolean) {
        return this.tiles.map((row, y) => {
            let row_ret = row.reduce((acc: JSX.Element[], color, x) => {
                if (!color && pieceInfo?.piece) {
                    if (pieceInfo.piece.form[y - pieceInfo.position.y]?.[x - pieceInfo.position.x])
                    color = pieceInfo.piece.color;
                }
                acc.push(<Tile key={`board[${x}][${y}]`} x={x} y={y} color={color} other={other} alive={alive}/>);
                return acc;
            }, []);
            return <div style={{ display: 'flex' }}>{row_ret}</div>
        });
    }

    replacePiece(piece: Piece, x: number, y: number, by?: string) {
        piece.form.forEach((row, loc_y) => {
            row.forEach((tile, loc_x) => {
                if (tile) {
                    // @ts-ignore
                    this.tiles[y + loc_y][x + loc_x] = by ?? null;
                }
            })
        });

    }

    deleteLines(): number {
        let newTiles = this.tiles.filter(row => row.some(tile => tile == undefined))
        let score = ((this.height - newTiles.length) ** 2) * this.width
        while (newTiles.length < this.height)
            newTiles.unshift(new Array(this.width).fill(undefined));
        this.tiles = newTiles;
        return score
    }
}