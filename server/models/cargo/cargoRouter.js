const express = require('express');
const cargoController = require('./cargoController');
const errorHandler = require('../../middleware/errorHandler');
const cargoRoute = express.Router();

module.exports = cargoRoute;

cargoRoute
.get('/',errorHandler(cargoController.getObtener))
.get('/:idCargo',errorHandler(cargoController.getBuscarById))
.get('/:idCargo/Permisos',errorHandler(cargoController.getPermisosById))
.post('/',errorHandler(cargoController.postAgregar))
.put('/:idCargo',errorHandler(cargoController.putModificar))
.put('/:idCargo/Permiso/Agregar',errorHandler(cargoController.putAgregarPermisos))
.put('/:idCargo/Permiso/:idPermiso/Eliminar',errorHandler(cargoController.putEliminarPermiso))
.put('/:idCargo/Alta',errorHandler(cargoController.putDarAlta))
.delete('/:idCargo/Baja',errorHandler(cargoController.deleteDarBaja));