const {Schema,model} = require('mongoose');

const InsumoShema = new Schema({
    Tipo:{
        type:String,
        required:true,
        enum:['Gasolina','Pasaje'],
        default:'Gasolina'
    }
});

const HojaRutaSchema = new Schema({
    Colaborador:{
        type: Schema.Types.ObjectId,
        ref:'colaboradores',
        index:true,
        required:true
    },
    Descripcion:{
        type:String,
        min: 0,
        max: 255
    },
    Casos:{
        type:[String],
        required:true,
        min:1
    },
    Kilometraje:{
        type:Schema.Types.Number,
        default:0,
        required:true,
        min:0,
        max:2000
    },
    Insumo: {
        type:String,
        required:true,
        enum:['Gasolina','Pasaje']
    },
    FechaSalida:{
        type: Schema.Types.Date,
        default:Date.now(),
        required:true,
        validate:{
            validator: function(fecha){
                return Date.now()>= fecha;
            },
            message:'La fecha tiene que ser menor a la fecha y hora actual actual'
        }
    },
    FechaData:{
        type:Schema.Types.Date,
        default:Date.now()
    },
    Estado:{
        type:Schema.Types.Boolean,
        default:Date.now(),
        required:true
    }

});

module.exports = model('Ruta',HojaRutaSchema);