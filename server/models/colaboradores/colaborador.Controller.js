const
    db = require('mongoose'),
    objectId = require('mongoose/lib/types/objectid'),
    colSrv = require('./colaborador.services'),
    colMdl = require('./colaborador.model'),
    cargoModel = require('../cargo/cargoModel'),
    msgHandler = require('../../helpers/MessageToolHandler'),
    Fawn = require('fawn');
    
    Fawn.init(db);
const 
    Task = Fawn.Task();

module.exports = {
    /**
     * Método que nos permite obtener todos los Colaboradores activos
     * de la base de datos
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    getObtener: async (req,res) => {
        const _result = await colMdl.find({Estado: true}).lean(true);
        return res.json(_result);
    },
    
    /**
     * Método que nos permite obtener todos los Colaboradores
     * de la base de datos
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    getObtenerAll: async (req,res) => {
        const _result = await colMdl.find().lean(true);
        return res.json(_result);
    },

    /**
     * Método que te permite agregar los datos generales
     *
     * @param {*} req
     * @param {*} res
     * @returns
     * @type colaboradorModel
     */
    postAgregar: async (req,res) => {
        const _data = req.body;
        const {error,value} = await colSrv.valdarAgregarColaborador(_data);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        let Cargos = colSrv.cargosUnicos(value.Cargo).map(_idCargo => {return new objectId(_idCargo)});
        value.Cargo = Cargos.map(_iC=> {
            return {IdCargo:_iC,Estado:true}
        });

        let permisos = [...new Set(await cargoModel.aggregate([
                {$match:
                    {'_id':{$in:Cargos}}
                },
                {$unwind:'$Permisos'},
                {$replaceRoot :{'newRoot':'$Permisos'}},
                {
                    $addFields: {
                        IdPermiso: { $toString: "$IdPermiso" }
                    }
                },
                {
                    $group:{
                        _id:'$IdPermiso',
                        IdPermiso:{$first:'$IdPermiso'}
                    }
                }
            ]))].map(item =>
                {
                    return {
                        IdPermiso:new ObjectId(item.IdPermiso.toString()),
                        IsFrom:'Cargo'
                    }
                }
            );
        
        if(Array.from(permisos).length != 0){
            value.Permisos = permisos;
        }

        const _result = await colMdl.create(value);
        return res.json(msgHandler.sendValue(_result));
    },

    /**
     * Método que te permite agregar los datos generales
     *
     * @param {*} req
     * @param {*} res
     * @returns
     * @type colaboradorModel
    **/
    putModificarGeneral: async (req,res) => {
        if(!req.params.hasOwnProperty('idColaborador')) return res.status(400).json(msgHandler.Send().missingIdProperty('idColaborador'));
        
        const idColaborador = new objectId(req.params.idColaborador.toString());
        const {error,value} = colSrv.validarGeneral(req.body);

        if(error) return res.status(400).json(error);
        
        const _log = await colMdl.findById(idColaborador);
        if(!_log) return res.status(400).send(msgHandler.Send().putEmptyObject('Colaborador'));

        const _data = await colMdl.updateOne(
            {_id:idColaborador},
            {  $set:{
                    General:value,
                    FechaModificación: Date.now()
                },
                $push:{
                    Log: {
                        FechaModificación:Date.now(),
                        Propiedad:'General',
                        Data: _log.General
                    }
                }
            },{
                new:true
            }
        );
        return res.json(_data);
    },

    /**
     * Este método agregar un Cargo a un empleado incluyendo todos los permisos que contiene el cargo
     *
     * @param {*} req
     * @param {*} res
     * @returns {error,value}
     */
    putAgregarCargo: async (req,res) => {
        const 
            idColaborador = req.params.idColaborador.toString(),
            _idCargo = new objectId(req.params.idCargo);
        if(!colSrv.validarObjectId(idColaborador)) return res.status(400).json(msgHandler.Send().errorIdObject('idColaborador'))
        if(!colSrv.validarObjectId(_idCargo)) return res.status(400).json(msgHandler.Send().errorIdObject('idCargo'))
        
        const 
            Colaborador = await colMdl.findById(idColaborador).lean(true),
            _permisosCol = Colaborador.hasOwnProperty('Permisos')? Colaborador.Permisos.map(item=> item.IdPermiso.toString()): [];
            _permisos = await cargoModel.aggregate([
                {$match:{_id:new objectId(_idCargo.toString())}},
                {$unwind:'$Permisos'},
                {$replaceRoot :{'newRoot':'$Permisos'}},
                {
                    $addFields: {
                        IdPermiso: { $toString: "$IdPermiso" }
                    }
                },
                {$match:{'IdPermiso':{$nin:_permisosCol}}},
                {
                    $group:{
                        _id:'$IdPermiso',
                        IdPermiso:{$first:'$IdPermiso'}
                    }
                },
                {
                    $match:{'IdPermiso':{$ne:_permisosCol}}
                },
                {
                    $project:{
                        "IdPermiso":1,
                        "_id":0
                    }
                },
                {
                    $addFields:{
                        IsFrom: 'Cargo'
                    }
                }
            ]);

            console.log(Colaborador);
        colMdl
        .updateOne(
            {
                _id:idColaborador,
                'Cargo.IdCargo':{$nin:[_idCargo]}
            },
            {
                $push:{
                    Cargo:{
                        IdCargo:_idCargo,
                        Estado:true
                    },
                    Permisos:{
                        $each:_permisos
                    },
                    Log:{
                        Propiedad:'Cargo',
                        Data:Colaborador.Cargo
                    }
                }
            }
        )
        .then((data)=>{
            console.log(data);
            if(data.n==0)   return res.status(400).json(msgHandler.Send().cantFind('Colaborador','Actualizar'));
            if(data.nModified == 0) return res.status(400).json(msgHandler.Send().cantModified('Colaborador','Actualizar'));
            if(data.ok == 0) return res.status(400).json(msgHandler.sendError('Ah ocurrio un error en la actualización del Colaborador'));
            return res.json(msgHandler.Send().successUpdate());
        }).catch((err)=>{
            return res.status(400).json(err);
        })
    },

    /**
     * Este método se encarga de eliminar un cargo de un colaborador
     * Ademas este método agrega todo los permisos
     *
     * @param {*} req
     * @param {*} res
     * @returns {erro,value}
     */
    putEliminarCargo: async (req,res) => {
        
        let
            _IdColaborador = req.params.idColaborador.toString(),
            _IdCargo = req.params.idCargo.toString();
        
        if(!colSrv.validarObjectId(_IdColaborador)) return res.status(400).json(msgHandler.Send().errorIdObject('IdColaborador'));
        if(!colSrv.validarObjectId(_IdCargo)) return res.status(400).json(msgHandler.Send().errorIdObject('IdCargo'));

        _IdColaborador = new objectId(_IdColaborador);
        _IdCargo = new objectId(_IdCargo);
        
        const
            Colaborador = await colMdl.findById(_IdColaborador).lean(true),
            _permisos = (await cargoModel.aggregate([
                {$match:{_id:new objectId(_IdCargo.toString())}},
                {$unwind:'$Permisos'},
                {$replaceRoot :{'newRoot':'$Permisos'}},
                {
                    $addFields: {
                        IdPermiso: { $toString: "$IdPermiso" }
                    }
                },
                {
                    $group:{
                        _id:'$IdPermiso',
                        IdPermiso:{$first:'$IdPermiso'}
                    }
                },
                {
                    $project:{
                        "IdPermiso":1,
                        "_id":0
                    }
                }
            ])).map(_permiso => {return _permiso.IdPermiso});

        colMdl.updateOne(
            {
                _id:_IdColaborador,
                'Cargo.IdCargo':{$eq:_IdCargo}
            },
            {
                $pull:{
                    Cargo:{
                        IdCargo:_IdCargo
                    },
                    Permisos:{
                        IdPermiso:{$in:_permisos},
                        IsFrom:'Cargo'
                    }
                },
                $push:{
                    Log:{
                        Propiedad:'Cargo',
                        Data:Colaborador.Cargo
                    }
                }
            }
        ).then((data)=>{
            if(data.n==0)   return res.status(400).json(msgHandler.Send().cantFind('Colaborador','Actualizar'));
            if(data.nModified == 0) return res.status(400).json(msgHandler.Send().cantModified('Colaborador','Actualizar'));
            if(data.ok == 0) return res.status(400).json(msgHandler.sendError('Ah ocurrio un error en la actualización del Colaborador'));
            return res.json(msgHandler.Send().successUpdate());
        }).catch((err)=>{
            return res.status(400).json(err);
        });
    },

    //TODO: Llenar Documentacion
    /**
     *
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    putAgregarPermiso: async (req,res) => {
        let
            _idColaborador = req.params.idColaborador.toString(),
            _idPermiso = req.params.idPermiso.toString();
        if(!colSrv.validarObjectId(_idColaborador)) return res.status(400).json(msgHandler.Send().errorIdObject('IdColaborador'));
        if(!colSrv.validarObjectId(_idPermiso)) return res.status(400).json(msgHandler.Send().errorIdObject('IdPermiso'));
        
        _idColaborador = new objectId(_idColaborador);
        _idPermiso = new objectId(_idPermiso);
        
        const Colaborador = await colMdl.findById(_idColaborador).lean(true);
        await colMdl
        .updateOne(
            {
                _id:_idColaborador,
                'Permisos.IdPermiso':{$ne:_idPermiso}
            },
            {
                $push:{
                    Permisos:{
                        IdPermiso: _idPermiso,
                        IsFrom: 'Manual'
                    },
                    Log:{
                        Propiedad:'Permisos',
                        Data: Colaborador?Colaborador.hasOwnProperty('Permisos')? Colaborador.Permisos: []:null
                    }
                }
            }
        ).then((data) => {
            return res.json(msgHandler.sendValue(data));
        }).catch((err)=> {
            return res.status(400).json(msgHandler.sendError(err));
        })
    },

    //TODO: Llenar Documentacion
    /**
     *
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    putEliminarPermiso: async (req,res) => {
        let
            _idColaborador = req.params.idColaborador.toString(),
            _idPermiso = req.params.idPermiso.toString();
        if(!colSrv.validarObjectId(_idColaborador)) return res.status(400).json(msgHandler.Send().errorIdObject('IdColaborador'));
        if(!colSrv.validarObjectId(_idPermiso)) return res.status(400).json(msgHandler.Send().errorIdObject('IdPermiso'));
        
        _idColaborador = new objectId(_idColaborador);
        _idPermiso = new objectId(_idPermiso);

        const Colaborador = await colMdl.findById(_idColaborador).lean(true);
        await colMdl
        .updateOne(
            {
                _id:_idColaborador,
                'Permisos.IdPermiso':{$eq:_idPermiso}
            },
            {
                $pull:{
                    Permisos:{
                        IdPermiso:_idPermiso
                    },
                },
                $push:{
                    Log:{
                        Propiedad:'Permisos',
                        Data:Colaborador.hasOwnProperty('Permisos')? Colaborador.Permisos: []
                    }
                }
            }
        ).then((data)=>{
            return res.send(data);
        }).catch((err)=>{
            return res.status(400).json(err.message);
        })
    }
};