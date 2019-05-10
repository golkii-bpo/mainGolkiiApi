const 
    colaboradorServices = require('./colaborador.Service'),
    colaboradorModel = require('./colaborador.Model'),
    cargoModel = require('../cargo/cargoModel'),
    msgHandler = require('../../helpers/MessageToolHandler'),
    objectId = require('mongoose/lib/types/objectid');

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
        const _result = await colaboradorModel.find({Estado: true}).lean(true);
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
        const _result = await colaboradorModel.find().lean(true);
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
        const {error,value} = await colaboradorServices.valdarAgregarColaborador(_data);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        let Cargos = colaboradorServices.cargosUnicos(value.Cargo).map(_idCargo => {return new objectId(_idCargo)});
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

        const _result = await colaboradorModel.create(value);
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
        
        const idColaborador = req.params.idColaborador;
        const {error,value} = colaboradorServices.validarGeneral(req.body);

        if(error) return res.status(400).json(error);
        
        const _log = await colaboradorModel.findById(idColaborador);
        if(!_log) return res.status(400).send(msgHandler.Send().putEmptyObject('Colaborador'));

        const _data = await colaboradorModel.updateOne(
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
     *
     *
     * @param {*} req
     * @param {*} res
     */
    putAgregarCargo: async (req,res) => {
        const 
            idColaborador = req.params.idColaborador,
            idCargo = req.params.idCargo;
        if(!colaboradorServices.validarObjectId(idColaborador)) return res.status(400).json(msgHandler.Send().errorIdObject('idColaborador'))
        if(!colaboradorServices.validarObjectId(idCargo)) return res.status(400).json(msgHandler.Send().errorIdObject('idCargo'))
        
        //Se obtienen los datos del cargo
        
        const 
            Colaborador = await colaboradorModel.findById(idCargo).lean(true),
            Cargo = await cargoModel.aggregate([
                {$match:{_id:new objectId(idCargo.toString())}},
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
            ]);

        // colaboradorModel.update(
        //     {
        //         '_id':new objectId(idColaborador),
        //         'Cargo.IdCargo':{$ne:new objectId(idCargo)}
        //     },
        //     {
        //         $push:{
        //             'Cargo':{
        //                 IdCargo:new objectId(idCargo.toString()),
        //                 Estado:true
        //             }
        //         },
        //         $push:{
        //             'Permisos':{
        //                 $each:
        //             }
        //         }
        //     }
        // );

    }

    // putAgregarPerfil: async (req,res) => {

    // }
};