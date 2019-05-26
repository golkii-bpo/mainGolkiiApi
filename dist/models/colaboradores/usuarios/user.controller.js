var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const UsrSrv = require('./user.services'), ColMdl = require('../general/colaborador.model'), ObjectId = require('mongoose').Types.ObjectId, msgHandler = require('../../../helpers/msgHandler');
module.exports = {
    postAgregarUsuario: (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { error, value } = yield UsrSrv.valAgregar(idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler.sendError(error));
        const idColaborador = new ObjectId(req.params.idColaborador.toString());
        yield ColMdl
            .updateOne({
            _id: idColaborador,
            'User.IsCreated': false,
            Estado: true
        }, {
            $set: {
                'User.User': value.User,
                'User.password': value.password,
                'User.IsCreated': true
            }
        })
            .then((data) => {
            return res.json(msgHandler.resultCrud(data, 'Usuario', 'actualización'));
        })
            .catch((err) => {
            return res.status(400).json(msgHandler.sendError(err));
        });
    }),
    putModUser: (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { error, value } = yield UsrSrv.valModUsr(idColaborador, data);
        if (error)
            return res.status(400).json(msgHandler.sendError(error));
        const idColaborador = new ObjectId(req.params.idColaborador.toString()), data = req.body;
        pwdSalt = yield bcrypt.genSaltSync(10),
            pwdCrypted = yield bcrypt.hashSync(value.password, pwdSalt);
        let UserData = yield ColMdl.findById(idColaborador).lean(true);
        if (!UserData.hasOwnProperty('User'))
            throw new Error('Este modelo no se puede actualizar debido a la insuficiencia de datos del modelo');
        UserData = UserData.User;
        yield ColMdl
            .updateOne({
            _id: idColaborador,
            Estado: true
        }, {
            $set: {
                'User.User': value.User,
                'User.password': pwdCrypted,
                'User.FechaModificacion': Date.now()
            },
            $push: {
                Log: {
                    Propiedad: 'User',
                    Data: {
                        User: UserData.User
                    },
                    FechaModificacion: Date.now()
                }
            }
        })
            .then((data) => {
            return res.json(msgHandler.sendValue(data));
        })
            .catch((err) => {
            return res.status(400).json(msgHandler.sendError(err));
        });
    }),
    putModUserName: (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { error, value } = yield UsrSrv.valModUsrName(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler.sendError(error));
        const idColaborador = new ObjectId(req.params.idColaborador), newUser = value.NewUser, oldUser = value.OldUser;
        yield ColMdl
            .updateOne({
            _id: idColaborador,
            'User.User': oldUser
        }, {
            $set: {
                'User.User': newUser,
                'User.FechaModificacion': Date.now()
            }
        })
            .then((data) => { return res.json(msgHandler.sendValue(data)); })
            .catch((err) => { return res.status(400).json(msgHandler.sendError(err)); });
    }),
    putChangePwd: (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { error, value } = yield UsrSrv.valChangePwd(req.params.idColaborador, req.body);
        if (error)
            return res.status(400).json(msgHandler.sendError(error));
        let idColaborador = new ObjectId(req.params.idColaborador), data = value;
        yield ColMdl
            .updateOne({
            _id: idColaborador, 'User.User': value.User
        }, {
            $set: {
                'User.password': value.NewPassword,
                'User.FechaModificacion': Date.now()
            }
        })
            .then((data) => {
            return res.json(msgHandler.resultCrud(data, 'Usuario', 'actualizar'));
        })
            .catch((err) => {
            return res.status(400).json(msgHandler.sendError(err));
        });
    }),
    putDisableUser: (req, res) => __awaiter(this, void 0, void 0, function* () {
        return res.json(null);
    })
};
