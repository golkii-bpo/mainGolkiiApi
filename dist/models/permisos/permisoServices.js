var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// const Joi = require('joi-es');
const Joi = require('joi');
const general = require('../../helpers/generalValidation');
const areaService = new (require('../../models/area/areaService'))();
const permisoModel = require('./permisoModel');
const msgHandler = require('../../helpers/msgHandler');
const JoiTree = Joi.object().keys({
    Idx: Joi.number().integer().required(),
    Item: Joi.string().required()
});
const JoiPermiso = Joi.object().keys({
    Titulo: Joi.string().max(20),
    Descripcion: Joi.string().max(255),
    Area: Joi.string().required().max(30),
    Tree: Joi.array().items(JoiTree).min(1),
    Path: Joi.string().required(),
    FechaIngreso: Joi.date(),
    FechaModificacion: Joi.date(),
    Estado: Joi.boolean()
});
const IsPathUnique = (_Path) => __awaiter(this, void 0, void 0, function* () {
    const Permisos = (yield permisoModel.findOne({ Path: _Path }));
    return Permisos ? false : true;
});
class permisoService extends general {
    validarModelo(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = Joi.validate(_data, JoiPermiso);
            if (error && error.details)
                return msgHandler.sendError(error.details[0].message);
            if (!(yield areaService.validarArea(value.Area)))
                return msgHandler.sendError('El Area a ingresar no se encuentra registrada en sistema');
            if (!(yield IsPathUnique(value.Path)))
                return msgHandler.Send().alredyExist('Path');
            return { value };
        });
    }
    ;
}
module.exports = new permisoService;
