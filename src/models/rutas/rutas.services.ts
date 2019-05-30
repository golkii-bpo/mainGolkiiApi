import * as joi from 'joi';
// import * as joi from 'joi-es';
import General from '../../helpers/validation/basicValidations';
// import ColMdl from '../colaboradores/general/colaborador.controller'
import {msgHandler} from '../../helpers/resultHandler/msgHandler'

class RutaService extends General{
    private joiInsumos = joi.object().keys({
        Tipo: joi.string().required(),
        Observacion: joi.string().min(10).max(50),
        Valor: joi.number().required().min(0).max(5000),
        Kilometro: joi.number().min(0).max(2000)
    })
    private joiDemografia = joi.object().keys({
        Departamento: joi.string().required(),
        Municipio: joi.string().required()
    })
    private joiRuta = joi.object().keys({
        Colaborador: joi.string(),
        Descripcion: joi.string().min(0).max(255),
        Demografia: this.joiDemografia,
        Casos:  joi.array().items(joi.string()).min(1),
        Insumos: joi.array().items(this.joiInsumos).min(1),
        FechaSalida: joi.date()
    });
    private joiPostRuta = this.joiRuta;
    private joiPutRuta = this.joiRuta;

    public valPostAgregar(_model:Object) {
        //TODO: Hace falta validar el modelo de colaboradores
        const{error,value} = joi.validate(_model,this.joiPostRuta);
        return {error,value};
    }
    public valPutModificar(idRuta:string,model: any){
        if(!this.validarObjectId(idRuta)) return msgHandler.errorIdObject('Id de Ruta');
        const {error,value} = this.joiPutRuta.validate(model)
        if(error) return msgHandler.sendError(error);
        return msgHandler.sendValue(value);
    }
    public valputDarAlta(idRuta:string){
        if(!this.validarObjectId(idRuta)) return msgHandler.errorIdObject('Id de Ruta'); 
        return
    }
}

export const rutaSrv = new RutaService;