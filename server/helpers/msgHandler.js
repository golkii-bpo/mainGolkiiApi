const Mensaje = require('./msgGeneralHandler');

class MsgHandler extends Mensaje {

    /**
     * Mensaje de error por falta de la propiedad de un Objeto
     * @param {*} IdRequire
     * @returns String
     */
    missingIdProperty(IdRequire){
        return new MsgHandler(`La propiedad ${IdRequire} no ha sido especificada`,null);
    }

    missingBodyProperty(propiedad){
        return new MsgHandler(`No se encontro la propiedad ${propiedad}. Para poder continuar continuar con el flujo es necesario este dato.`,null);
    }

    missingModelData(model){
        return new MsgHandler(`El ${model} no se encuentra registrador`);
    }
    
    doNotExist(campo){
        return new MsgHandler(`El valor del campo ${campo} no se encuentra registrado. Favor ingrese un dato valido.`,null);
    }

    alredyExist(campo){
        return new MsgHandler(`El ${campo} ya se encuentra registrado. Favor ingresar otro.`);
    }

    /**
     * Mensaje de error por no ser un ObjectId
     * @param {*} IdRequire
     * @returns String
     */
    errorIdObject(IdData){
        return new MsgHandler(`El ${IdData} ingresado no tiene el formato correcto`,null);
    }

    errorCrud(crudType){
        return new MsgHandler(`Lo sentimos no se ha podido ${crudType.toString()}`,null);
    }

    cantFind(model,crudType){
        if(!crudType) throw new Error('favor especificar el crudType');
        return new MsgHandler(`No se pudo encontrar el ${model} para poderlo ${crudType}`);                
    }

    cantModified(model,crudType){
        return new MsgHandler(`No se pudo ${crudType} el ${model}`);            
    }

    /**
     * Este método devuelve un mensaje si una actualizacion esta ok o no
     *FIXME: Se tiene que crear un metodo para Arrays multiples
     * @param {n,nModified,ok} data
     * @param {Collecion que se esta utilizando} model
     * @param {Tipo de Operacion} crud
     */
    resultCrud(data,model,crud){
        if(!data.hasOwnProperty('n')&&!data.hasOwnProperty('nModified')&&!data.hasOwnProperty('ok')) throw new Error('El formato esperado para el método no es el adecuado');
        if(data.n==1 && data.nModified ==1 && data.ok ==1) return new MsgHandler(null,'Se ha actualizado correctamente')
        else if(data.ok == 1) return this.errorCrud('actualizar')
        else if(data.nModified) return this.cantModified(model,'actualizar');
        else if(data.n) return this.cantFind(model,'actualizar');
    }

    successUpdate(_model){
        if(!_model) new MsgHandler('Se ha actualizado correctamente');
        return new MsgHandler(`El ${_model} se ha actualizado correctamente`);
    }
}

module.exports = new MsgHandler;