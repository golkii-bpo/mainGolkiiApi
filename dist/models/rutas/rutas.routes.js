"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const rutas_controller_1 = require("./rutas.controller");
const errorHandler_1 = require("../../middleware/errorHandler");
exports.rutaRoutes = express.Router();
exports.rutaRoutes
    .get('/', errorHandler_1.default(rutas_controller_1.default.getObtener))
    .get('/registros', errorHandler_1.default(rutas_controller_1.default.getModelTotal))
    .get('/:idRuta', errorHandler_1.default(rutas_controller_1.default.getObtenerById))
    .get('/:fechaInicio/:fechaFinal', errorHandler_1.default(rutas_controller_1.default.getObtenerFecha))
    .post('/', errorHandler_1.default(rutas_controller_1.default.postAgregar))
    .put('/:idRuta/Modificar', errorHandler_1.default(rutas_controller_1.default.putModificar))
    .put('/:idRuta/Alta', errorHandler_1.default(rutas_controller_1.default.putDarAlta))
    .delete('/:idRuta/Baja', errorHandler_1.default(rutas_controller_1.default.deleteDarBaja));
