import { SOCKET_CONNECT } from "../actions/socket"

const reducer = (state = {} , action) => {
  switch(action.type){
    case SOCKET_CONNECT:
      return state
    default: 
      return state
  }
}

export default reducer

