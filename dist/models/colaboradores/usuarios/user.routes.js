const express = require('express'), usrCtrl = require('./user.controller'), errorHandler = require('../../../middleware/errorHandler'), useRouter = express.Router();
useRouter
    .post('/:idColaborador/agregar/', errorHandler(usrCtrl.postAgregarUsuario))
    .put('/:idColaborador/modificar', errorHandler(usrCtrl.putModUser))
    .put('/:idColaborador/usuario/cambio/username', errorHandler(usrCtrl.putModUserName))
    .put('/:idColaborador/usuario/cambio/pwd', errorHandler(usrCtrl.putChangePwd))
    .put('/:idColaborador/usuario/cambio/pwd', errorHandler(usrCtrl.putDisableUser));
module.exports = useRouter;
