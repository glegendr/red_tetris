import React from 'react'
import { connect } from 'react-redux'

const Game = ({ piece }) => {
    return (
        <div>
            {...piece.form.map(col => <div>{...col.reduce((acc, full) => {
                if (full) {
                    acc.push('O')
                } else {
                    acc.push('.')
                }
                return acc
            }, [])}</div>)}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        piece: state.socket.piece,
    }
}

export default connect(mapStateToProps, null)(Game)  