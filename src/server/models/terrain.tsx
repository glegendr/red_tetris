import * as React from 'react'
import styled from 'styled-components';

const Tile = styled.div<{ color: string, x: number, y: number}>`
    height: 30px;
    width: 30px;
    background-color: ${p => p.color};
    border-bottom: 1px solid;
    border-right: 1px solid;
    border-left: ${p => p.x == 0 ? '1px solid' : ''};
    border-top: ${p => p.y == 0 ? '1px solid' : ''};
`;


export default class Terrain {

    height: number;
    width: number;
    tiles: string[][];

    constructor(height?: number | Object, width?: number) {
        if (height instanceof Object) {
            this.width = width ?? 10;
            this.height = 20;
            this.tiles = new Array(this.height).fill(new Array(this.width).fill(undefined));
            Object.assign(this, height);
            return
        }
        this.tiles = new Array(height).fill(new Array(width).fill(undefined));
        this.width = width ?? 10;
        this.height = height ?? 20;
    }

    render() {
        return this.tiles.map((row, y) => {
            let row_ret = row.reduce((acc: JSX.Element[], color, x) => {
                acc.push(<Tile key={`board[${x}][${y}]`} x={x} y={y} color={color}/>);
                return acc;
            }, []);
            return <div style={{ display: 'flex' }}>{row_ret}</div>
        });
    }
}