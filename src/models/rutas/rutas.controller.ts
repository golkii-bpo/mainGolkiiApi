
import RutasModel from './rutas.model';
import {rutaSrv} from './rutas.services';
import * as rutasInt from './rutas.interfaces';
import {msgHandler,crudType as  enumCrud} from '../../helpers/resultHandler/msgHandler';
import {Rutas as sttng} from '../../settings/settings';
// import userServices from '../colaboradores/usuarios/user.services';

export default {

    /**
     * Obtiene el total de registros ingresados a la base de datos
     *
     * @param {*} req
     * @param {*} res
     */
    getModelTotal: async (req,res) => {
        await 
        RutasModel
        .find()
        .count()
        .lean(true)
        .then((data)=> {return res.json(msgHandler.sendValue(data))})
        .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))});
    },

    /**
     * Obtiene todas las rutas
     * utilizando la paginación
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    getObtener: async (req,res) => {
        let 
            page:number = Number(req.query.page),
            size:number = Number(req.query.size);
        page = page?page:1;
        /**
         * 1. Si la variable size contiene datos
         * 1.2 Entonces valida si no es mayor a la cantidad de datos que puede devolver
         * 1.2.1 Si la Cantidad es mayor entonces devuelve el numero de datos que se pueden devolver
         * 1.2.2 Si la cantidad es menor se devuelve el numero que se esta solicitando
         * 2. Si la variable size no contiene datos se devuelve la cantidad maxima de datos permitada
         */
        size = size? size>sttng.maxData?sttng.maxData:size:sttng.maxData;
        let skipData:number = (size * ( page - 1));

        await 
        RutasModel
        .find()
        .select({FechaData:false})
        .skip(skipData)
        .limit(size)
        .lean(true)
        .then((data)=>{return res.json(msgHandler.sendValue(data))})
        .catch((err)=>{;return res.status(400).json(msgHandler.sendError(err))});
    },

    /**
     * Obtiene todas las rutas
     * utilizando filtro de fechas
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    getObtenerFecha: async (req,res) => {
        let 
            page:number = Number(req.query.page),
            size:number = Number(req.query.size);
        page = page?page:1;
        /**
         * 1. Si la variable size contiene datos
         * 1.2 Entonces valida si no es mayor a la cantidad de datos que puede devolver
         * 1.2.1 Si la Cantidad es mayor entonces devuelve el numero de datos que se pueden devolver
         * 1.2.2 Si la cantidad es menor se devuelve el numero que se esta solicitando
         * 2. Si la variable size no contiene datos se devuelve la cantidad maxima de datos permitada
         */
        size = size? size>sttng.maxData?sttng.maxData:size:sttng.maxData;
        let skipData:number = (size * ( page - 1));

        let 
            _fi:number = Number(req.params.fechaInicio.toString()),
            _ff:number = Number(req.params.fechaFinal.toString());

        let 
            fi:Date = _fi? new Date(_fi) : new Date(),
            ff:Date = _ff? new Date(_ff) : new Date();

        await 
        RutasModel
        .find({
            FechaSalida:{
                $lte:ff,
                $gte: fi
            }
        })
        .select({FechaData:false})
        .skip(skipData)
        .limit(size)
        .lean(true)
        .then((data)=>{return res.json(msgHandler.sendValue(data))})
        .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))});
    },

    /**
     * Obtiene todas las rutas
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    getObtenerActivos: async (req,res) => {
        let 
            page:number = Number(req.query.page),
            size:number = Number(req.query.size);
        page = page?page:1;
        /**
         * 1. Si la variable size contiene datos
         * 1.2 Entonces valida si no es mayor a la cantidad de datos que puede devolver
         * 1.2.1 Si la Cantidad es mayor entonces devuelve el numero de datos que se pueden devolver
         * 1.2.2 Si la cantidad es menor se devuelve el numero que se esta solicitando
         * 2. Si la variable size no contiene datos se devuelve la cantidad maxima de datos permitada
         */
        size = size? size>sttng.maxData?sttng.maxData:size:sttng.maxData;
        let skipData:number = (size * ( page - 1));

        await 
        RutasModel
        .find({Estado:true})
        .select({FechaData:false})
        .skip(skipData)
        .size(size)
        .lean(true)
        .then((data)=>{
            return res.json(msgHandler.sendValue(data));
        })
        .catch((err)=>{
            return res.json(msgHandler.sendError(err));
        });
    },

    /**
     * Se obtiene una ruta en especifica por medio de un Id
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    getObtenerById: async (req,res) => {
        await 
        RutasModel
        .findById(req.params.idRuta.toString())
        .select({FechaData:false})
        .lean(true)
        .then((data)=>{
            return res.json(msgHandler.sendValue(data));
        })
        .catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        })
    },

    /**
     *  Agrega una nueva ruta 
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    postAgregar: async (req,res) => {
        const _model = req.body;
        const {error,value} = rutaSrv.valPostAgregar(_model);
        if(error) return res.status(400).json(msgHandler.sendError(error));
        const _result = await RutasModel.create(value);
        return res.json(msgHandler.sendError(_result));
    },

    /**
     * Modifica generalidades de una ruta, hay que proporcionar el idRuta para poder modificar a la persona
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    putModificar: async (req,res) => {
        const {error,value } = rutaSrv.valPutModificar(req.params.idRuta,req.body);
        if(error) return msgHandler.sendError(error);
        const 
            idRuta:string =  req.params.idRuta,
            model:rutasInt.intPutRuta = <rutasInt.intPutRuta>value; 
        
        await 
        RutasModel.updateOne(
        {
            _id:idRuta
        },
        {
            $set:{
                Colaborador:model.Colaborador,
                Descripcion:model.Descripcion,
                Casos: model.Casos,
                Insumo: model.Insumos,
                FechaSalida: model.FechaSalida
            }
        })
        .then((data)=>{
            return res.json(msgHandler.resultCrud(data,'rutas',enumCrud.actualizar));
        })
        .catch((err)=>{
            return res.status(400).json(msgHandler.sendError(err));
        })
    },

    /**
     * Da de alta a una ruta, por medio de un IdRuta
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    putDarAlta: async (req,res) => {
        //FIXME: Se tiene que modificar el retorno de la informacion.
        const
            idRuta = req.params.idRuta;
        //se realiza la validacion para saber si el idRuta es un ObjectId
        if(!rutaSrv.validarObjectId(idRuta)) return res.status(400).json(msgHandler.errorIdObject('Id de Ruta'));        
        await
        RutasModel
        .updateOne(
            {
                _id:idRuta
            },
            {
                $set:{
                    Estado:true
                }
            }
        ).then((data)=>{
            return res.json(msgHandler.resultCrud(data,'rutas',enumCrud.actualizar));
        }).catch((err)=> {
            return res.status(400).json(msgHandler.sendError(err));
        })
    },
    /**
     * Da de baja a una ruta, por medio de un idRuta.
     * Si este id no es propocionado no se va a poder efectuar el cambio
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    deleteDarBaja: async (req,res) => {
        //FIXME: Se tiene que modificar el retorno de la informacion.
        const idRuta:string = req.params.idRuta;
        //se realiza la validacion para saber si el idRuta es un ObjectId
        if(!rutaSrv.validarObjectId(idRuta)) return res.status(400).json(msgHandler.errorIdObject('Id de Ruta'));        
        await
        RutasModel
        .updateOne(
            {
                _id:idRuta
            },
            {
                $set:{
                    Estado:false
                }
            }
        ).then((data)=>{
            return res.json(msgHandler.resultCrud(data,'rutas',enumCrud.actualizar));
        }).catch((err)=> {
            return res.status(400).json(msgHandler.sendError(err));
        })
    }
}