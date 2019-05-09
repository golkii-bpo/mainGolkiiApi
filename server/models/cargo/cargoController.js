const 
    db = require('mongoose'),
    cargoMdl = require('./cargoModel'),
    cargoSrv = require('./cargoService'),
    colMdl = require('../colaboradores/colaborador.Model');
    msgHandler = require('../../helpers/MessageToolHandler'),
    Fawn = require('fawn'),
    ObjectId = require('mongoose/lib/types/objectid');

    Fawn.init(db,'golkii_api');
    const Task = Fawn.Task(); 

module.exports = {
    
    /**
     * Metodo que permite obtener todos los registros de cargos activos de la base de datos
     *
     * @param {*} req
     * @param {*} res
     * @returns Array(permisosModel)
     */
    getObtener: async(req,res) => {
        const _return = 
        await cargoMdl
        .find({Estado:true})
        .select({
            Permisos:false,
            FechaModificacion:false,
            Estado:false
        });

        return res.json(msgHandler.sendValue(_return));
    },
    
    /**
     * Método que permite obtener todos los cargos registrados en la base de datos
     *
     * @param {*} req
     * @param {*} res
     * @returns Array(cargoModel)
     */
    getObtenerAll: async (req,res) => {
        const _return = 
        await cargoMdl
        .find()
        .select({
            Permisos:false,
            FechaModificacion:false
        });

        return res.json(_return);
    },

    /**
     * Método que permite buscar un elemento por su ObjectId
     *
     * @module cargoModel
     * @name getBuscarById
     * @param {*} req
     * @param {*} res
     * @returns cargoModel
     */
    getBuscarById: async (req,res) => {
        if(!req.params.hasOwnProperty('idCargo')) return res.status(400).json(msgHandler.Send().missingIdProperty('idCargo')); //creo que igual esto se valida por default con el routing
        const id = req.params.idCargo;
        if(!cargoSrv.validarObjectId(id)) return res.status(400).json(msgHandler.Send().errorIdObject('idCargo'));

        const _return = 
        await cargoMdl.find({_id:id,Estado:true});
        return res.json(msgHandler.sendValue(_return));
    },

    /**
     * Método que permite obtener los Permisos de un cargo determinado
     *
     * @param {*} req
     * @param {*} res
     * @returns Array(cargoModel.Permisos)
     */
    getPermisosById: async (req,res) => {
        if(!req.params.hasOwnProperty('idCargo')) return res.status(400).json(msgHandler.send().missingIdProperty('idCargo'));
        const idCargo = req.params.idCargo;
        if(!cargoSrv.validarObjectId(idCargo)) return res.status(400).json(msgHandler.Send().errorIdObject('idCargo'));

        const _return =
        await cargoMdl
        .findOne({
            _id:idCargo,
            Estado:true
        })
        .select({
            Permisos:true,
            Nombre:true,
        });

        const _resultado = _return.Permisos.filter(element => {
            return element.Estado === true;
        });

        return res.json(msgHandler.sendValue(_resultado));
    },

    /**
     * Agregar un nuevo cargo a la base de datos
     *
     * @param {*} req
     * @param {*} res
     * @returns cargoModel
     */
    postAgregar: async (req,res) => {
        const {error,value} = await cargoSrv.validarAgregar(req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        let _result = await cargoMdl.create(value);
        return res.json(msgHandler.sendValue(_result));
    },

    /**
     *
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    putModificar:  async (req,res) => {
        if(!req.params.hasOwnProperty('idCargo')) return res.status(400).json(msgHandler.Send().missingIdProperty('idPermiso'));
        const 
            idCargo = req.params.idCargo,
            body = req.body;
        if(!cargoSrv.validarObjectId(idCargo)) return res.status(400).json(msgHandler.Send().errorIdObject('idPermiso'))
        const {error,value} = await cargoSrv.validarModificar(body);
        if(error) res.status(400).json(msgHandler.sendError(error));

        let Cargo = cargoMdl.find({_id: idCargo});
        Cargo.set({
            Nombre: value.Nombre,
            Area: value.Area,
            Descripcion: value.Descripcion,
            Parent: value.Parent,
            Funciones: value.Funciones
        });

        return res.json(await Cargo.save());
    },

    /**
     * Agregar un permiso al modelo de datos de Cargo
     * 
     * @param {*} req
     * @param {*} res
     * @returns
     */
    putAgregarPermisos:async (req,res) => {

        if(!req.params.hasOwnProperty('idCargo')) return res.status(400).json(msgHandler.Send().missingIdProperty('idCargo'));
        const 
            _idCargo = req.params.idCargo,
            _permiso = req.body;
        
        if(!cargoSrv.validarObjectId(_idCargo)) return res.status(400).json(msgHandler.Send().errorIdObject('idCargo'))
        const {error,value} = await cargoSrv.validarPermisoSingle(_idCargo,_permiso);

        if(error) return res.status(400).json(msgHandler.sendError(error));
        

        //FIXME: Validar que funciona
        Task.update(cargoMdl,
            {
                _id:_idCargo
            },{
                $push:{'Permisos':_permiso}
            });

        Task.update(colMdl,
            {
                'Cargo.IdCargo':new ObjectId(_idCargo.toString()),
                'Cargo.Estado':true,
                'Permisos':{IdPermiso:{$ne:_permiso.IdPermiso}}
            },{
                $push:{
                    Permisos:{
                        IdPermiso: new ObjectId(_permiso.IdPermiso.toString()),
                        IsFrom:'Cargo'
                    }
                }
            });

        await Task
        .run({useMongoose: true})
        .then((data) => {
            console.log(data);
            return res.json(msgHandler.sendValue('El Permiso se ha agregado correctamente'));
        }).catch((err)=>{
            return res.status(400).json(err.message);
        });
    },

    /**
     * Método que permite eliminar un permiso en especifico de un cargo en especifico
     *  
     * @param {*} req
     * @param {*} res
     */
    putEliminarPermiso: async (req,res) => {
        if(!req.params.hasOwnProperty('idCargo')) return res.status(400).json(msgHandler.Send().missingIdProperty('idCargo'));
        if(!req.params.hasOwnProperty('idPermiso')) return res.status(400).json(msgHandler.Send().missingIdProperty('idPermiso'));
        const
            idCargo = req.params.idCargo,
            idPermiso = req.params.idPermiso;
        if(!cargoSrv.validarObjectId(idCargo)) return res.status(400).json(msgHandler.Send().missingIdProperty('idCargo'));
        if(!cargoSrv.validarObjectId(idPermiso)) return res.status(400).json(msgHandler.Send().missingIdProperty('idPermiso'));
        
        //FIXME: Hay un error que no actualiza los permisos de los colaboradores
        Task
        .update(cargoMdl,{'_id':idCargo},{$pull:{'Permisos':{'IdPermiso':idPermiso}}})
        .update(
            colMdl,
            {
                'Cargo.IdCargo':new ObjectId(idCargo.toString()),
                'Cargo.Estado':true //Aqui se hizo el ultimo cambio. Esto por si no funciona la query
            },{
                $pull:{
                    Permisos: {
                        IdPermiso:new ObjectId(idPermiso),
                        IsFrom:'Cargo'
                    }
                }
            },
            {
                safe:true
            })

        await Task
        .run({useMongoose: true})
        .then((data) => {
            console.log(data);
            return res.json(msgHandler.sendValue('El Permiso se ha eliminado correctamente'));
        }).catch((err)=>{
            return res.status(401).json(err);
        });
    },

    /**
     * Realiza la baja de un cargo en especifico
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    deleteDarBaja: async (req,res) => {
        
        if(!req.params.hasOwnProperty('idCargo')) return res.status(400).json(msgHandler.Send().missingIdProperty('idCargo'));
        const idCargo = req.params.idCargo;
        if(!cargoSrv.validarObjectId(idCargo)) return res.status(400).json(msgHandler.Send().errorIdObject('idCargo'))

        //TODO: En vez de eliminar los permisos se pueden desactivar - Pero esto es otro aproach
        
        const cargoPermisos = [];
        Array.from(await cargoMdl
        .find({_id:new ObjectId(idCargo)})
        .select({Permisos:true,_id:false})
        .lean(true))
        .forEach(_data => {
            if(_data.hasOwnProperty('Permisos') && Array.isArray(_data.Permisos))  if(Array.from(_data.Permisos).length != 0) {
                cargoPermisos.push(..._data.Permisos.map(t => {return t.IdPermiso}));
            } 
        });

        Task
            .update(
                cargoMdl,
                {'_id':new ObjectId(idCargo)},
                {$set:{Estado:false}}
            )
            .update(
                colMdl,
                {'Cargo.IdCargo': new ObjectId(idCargo)},
                {
                    $pull:{
                        'Permisos':{
                            'IdPermiso':{
                                $in:cargoPermisos
                            },
                            'IsFrom':'Cargo'
                        }
                    },
                    $set:{
                        'Cargo.$.Estado':false
                    }
                }
            )
        
        Task
            .run({useMongoose: true})
            .then((data)=> {
                return res.json(msgHandler.sendValue('Se ha dado de baja correctamente'));
            })
            .catch((err)=> {
                return res.status(401).json(msgHandler.sendError(err))
            });
    },
    /**
     * Da de alta a un cargo en especifico
     *
     * @param {Request} req
     * @param {Response} res
     * @returns
     */
    putDarAlta: async (req,res) => {
        //TODO: Buscar todos los permisos y habilitarlos. Unicamente para este controlador
        if(!req.params.hasOwnProperty('idCargo')) return res.status(400).json(msgHandler.Send().missingIdProperty('idPermiso'));
        const idCargo = req.params.idCargo;
        if(!cargoSrv.validarObjectId(idCargo)) return res.status(400).json(msgHandler.Send().errorIdObject('idPermiso'))
        
        let Cargo = await cargoMdl.findById(idCargo);
        Cargo.set({
            Estado:true
        })

        res.json(await Cargo.save());
    }
}
