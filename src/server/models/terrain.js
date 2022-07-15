import React from 'react'
import styled from 'styled-components';

const Tile = styled.div`
    height: 30px;
    width: 30px;
    background-color: ${p => p.color};
    border-bottom: 1px solid;
    border-right: 1px solid;
    border-left: ${p => p.x == 0 ? '1px solid' : ''};
    border-top: ${p => p.y == 0 ? '1px solid' : ''};
`;


export default class Terrain {
    constructor(height, width) {
        if (width == undefined && height instanceof Object) {
            Object.assign(this, height);
            return
        }
        this.tiles = new Array(height).fill(new Array(width).fill(undefined));
        this.width = width;
        this.height = height;
    }

    render() {
        return this.tiles.map((row, y) => {
            let row_ret = row.reduce((acc, color, x) => {
                acc.push(<Tile key={`board[${x}][${y}]`} x={x} y={y} color={color}/>)
                return acc
            }, []);
            return <div style={{ display: 'flex' }}>{row_ret}</div>
        });
    }
}