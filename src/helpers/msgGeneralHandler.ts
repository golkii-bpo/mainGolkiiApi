class Message {
    error: Object;
    value: Object;
    /**
     *Crea un instancia Message
     * @param { Retorno de información de donde se encuentra el posible error } error
     * @param { Si no hubo ningun tipo de fallo entonces retorna el resultado esperado } value
     */
    constructor(_error:Object,_mensaje: Object){
        if(_error){this.error = _error; this.value = null}
        else if(!_error&&_mensaje){this.error = null; this.value = _mensaje}
        else{this.error = null; this.value = null}
    }
    
    /**
     * Retorna un mensaje de error
     *
     * @param {*} _error
     * @returns {error,value}
     */
    sendError(_error:Object){
        return new Message(_error,null);
    }

    /**
     * Retorna la data en el formato establecido
     *
     * @param {*} content
     * @returns {error,value}
     */
    sendValue(content:any){
        return new Message(null,content);
    }
} 

export default Message;