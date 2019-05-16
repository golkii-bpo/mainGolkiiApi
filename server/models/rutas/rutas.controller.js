const 
    Rutas = require('./rutas.model'),
    rutaSrv = require('./rutas.services'),
    ObjectId = require('mongoose/lib/types/objectid'),
    msgHandler = require('../../helpers/MessageToolHandler'),
    sizeData = require('../../settings/settings').Rutas.paginacion;

module.exports = {

    /**
     * Obtiene el total de registros ingresados a la base de datos
     *
     * @param {*} req
     * @param {*} res
     */
    getTotalRuta: async (req,res) => {
        await 
            Rutas
            .find()
            .count()
            .lean(true)
            .then((data)=> {return res.json(msgHandler.sendValue(data))})
            .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))});
    },

    /**
     * Obtiene todas las rutas
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    getObtenerTodos: async (req,res) => {
        let 
            page = req.query.page;
            page = page? Number.isInteger(page)?page:1:1;
        const
            skipData = sizeData*(page-1);

        await 
            Rutas
            .find()
            .select({FechaData:false})
            .skip(skipData)
            .limit(sizeData)
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
            page = req.query.page;
            page = page? Number.isInteger(page)?page:1:1;
        const
            skipData = sizeData*(page-1);

        await 
        Rutas
        .find({Estado:true})
        .select({FechaData:false})
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
        const idRuta = req.params.idRuta;
        if(!rutaSrv.validarObjectId(idRuta)) return res.status(400).json(msgHandler.Send().errorIdObject('Id de Ruta'));
        const _data = await Rutas.findById(idRuta).select({FechaData:false}).lean(true);
        return res.json(msgHandler.sendValue(_data));
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
        const {error,value}=rutaSrv.valAgregar(_model);
        if(error) return res.status(400).json(msgHandler.sendError(error));
        const _result = await Rutas.create(value);
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
        //FIXME: Se tiene que modificar el retorno de la informacion.
        const 
            _model = req.model,
            idRuta = req.params.idRuta;
        if(!rutaSrv.validarObjectId(idRuta)) return res.status(400).json(msgHandler.Send().errorIdObject('Id de Ruta'));
        
        await 
        Rutas.updateOne(
        {
            _id:idRuta
        },
        {
            $set:{
                Colaborador:_model.Colaborador,
                Descripcion:_model.hasOwnProperty('Descripcion')?_model.Descripcion:'',
                Casos: _model.Casos,
                Kilometraje: _model.Kilometraje,
                Insumo: _model.Insumo,
                FechaSalida: _model.FechaSalida
            }
        })
        .then((data)=>{
            // if(data.n == 0) return res.status(402).json(msgHandler)
            return res.json(msgHandler.Send.successUpdate());
        })
        .catch((err)=>{
            return res.status(400).json()
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
        if(!rutaSrv.validarObjectId(idRuta)) return res.status(400).json(msgHandler.Send().errorIdObject('Id de Ruta'));        
        await
        Rutas
        .updateOne(
            {
                _id:idRuta
            },
            {
                $set:{
                    Estado:true
                }
            }
        ).then(()=>{
            return res.json(msgHandler.Send().successUpdate());
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
        const
            idRuta = req.params.idRuta;
        //se realiza la validacion para saber si el idRuta es un ObjectId
        if(!rutaSrv.validarObjectId(idRuta)) return res.status(400).json(msgHandler.Send().errorIdObject('Id de Ruta'));        
        await
        Rutas
        .updateOne(
            {
                _id:idRuta
            },
            {
                $set:{
                    Estado:false
                }
            }
        ).then(()=>{
            return res.json(msgHandler.Send().successUpdate());
        }).catch((err)=> {
            return res.status(400).json(msgHandler.sendError(err));
        })
    }
}