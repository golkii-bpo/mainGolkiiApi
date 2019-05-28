"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
// import * as joi from 'joi-es';
const generalValidation_1 = require("../../helpers/generalValidation");
joi.objectid = require('joi-objectid')(joi);
const joiRuta = joi.object().keys({
    Colaborador: joi.objectid(),
    Descripcion: joi.string().min(0).max(255),
    Casos: joi.array().items(joi.string()).min(1),
    Kilometraje: joi.number().min(0).max(2000),
    Insumos: joi.string().valid('Gasolina', 'Pasaje'),
    FechaSalida: joi.date()
});
class RutaService extends generalValidation_1.default {
    valAgregar(_model) {
        //TODO: Hace falta validar el modelo de colaboradores
        return joi.validate(_model, joiRuta);
    }
}
exports.default = new RutaService;
