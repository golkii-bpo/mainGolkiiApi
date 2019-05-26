const express = require('express'), colRouter = express.Router(), generalRouter = require('./general/colaborador.routes'), usuarioRouter = require('./usuarios/user.routes');
colRouter.use('/general', generalRouter);
colRouter.use('/user', usuarioRouter);
module.exports = colRouter;
