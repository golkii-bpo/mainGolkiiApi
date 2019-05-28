const {ObjectId} = require('mongoose/lib/types');

/**
 * Clase con distintas validaciones que permitiran generalizar las funciones
 *
 * @class General
 */
class General {
    /**
     * Valida si el Id es del tipo de Datos ObjectId
     *
     * @param {*} Id
     * @returns Boolean
     */
    validarObjectId(Id:String) {
        return ObjectId.isValid(Id);
    }
}

export default General;