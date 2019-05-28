const express = require('express');
const colaboradorCtrl = require('./colaborador.controller');
const colaboradorRouter = express.Router();
const errHandler = require('../../../middleware/errorHandler');

colaboradorRouter
.get('/',errHandler(colaboradorCtrl.getObtener))
.post('/',errHandler(colaboradorCtrl.postAgregar))
.put('/:idColaborador/General',errHandler(colaboradorCtrl.putModificarGeneral))
.put('/:idColaborador/Cargo/:idCargo/Agregar',errHandler(colaboradorCtrl.putAgregarCargo))
.put('/:idColaborador/Cargo/:idCargo/Eliminar',errHandler(colaboradorCtrl.putEliminarCargo))
.put('/:idColaborador/Permiso/:idPermiso/Agregar',errHandler(colaboradorCtrl.putAgregarPermiso))
.put('/:idColaborador/Permiso/:idPermiso/Eliminar',errHandler(colaboradorCtrl.putEliminarPermiso));

module.exports = colaboradorRouter;
