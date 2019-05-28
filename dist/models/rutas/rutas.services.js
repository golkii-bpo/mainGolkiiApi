"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const joi = require("joi");
// import * as joi from 'joi-es';
const basicValidations_1 = require("../../helpers/validation/basicValidations");
const msgHandler_1 = require("../../helpers/resultHandler/msgHandler");
class RutaService extends basicValidations_1.default {
    constructor() {
        super(...arguments);
        this.joiInsumos = joi.object().keys({
            Tipo: joi.string().required(),
            Observacion: joi.string().min(10).max(50),
            Valor: joi.number().required().min(0).max(5000),
            Kilometro: joi.number().min(0).max(2000)
        });
        this.joiRuta = joi.object().keys({
            Colaborador: joi.string(),
            Descripcion: joi.string().min(0).max(255),
            Casos: joi.array().items(joi.string()).min(1),
            Insumos: joi.array().items(this.joiInsumos),
            FechaSalida: joi.date()
        });
        this.joiPostRuta = this.joiRuta;
        this.joiPutRuta = this.joiRuta;
    }
    valPostAgregar(_model) {
        //TODO: Hace falta validar el modelo de colaboradores
        const { error, value } = joi.validate(_model, this.joiPostRuta);
        return { error, value };
    }
    valPutModificar(idRuta, model) {
        if (!this.validarObjectId(idRuta))
            return msgHandler_1.msgHandler.errorIdObject('Id de Ruta');
        const { error, value } = this.joiPutRuta.validate(model);
        if (error)
            return msgHandler_1.msgHandler.sendError(error);
        return msgHandler_1.msgHandler.sendValue(value);
    }
    valputDarAlta(idRuta) {
        if (!this.validarObjectId(idRuta))
            return msgHandler_1.msgHandler.errorIdObject('Id de Ruta');
        return;
    }
}
exports.rutaSrv = new RutaService;
