import {Schema,model} from 'mongoose';
import { string } from 'joi';

const 
    InsumoShema = new Schema({
        Tipo:{
            type:String,
            required:true,
            enum:['Gasolina','Transporte','Alimento']
        },
        Observacion:{
            type:String,
            required:function(){
                return this.Tipo != 'Alimento';
            },
            min:10,
            max:50
        },
        Valor:{
            type:Number,
            required:true,
            min:0,
            max:5000
        },
        Kilometro:{
            type:Number,
            default:0,
            required:function(){
                return this.Tipo == 'Gasolina';
            },
            min:0,
            max:2000
        }
    }),
    HojaRutaSchema = new Schema({
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
            min:1,
            max:50
        },
        Insumos: {
            type:[InsumoShema],
            required:true
        },
        FechaSalida:{
            type: Date,
            default:new Date(),
            required:true,
            validate:{
                validator: function(fecha){
                    return new Date()>= fecha;
                },
                message:'La fecha tiene que ser menor a la fecha y hora actual actual'
            }
        },
        FechaData:{
            type:Date,
            default:Date.now()
        },
        Estado:{
            type:Boolean,
            default:Date.now(),
            required:true
        }
    });

export default model('Ruta',HojaRutaSchema);