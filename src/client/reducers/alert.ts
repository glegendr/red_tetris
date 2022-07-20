import { Action } from '@src/common/actions'
export type AlertState = {
  message?: string
}

const reducer = (state: AlertState = {} , action: Action): AlertState => {
  switch(action.type) {
    case 'ALERT_POP':
      return { message: action.payload }
    default: 
      return state
  }
}

export default reducer

