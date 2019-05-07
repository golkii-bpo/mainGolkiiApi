const colaboradorServices = require('./colaborador.Service');
const colaboradorModel = require('./colaborador.Model');
const cargoModel = require('../cargo/cargoModel');
const msgHandler = require('../../helpers/MessageToolHandler');
const lodash = require('lodash');

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
        const _result = await colaboradorModel.find({Estado: true});
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
        const _result = await colaboradorModel.find();
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
        const {error,value} = await colaboradorServices.validarColaborador(_data);
        if(error) return res.status(400).json(msgHandler.sendError(error));

        const _Cargos = [];
        //Se obtienen los permisos que tiene el cargo
        if(Array.isArray(value.Cargo)) if(Array.from(value.Cargo).length != 0){
            Array.from(value.Cargo).forEach(item => {
                _Cargos.push(item.IdCargo);
            });
        }
        const _permisos = await cargoModel.find({_id:{$in:_Cargos}}).select({Permisos:true,_id:false});
        console.log(_permisos);
        

        //Se obtienen los permisos que tiene el cargo
        // const _cargoPermisos = (await cargoModel.findOne({_id:value.Cargo},{Permisos:true,_id:false})).toObject();
        // var cargoPermisos = [];
        // if(_cargoPermisos.hasOwnProperty('Permisos'))
        // {
        //     cargoPermisos = _cargoPermisos.Permisos.map(item => {
        //         return {IdPermiso: item.IdPermiso,IsFrom:'Cargo',FechaModificación:Date.now()}
        //     })
        // }
        // //Se agregar los datos a Permisos si es que existen datos
        // if(Array.isArray(cargoPermisos) && Array.from(cargoPermisos).length != 0){
        //     value.Permisos = cargoPermisos;
        // }

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

    putModificarCargo: async(req,res) => {
        if(!req.params.hasOwnProperty('idColaborador')) return res.status(400).json(msgHandler.Send().missingIdProperty('idColaborador'));
        
        const idCargo = req.params.idColaborador;
        if(!req.body.hasOwnProperty('Cargo')) return res.status(400).json();

        const {error,value} = await colaboradorServices.validarCargo
        if(error) return res.status(400).json(msgHandler.sendError(error));
        
        //Se realiza la busqueda de los nuevos permisos
        const NewData = await cargoModel.find({_id:idCargo},{Permisos:true});
        console.log(NewData);

        const _dataNewPermisos = NewData.Permisos.map(item =>{
            return {IdPermiso: item.IdPermiso,IsFrom:'cargo'}
        });

        console.log(_dataNewPermisos);

        // const result = await colaboradorModel.updateOne({_id:idCargo},{$set:{Cargo:idCargo}});
        res.json(null);
    }

    // putAgregarPerfil: async (req,res) => {

    // }
};