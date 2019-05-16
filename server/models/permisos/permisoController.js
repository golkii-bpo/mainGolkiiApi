const 
    permisoModel = require('./permisoModel'),
    permisoService = require('./permisoServices'),
    msgHandler = require('../../helpers/msgHandler'),
    Fawn = require('fawn'),
    db = require('mongoose');
    
    Fawn.init(db);
const 
    Task = Fawn.Task;

module.exports = {

    /**
     *  Método que devuelve todos los permisos activos
     *
     * @param {*} req
     * @param {*} res
     * @returns Array<permisoModel>
     */
    getBuscar: async (req,res) => {
        await permisoModel
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
        permisoModel
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
        permisoModel
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
        const{error,value} = await permisoService.validarModelo(req.body);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        await 
        permisoModel
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
        if(!permisoService.validarObjectId(_idPermiso)) return res.status(400).json(msgHandler.sendError('El id ingresado no cumple con el formato requerido'));

        const {error,value} = await permisoService.validarModelo(req.body);

        if(error) return res.status(400).json(msgHandler.sendValue(error));

        await
        permisoModel
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

        const Permiso = await permisoModel.findById(_idPermiso);
        Permiso.set({
            
        });

        await 
        Permiso
        .save()
        return res.json(_Permiso);
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
        
        const id = req.params.idPermiso;
        if(!permisoService.validarObjectId(id)) return res.status(400).json(msgHandler.sendError('El id ingresado no cumple con el formato requerido'));

        const Permiso = await permisoModel.findOne({_id:id});
        Permiso.set({
            Estado:false
        });
        
        let _Permiso = await Permiso.save();
        return res.json(_Permiso);
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
        if(!permisoService.validarObjectId(id)) return res.status(400).json(msgHandler.sendError('El id ingresado no cumple con el formato requerido'));

        const Permiso = await permisoModel.findOne({_id:id});
        Permiso.set({
            Estado:true
        });
        
        let _Permiso = await Permiso.save();
        return res.json(_Permiso);
    },

    /**
     * Procedimiento que permite dar de baja a un Permiso
     *
     * @param {*} req
     * @param {*} res
     * @returns
     */
    delEliminar: async (req,res) => {
        if(!req.params.hasOwnProperty('idPermiso')) return res.status(400).json(msgHandler.sendError('La propiedad idPermiso no ha sido especificada'));

        const idPermiso = req.params.idPermiso;
        const _resultado = await permisoModel.deleteOne({_id:id});
        return res.json(_resultado);
    }
}