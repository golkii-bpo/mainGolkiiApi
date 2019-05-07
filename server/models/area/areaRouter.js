const express = require('express');
const areaRouter = express.Router();
const areaController = require('./areaController');
const errorHandler = require('../../middleware/errorHandler');

module.exports = areaRouter;

areaRouter
.get('',areaController.getObtener)
.get('/:IdArea',areaController.getBuscarById)
.post('/',areaController.postAgregar)
.put('/:IdArea',areaController.putModificar)
.put('/:IdArea/DarBaja',areaController.putDarBaja)
.put('/:IdArea/DarAlta',areaController.putDarAlta);