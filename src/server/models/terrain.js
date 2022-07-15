import React from 'react'

export default class Terrain {
    constructor(height, width) {
        this.tiles = new Array(height).fill(new Array(width).fill(undefined));
        this.width = width;
        this.height = height;
    }

    render() {
        let ret = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                ret.push(<div key={`board[${x}][${y}]`} style={{ height: 20, width: 20, backgroundColor: this.form[y][x] ? this.color : undefined, border: '1px solid black' }}/>);
            }
        }
        return ret
    }
}