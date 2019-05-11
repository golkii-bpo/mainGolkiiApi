const express = require('express');
const colaboradorCtrl = require('./colaborador.Controller');
const colaboradorRouter = express.Router();
const errHandler = require('../../middleware/errorHandler');

module.exports = colaboradorRouter;

colaboradorRouter
.get('/',errHandler(colaboradorCtrl.getObtener))
.post('/',errHandler(colaboradorCtrl.postAgregar))
.put('/:idColaborador/General',errHandler(colaboradorCtrl.putModificarGeneral))
.put('/:idColaborador/Cargo/:idCargo/Agregar',errHandler(colaboradorCtrl.putAgregarCargo))
.put('/:idColaborador/Cargo/:idCargo/Eliminar',errHandler(colaboradorCtrl.putEliminarCargo));