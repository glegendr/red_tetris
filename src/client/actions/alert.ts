import { Action } from "@src/common/actions"

export const ALERT_POP = 'ALERT_POP'

export const alert = (message: string): Action => {
  return {
    type: ALERT_POP,
    payload: message
  }
}

