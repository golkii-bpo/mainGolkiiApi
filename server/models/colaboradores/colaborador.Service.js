const joi = require('joi');
// const joi = require('joi-es');
    joi.objectId = require('joi-objectid')(joi);
const lodash = require('lodash');
const cargoSrv = require('../cargo/cargoService');
const msgHandler = require('../../helpers/MessageToolHandler');
const general = require('../../helpers/generalValidation');

const JoiPerfil = joi.object().keys({
    Foto: joi.string(),
    Settings: joi.object().keys({
        DarkMode: joi.boolean(),
        SideBar: joi.boolean()
    })
})

const JoiGeneral = joi.object().keys({
    Nombre: joi.string().required(5).max(30),
    Apellido: joi.string().required(5).max(30),
    Cedula: joi.string().required().regex(/\d{3}-{0,1}\d{6}-{0,1}\d{4}[A-z]{1}/),
    Email: joi.string().email()
})

const JoiCargo = joi.object().keys({
    IdCargo: joi.objectId(),
    FechaIngreso: joi.date()
});

const JoiColaborador = joi.object().keys({
    General: JoiGeneral,
    Cargo: joi.array().items(JoiCargo).min(1),
    Perfil: JoiPerfil,
    Estado: joi.boolean()
})

class colaboradorService extends general {
    /**
     * Método que permite validar el modelo de datos para un Colaborador
     *
     * @param {*} data
     * @returns {error:'Mensaje de Error',value: 'informacion'}
     * @memberof colaboradorService
     */
    async validarColaborador(data){
        const{error,value} = joi.validate(data,JoiColaborador);
        if(error) return {error};
        if(!await cargoSrv.validarCargos(value.Cargo)) return msgHandler.Send().doNotExist('Cargo');
        if(data.hasOwnProperty('User')) return msgHandler.sendError('Error. No se puede crear un Usuario sin antes haber creado un Colaborador');
        return {value};
    }

    validarGeneral(data){
        const{error,value} = joi.validate(data,JoiGeneral);
        if(error) return {error};
        return {value};
    }

    async validarCargo(data) {
        if(!data.hasOwnProperty('Cargo')) return {error:msgHandler.Send().missingIdProperty('Cargo')};
        if(!this.validarObjectId(data.Cargo)) return {error:msgHandler.Send().errorIdObject('Cargo')};
        if(!await cargoSrv.validarCargoById(data.Cargo)) return {error:msgHandler.Send().doNotExist('Cargo')};
        return {value:data};
    }
};

module.exports = new colaboradorService;