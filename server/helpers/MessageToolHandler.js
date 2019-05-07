module.exports = new class Message {

    /**
     *Crea un instancia Message
     * @param { Retorno de información de donde se encuentra el posible error } error
     * @param { Si no hubo ningun tipo de fallo entonces retorna el resultado esperado } value
     */
    constructor(){
        this.error = null,
        this.value = null
    }

    sendError(_error){
        this.error = _error;
        this.value = null;
        return {error: this.error,value: this.value};
    }

    sendValue(content){
        this.error = null;
        this.value = content;
        return {error: this.error,value: this.value};
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
        }
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