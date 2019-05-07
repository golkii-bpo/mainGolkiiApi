const Mongoose = require('mongoose');
const {Schema,model} = Mongoose;

//Item de Permisos
const permisoSchema = new Schema({
    IdPermiso:{
        type: Schema.Types.ObjectId,
        ref: 'Permisos'
    },
    IsFrom:{
        type:String,
        enum:['Manual','Cargo'],
        required:true
    },
    FechaModificacion:{
        type:Date,
        default:Date.now()
    }
});

const PerfilSchema = new Schema({
    Foto:{
        type:String
    },
    Settings: new Schema({
        DarkMode:{
            type:Boolean,
            default:false
        },
        SideBar:{
            type:Boolean,
            default:false
        }
    })
});

const GeneralSchema = new Schema({
    Nombre:{
        type:String,
        required:true,
        minlength:5,
        maxlength:30
    },
    Apellido:{
        type:String,
        required:true,
        minlength:5,
        maxlength:30
    },
    Cedula:{
        type:String,
        required:true,
        index:true,
        unique:true,
        match:/\d{3}-{0,1}\d{6}-{0,1}\d{4}[A-z]{1}/
    },
    Email: {
        type:String,
        index: true,
        match:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    }
})

//Item de User
const UserSchema = new Schema({
    userName:{
        type:String,
        required:()=>{
            if(this.userName != null || this.password != null) return true;
            return false
        }
    },
    password:{
        type:String,
        required:()=>{
            if(this.userName != null || this.password != null) return true;
            return false
        }
    },
    Olvidada:{
        type:Boolean,
        default:false
    },
    fechaModificacion: {
        type: Date,
        default: Date.now()
    }
});

const LogSchema = new Schema({
    FechaModificacion:{
        type:Date,
        default:Date.now()
    },
    Propiedad:{
        type:String,
        required:true,
        index: true
    },
    Data:{
        type:JSON,
        required:true
    }
});

const CargoSchema = new Schema({
    IdCargo:{
        type:Schema.Types.ObjectId,
        ref:'cargos'
    },
    FechaIngreso:{
        type:Date,
        default:Date.now()
    }
})

//Main Schema
const ColaboradoresSchema = new Schema({
    General:{
        type: GeneralSchema,
        required: true
    },
    Cargo:{
        type: [CargoSchema],
        required:true
    },
    Permisos: {
        type: [permisoSchema],
        default:[]
    },
    User: {
        type : UserSchema,
        default:{
            userName:null,
            password:null,
            Olvidada: false,
            fechaModificacion: Date.now()
        }
    },
    Perfil: {
        type: PerfilSchema,
        default: {
            Foto:null,
            Settings:{
                DarkMode:false,
                SideBar:false
            }
        }
    },
    Estado : {
        type: Boolean,
        default: true
    },
    Log:{
        type:[LogSchema],
        default:[]
    }
});

ColaboradoresSchema.post('save', function(error, doc, next) {
    console.log(error);
    if (error.name === 'MongoError' && error.code === 11000){
        if(RegExp(/Cedula/).test(error.errmsg)) next(new Error('La cedula del colaborador ya se encuentra registradad'));
    };
    if(error) next(error);
    next();
});

module.exports = model('Colaborador',ColaboradoresSchema,'colaboradores');