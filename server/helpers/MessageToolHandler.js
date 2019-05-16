module.exports = new class Message {

    /**
     *Crea un instancia Message
     * @param { Retorno de información de donde se encuentra el posible error } error
     * @param { Si no hubo ningun tipo de fallo entonces retorna el resultado esperado } value
     */
    constructor(_error,_mensaje){
        if(_error){this.error = _error; this.value = null}
        else if(!_error&&_mensaje){this.error = null; this.value = _mensaje}
        else{{this.error = null; this.value = null}}
    }

    sendError(_error){
        this.error = _error;
        this.value = null;
        return {error: this.error,value: this.value};
    }

    static sendTest(){
        return new Message('Esto es una error','Jack');
    }

    sendValue(content){
        this.error = null;
        this.value = content;
        return {error: this.error,value: this.value};
    }

    test(){
        this.error = 'hola',
        this.value = 'Jack'
    }

    /**
     * Método que nos permite retornar mensajes personalizados
     *
     * @returns ToolsHandler
     */
    Send(){
        return new class ToolsHandler {
            /**
             * Mensaje de error por falta de la propiedad de un Objeto
             * @param {*} IdRequire
             * @returns String
             */
            missingIdProperty(IdRequire){
                this.value = null;
                this.error = `La propiedad ${IdRequire} no ha sido especificada`;
                return {error:this.error,value:this.value};
            }
            missingBodyProperty(propiedad){
                this.value = null;
                this.error = `No se encontro la propiedad ${propiedad}. Para poder continuar continuar con el flujo es necesario este dato.`;
            }
            doNotExist(campo){
                this.value = null;
                this.error = `El valor del campo ${campo} no se encuentra registrado. Favor ingrese un dato valido.`
                return {error:this.error,value:this.value};
            }
            alredyExist(campo){
                this.value = null;
                this.error = `El ${campo} ya se encuentra registrado. Favor ingresar otro.`;
                return {error:this.error,value:this.value};
            }
            /**
             * Mensaje de error por falta de objetos para ser actualizados
             *
             * @param {Nombre del Objeto} objectName
             * @returns String
             */
            putEmptyObject(objectName){
                this.value = null;
                if(!objectName) this.error = 'No se encontro ningun resultado para poder ser actualizado';
                else this.error = `No se encontro ningun resultado del ${objectName} para poder ser actualizado`;
                return {error:this.error,value:this.value};
            }
            /**
             * Mensaje de error por no ser un ObjectId
             * @param {*} IdRequire
             * @returns String
             */
            errorIdObject(IdData){
                this.value = null
                this.error = `El ${IdData} ingresado no tiene el formato correcto`;
                return {error:this.error,value:this.value};
            }
            errorCrud(crudType){
                return new Message(`Lo sentimos no se ha podido ${crudType.toString()}`,null);
            }
            cantFind(model,crudType){
                this.value = null;
                this.error = `No se pudo encontrar el ${model} para poderlo ${crudType}`;
                return {error:this.error,value:this.value};                
            }
            cantModified(model,crudType){
                this.value = null;
                this.error = `No se pudo ${crudType} el ${model}`;
                return {error:this.error,value:this.value};                
            }
            /**
             * Este método devuelve un mensaje si una actualizacion esta ok o no
             *
             * @param {n,nModified,ok} data
             * @param {Collecion que se esta utilizando} model
             * @param {Tipo de Operacion} crud
             */
            resultCrud(data,model,crud){
                if(!data.hasOwnProperty('n')&&!data.hasOwnProperty('nModified')&&!data.hasOwnProperty('ok')) throw new Error('El formato esperado para el método no es el adecuado');
                if(data.n==1 && data.nModified ==1 && data.ok ==1) return new Message(null,'Se ha actualizado correctamente')
                else if(data.ok == 1) return this.errorCrud('actualizar')
                else if(data.nModified) return this.cantModified(model,'actualizar');
                else if(data.n) return this.cantFind(model,'actualizar');
            }
            successUpdate(_model){
                this.error = null
                this.value = `El ${_model} se ha actualizado correctamente`;
                if(!_model) this.value = 'Se ha actualizado correctamente';
                return {error:this.error,value:this.value};  
            }
        }
    }

    static Test(){
        return 'Hola';
    }
    /**
     * Retorna un valor boleano.
     * True si hay algun tipo de error
     * False si no hubo ningun tipo de fallos
     * @description {Esto es una prueba}
     */
    get getError(){
        return this.sendError;
    }

    set setError(content){
        this.value = null;
        this.error = content;
    }
    
    /**
     * Retorna los valores de Error y Value dentro de la clase
     *
     * @readonly
     */
    get getValue(){
        return this.sendValue;
    }

    /**
     * Establece el valor de resultado a la clase de Message
     *
     */
    set setValue(content){
        this.error = null;
        this.value = content;
    }
} 