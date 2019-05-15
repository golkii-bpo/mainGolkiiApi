const joi = require('joi');
joi.objectid = require('joi-objectid')(joi);
// const joi = require('joi-es');
const General = require('../../helpers/generalValidation');

const joiRuta = joi.object().keys({
    Colaborador: joi.objectid(),
    Descripcion: joi.string().min(0).max(255),
    Casos:  joi.array().items(joi.string()).min(1),
    Kilometraje: joi.number().min(0).max(2000),
    Insumos: joi.string().valid('Gasolina','Pasaje'),
    FechaSalida: joi.date()
});

class RutaService extends General{
    valAgregar(_model) {
        //TODO: Hace falta validar el modelo de colaboradores
        return joi.validate(_model,joiRuta);
    }
}

module.exports = new RutaService;