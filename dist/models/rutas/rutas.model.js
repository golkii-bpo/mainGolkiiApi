"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InsumoShema = new mongoose_1.Schema({
    Tipo: {
        type: String,
        required: true,
        enum: ['Gasolina', 'Pasaje'],
        default: 'Gasolina'
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
    Kilometraje: {
        type: mongoose_1.Schema.Types.Number,
        default: 0,
        required: true,
        min: 0,
        max: 2000
    },
    Insumo: {
        type: String,
        required: true,
        enum: ['Gasolina', 'Pasaje']
    },
    FechaSalida: {
        type: mongoose_1.Schema.Types.Date,
        default: Date.now(),
        required: true,
        validate: {
            validator: function (fecha) {
                return Date.now() >= fecha;
            },
            message: 'La fecha tiene que ser menor a la fecha y hora actual actual'
        }
    },
    FechaData: {
        type: mongoose_1.Schema.Types.Date,
        default: Date.now()
    },
    Estado: {
        type: mongoose_1.Schema.Types.Boolean,
        default: Date.now(),
        required: true
    }
});
exports.default = mongoose_1.model('Ruta', HojaRutaSchema);
