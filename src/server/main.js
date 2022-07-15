import params  from '../../params'
import * as server from './index'
server.create(params.server).then( res => console.log(res) )
