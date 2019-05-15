const 
    Rutas = require('./rutas.model'),
    rutaSrv = require('./rutas.services'),
    ObjectId = require('mongoose/lib/types/objectid'),
    msgHandler = require('../../helpers/MessageToolHandler');

module.exports = {
    getObtenerTodos: async (req,res) => {
        const _data = await Rutas.find().select({FechaData:false}).lean(true);
        return res.json(msgHandler.sendValue(_data));
    },
    getObtenerById: async (req,res) => {
        const idRuta = req.params.idRuta;
        if(!rutaSrv.validarObjectId(idRuta)) return res.status(400).json(msgHandler.Send().errorIdObject('Id de Ruta'));
        const _data = await Rutas.findById(idRuta).select({FechaData:false}).lean(true);
        return res.json(msgHandler.sendValue(_data));
    },
    postAgregar: async (req,res) => {
        const _model = req.body;
        const {error,value}=rutaSrv.valAgregar(_model);
        if(error) return res.status(400).json(msgHandler.sendError(error));
        const _result = await Rutas.create(value);
        return res.json(msgHandler.sendError(_result));
    },
    putModificar: async (req,res) => {
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
            return res.json(msgHandler.Send.successUpdate());
        })
        .catch((err)=>{
            return res.status(400).json()
        })
    },
    putDarAlta: async (req,res) => {
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
    deleteDarBaja: async (req,res) => {
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