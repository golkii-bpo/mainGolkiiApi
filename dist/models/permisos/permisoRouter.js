const express = require('express');
const permisosRouter = express.Router();
const prmCtrl = require('./permisoController');
const errorHandler = require('../../middleware/errorHandler');
module.exports = permisosRouter;
permisosRouter
    .get('', errorHandler(prmCtrl.getBuscar))
    .get('/:idPermiso', errorHandler(prmCtrl.getBuscarById))
    .post('/', errorHandler(prmCtrl.postAgregar))
    .put('/:idPermiso', errorHandler(prmCtrl.putModificar))
    .delete('/:idPermiso', errorHandler(prmCtrl.delPermiso));
