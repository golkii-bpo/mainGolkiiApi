// const Joi = require('joi-es');
const Joi = require('joi');
const general = require('../../helpers/generalValidation');
const areaService = new (require('../../models/area/areaService'))();
const permisoModel = require('./permisoModel');
const msgHandler = require('../../helpers/MessageToolHandler');

const JoiTree = Joi.object().keys({
    Idx: Joi.number().integer().required(),
    Item: Joi.string().required()
})

const JoiPermiso = Joi.object().keys({
    Titulo: Joi.string().max(20),
    Descripcion: Joi.string().max(255),
    Area: Joi.string().required().max(30),
    Tree:Joi.array().items(JoiTree).min(1),
    Path: Joi.string().required(),
    FechaIngreso: Joi.date(),
    FechaModificacion:Joi.date(),
    Estado:Joi.boolean()
});

const IsPathUnique = async (_Path) => {
    const Permisos = (await permisoModel.findOne({Path:_Path}));
    return Permisos? false:true;
};

class permisoService extends general{
    async validarModelo(_data) {
        const {error,value} = Joi.validate(_data,JoiPermiso);
        if(error && error.details) return msgHandler.sendError(error.details[0].message);
        if(!await areaService.validarArea(value.Area)) return msgHandler.sendError('El Area a ingresar no se encuentra registrada en sistema');
        if(!await IsPathUnique(value.Path)) return msgHandler.Send().alredyExist('Path');

        return {value};
    };
}

module.exports = permisoService;