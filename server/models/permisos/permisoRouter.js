const express = require('express');
const permisosRouter = express.Router();
const permisoController = require('./permisoController');
const errorHandler = require('../../middleware/errorHandler');

module.exports = permisosRouter;

permisosRouter
.get('',errorHandler(permisoController.getBuscar))
.get('/:idPermiso',errorHandler(permisoController.getBuscarById))
.post('/',errorHandler(permisoController.postAgregar))
.put('/:idPermiso',errorHandler(permisoController.putModificar))
.put('/:idPermiso/darBaja',errorHandler(permisoController.putDarBaja))
.put('/:idPermiso/darAlta',errorHandler(permisoController.putDarAlta));