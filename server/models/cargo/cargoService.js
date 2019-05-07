const Joi = require('joi');
// const Joi = require('joi-es');
//Se instancia la variable de Joi ObjectId
Joi.objectId = require('joi-objectid')(Joi);
const general = require('../../helpers/generalValidation');
const cargoModel = require('./cargoModel');
const areaService = new (require('../../models/area/areaService'))();
const msgHandler = require('../../helpers/MessageToolHandler');
const lodash = require('lodash');

const JoiFunciones = Joi.object().keys({
    Descripcion: Joi.string().required().max(255),
    FechaIngreso: Joi.date(),
    Estado: Joi.bool()
});

const JoiPermisos = Joi.object().keys({
    IdPermiso: Joi.objectId(),
    Estado: Joi.bool()
});

const cargoValidacion = Joi.object().keys({
    Nombre: Joi.string().required().max(20),
    Area: Joi.string().required(),
    Descripcion: Joi.string().max(255),
    Parent: Joi.string(),
    Funciones:Joi.array().items(JoiFunciones).min(1),
    Permisos: Joi.array().items(JoiPermisos)
});

const validarPermisos = (Permisos) => {
    let _data = {},
        retorno = true;
    //Se realiza la validación para ver si es un array
    if(!Array.isArray(Permisos)) return false;

    for(let item of Permisos){
        //Si esta alojado en memoria entonces significa que este registro se encuentra duplicado
        if(_data.hasOwnProperty(item.IdPermiso)) {retorno = false;break;}
        //Si no esta alojado en memoria entonces significa que no esta repetido y se ingresa en memoria para luego ser validado
        _data[item.IdPermiso] = item;
    }
    return retorno;
};

const validarModelo = async (body) => {
    const {error,value} = Joi.validate(body,cargoValidacion);
    if(error && error.details) return msgHandler.sendError(error.details[0].message);
    
    //Validacion del area que se le va a ingresar a un cargo
    if(!await areaService.validarArea(value.Area)) return msgHandler.Send().doNotExist('Area');

    //Validacion de los permisos
    // el primer if() es para validar si existe la propiedad Permisos en el objeto
    // el segundo if() es para validar si hay IdPermisos repetidos
    if(body.hasOwnProperty('Permisos')) if(!validarPermisos(body.Permisos)) return msgHandler.sendError('No pueden existir permisos duplicados en un mismo cargo');  
    return msgHandler.sendValue(value);
}

class cargoService extends general {

    /**
     * Realiza la validación para agregar un Cargo 
     *
     * @param {*} body
     * @returns Promise(Message)
     * @memberof cargoService
     */
    async validarAgregar(body){
        const {error,value} = await validarModelo(body);
        if(error) return msgHandler.sendError(error)
        if(value.hasOwnProperty('Permisos')) return msgHandler.sendError('No se puede agregar el permiso. Primero se tiene que agregar un Cargo para luego agregarle los permisos');
        return msgHandler.sendValue(value);
    }
    /**
     * @
     * Realiza la validacion para modificar un Cargo 
     *
     * @param {*} body
     * @returns
     * @memberof cargoService
     */
    async validarModificar(body){
        const {error,value} = await validarModelo(body);
        if(error) return msgHandler.sendError(error)
        return msgHandler.sendValue(value);
    }

    validarPermisoMultiples (Permisos) {
        const data = Permisos.map(item => {
            return lodash.pick(item,['IdPermiso','Estado'])
        });

        const {error,value} = Joi.array().items(JoiPermisos).min(1).validate(data);
        if(error) return msgHandler.sendError(error);
        return msgHandler.sendValue(Permisos);
    }
    
    async validarPermisoSingle (idCargo,Permiso) {

        const _Permiso = lodash.pick(Permiso,['IdPermiso','Estado']);
        let {error} = JoiPermisos.validate(_Permiso);
        if(error) return msgHandler.sendError(error.details[0].message);

        const _dataCargo = (await cargoModel.findOne({_id:idCargo})).toObject();

        //Se valida que exista el cargo
        if(!_dataCargo) return msgHandler.Send().doNotExist('Cargo');
        //Se valida que no existan permisos repetidos
        if(_dataCargo.hasOwnProperty('Permisos')){
            let Permisos = Array.from(_dataCargo.Permisos);
            for (const item of Permisos) {
                if(item.IdPermiso == _Permiso.IdPermiso){
                    error = msgHandler.sendError('Lo sentimos la ruta o direccion ya a sido ingresado a este cargo');
                    break;
                }
            }
        }
        return !error?msgHandler.sendValue(_Permiso): {error};
    }

    async validarCargoById(idCargo){
        const _data = await cargoModel.findById(idCargo);
        return _data? true:false;
    }

    validarCargos(Cargos){
        if(!Array.isArray(Cargos)) return false;
        let _data = Cargos.map(item=>{
            let cargo = cargoModel.findById(item.IdCargo);
            return cargo? true:false
        }).find(item => {
            return item == false;
        });

        return !_data? true:false;
    }
}

module.exports = new cargoService;