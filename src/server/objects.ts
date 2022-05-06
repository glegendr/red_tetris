type Game = {
    players: Player[],
    room: string,
    pieceHistory: Piece[]
}

type Piece = {
    turnLeft: (p: Piece) => Piece,
    turnRight: (p: Piece) => Piece,
    piece: Tile[4][4]
}

type Player = {
    board: Tile[10][20],
    name: string,
    status: boolean,
    score: number,
    master: boolean,
    landedPieces: number
}

type Tile = 'red' | 'blue' | 'orange' | 'yellow' | 'green' | 'purple' | 'rose' | 'empty'