const
    ObjectId = (require('mongoose')).Types.ObjectId,
    permisoMdl = require('./permisoModel'),
    colMdl = require('../colaboradores/general/colaborador.model'),
    cargoMdl = require('../cargo/cargoModel'),
    permisoSrv = require('./permisoServices'),
    msgHandler = require('../../helpers/msgHandler'),
    Task = (require('../../db/transactions')).Task();

// let 
//     Task = new Fawn.Task();

module.exports = {

    /**
     *  Método que devuelve todos los permisos activos
     *
     * @param {*} req
     * @param {*} res
     * @returns Array<permisoModel>
     */
    getBuscar: async (req,res) => {
        await permisoMdl
        .find({Estado:true})
        .select({
            Descripcion:true,
            Area:true,
            Tree:true,
            Path:true,
            IsTag:true,
            Titulo:true
        })
        .lean(true)
        .then((data)=>{return res.json(msgHandler.sendValue(data))})
        .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))})
    },

    /**
     * Devuelve todos los permisos
     *
     * @param {*} req
     * @param {*} res
     * @returns Array<permisoModel>
     */
    getBuscarAll: async(req,res) => {
        await 
        permisoMdl
        .find()
        .lean(true)
        .then((data)=>{return res.json(msgHandler.sendValue(data))})
        .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))});
    },

    /**
     * Metodo que permíte buscar un permiso por su Id
     *
     * @param {*} req
     * @param {*} res
     * @returns permisoModel
     */
    getBuscarById: async(req,res) => {
        const id = req.params.idPermiso;
        await 
        permisoMdl
        .find({_id:id,Estado:true})
        .select({
            Descripcion:true,
            Area:true,
            Tree:true,
            Path:true
        })
        .lean(true)
        .then((data)=>{return res.json(msgHandler.sendValue(data))})
        .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))});
    },

    /**
     * Método que agrega un permiso a la base de datos
     *
     * @param {*} req
     * @param {*} res
     * @returns permisoModel
     */
    postAgregar: async (req,res) => {
        const{error,value} = await permisoSrv.validarModelo(req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        await 
        permisoMdl
        .create(value)
        .then((data)=>{return res.json(msgHandler.sendValue(data))})
        .catch((err)=>{return res.status(400).sendError(err)});
    },

    /**
     * Método que modifica un modelo de Permiso 
     *
     * @param {*} req
     * @param {*} res
     * @returns permisoModel
     */
    putModificar: async (req,res) => {
        if(!req.params.hasOwnProperty('idPermiso')) return res.status(400).json(msgHandler.sendError('La propiedad idPermiso no ha sido especificada'));
        const _idPermiso = req.params.idPermiso;
        if(!permisoSrv.validarObjectId(_idPermiso)) return res.status(400).json(msgHandler.sendError('El id ingresado no cumple con el formato requerido'));

        const {error,value} = await permisoSrv.validarModelo(req.body);

        if(error) return res.status(400).json(msgHandler.sendValue(error));

        await
        permisoMdl
        .updateOne(
            {id:_idPermiso},
            {
                $set:{
                    Titulo: value.Titulo,
                    Descripcion: value.Descripcion,
                    Area: value.Area,
                    Titulo: value.Titulo,
                    Tree: value.Tree,
                    Path: value.Path,
                    FechaModificacion: Date.now()
                }
            }
        )
        .then((data)=>{return res.json(msgHandler.resultCrud(data,'Permiso','Actualizar'))})
        .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))})
    },

    /**
     *
     * Método que da de baja a un permiso
     *
     * @param {*} req
     * @param {*} res
     * @returns permisoModel
     */
    putDarBaja: async (req,res) => {
        if(!req.params.hasOwnProperty('idPermiso')) return res.status(400).json(msgHandler.sendError('La propiedad idPermiso no ha sido especificada'));
        
        const _idPermiso = req.params.idPermiso;
        if(!permisoSrv.validarObjectId(_idPermiso)) return res.status(400).json(msgHandler.sendError('El id ingresado no cumple con el formato requerido'));

        const Permiso = await permisoMdl.findOne({_id:_idPermiso});
        Permiso.set({
            Estado:false
        });

        await 
        permisoMdl
        .updateOne(
            {
                _id:_idPermiso
            },
            {
                $set:{
                    Estado:false
                }
            }
        )
        .then((data)=>{return res.json(msgHandler.resultCrud(data,'Permiso','Actualizar'))})
        .catch((err)=>{return res.status(400).sendError(err)})
    },

    /**
     * Método que da de alta a un permiso
     *
     * @param {*} req
     * @param {*} res
     * @returns permisoModel
     */
    putDarAlta: async (req,res) => {
        if(!req.params.hasOwnProperty('idPermiso')) return res.status(400).json(msgHandler.sendError('La propiedad idPermiso no ha sido especificada'));
        
        const id = req.params.idPermiso;
        if(!permisoSrv.validarObjectId(id)) return res.status(400).json(msgHandler.sendError('El id ingresado no cumple con el formato requerido'));

        await 
        permisoMdl
        .updateOne(
            {_id:id},
            {
                $set:{
                    Estado:true
                }
            }
        )
        .then((data)=>{return res.json(msgHandler.resultCrud(data,'Permisos','Actualizar'))})
        .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))});
    },

    /**
     * Procedimiento que permite dar de baja a un Permiso
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    delPermiso: async (req,res) => {
        if(!permisoSrv.validarObjectId(req.params.idPermiso)) return res.status(400).json(msgHandler.errorIdObject('IdPermiso'))
        const _idPermiso = new ObjectId(req.params.idPermiso);
        
        Task
        .remove(permisoMdl,{_id:_idPermiso})
        .update(colMdl,{'Permisos.IdPermiso':{$eq:_idPermiso}},{$pull:{Permisos:{IdPermiso:_idPermiso}}})
        .update(cargoMdl,{'Permisos.IdPermiso':{$eq:_idPermiso}},{$pull:{Permisos:{IdPermiso:_idPermiso}}});
        
        Task
        .run({useMongoose: true})
        .then((data)=>{return res.json(msgHandler.sendValue(data))})
        .catch((err)=>{return res.status(400).json(msgHandler.sendError(err))});
    }
}