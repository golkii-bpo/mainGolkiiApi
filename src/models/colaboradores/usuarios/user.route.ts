import * as express from 'express';
import usrCtrl from './user.controller';
import errorHandler from '../../../middleware/errorHandler';
const 
    userRouter = express.Router();

userRouter
.post('/:idColaborador/agregar/',errorHandler(usrCtrl.postAgregarUsuario))
.put('/:idColaborador/modificar',errorHandler(usrCtrl.putModUser))
.put('/:idColaborador/usuario/cambio/username',errorHandler(usrCtrl.putModUserName))
.put('/:idColaborador/usuario/cambio/pwd',errorHandler(usrCtrl.putChangePwd))
.put('/:idColaborador/usuario/cambio/pwd',errorHandler(usrCtrl.putDisableUser))
.post('/password/reset',errorHandler(usrCtrl.postForggotPwd))
// .post('')

export {userRouter};
