"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InsumoShema = new mongoose_1.Schema({
    Tipo: {
        type: String,
        required: true,
        enum: ['Gasolina', 'Transporte', 'Alimento']
    },
    Observacion: {
        type: String,
        required: function () {
            return this.Tipo != 'Alimento';
        },
        min: 10,
        max: 50
    },
    Valor: {
        type: Number,
        required: true,
        min: 0,
        max: 5000
    },
    Kilometro: {
        type: Number,
        default: 0,
        required: function () {
            return this.Tipo == 'Gasolina';
        },
        min: 0,
        max: 2000
    }
}), HojaRutaSchema = new mongoose_1.Schema({
    Colaborador: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'colaboradores',
        index: true,
        required: true
    },
    Descripcion: {
        type: String,
        min: 0,
        max: 255
    },
    Casos: {
        type: [String],
        required: true,
        min: 1
    },
    Insumos: {
        type: [InsumoShema],
        required: true
    },
    FechaSalida: {
        type: Date,
        default: new Date(),
        required: true,
        validate: {
            validator: function (fecha) {
                return new Date() >= fecha;
            },
            message: 'La fecha tiene que ser menor a la fecha y hora actual actual'
        }
    },
    FechaData: {
        type: Date,
        default: Date.now()
    },
    Estado: {
        type: Boolean,
        default: Date.now(),
        required: true
    }
});
exports.default = mongoose_1.model('Ruta', HojaRutaSchema);