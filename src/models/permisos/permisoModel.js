
const Mongoose = require('mongoose');
const { model, Schema } = Mongoose;
const TreeItemSchema = new Schema({
    Idx: {
        type:Number,
        required:true
    },
    Item: {
        type: String,
        required: true
    }
});

const PermisoSchema = new Schema({
    Titulo: {
        type: String,
        required: true,
        maxlength:20
    },
    Descripcion: {
        type:String,
        required:false,
        maxlength:255
    },
    Area: {
        type: String,
        required: true,
        maxlength:30
    },
    Tree: {
        type:[TreeItemSchema],
        required:true,
        min: 1
    },
    Path: {
        type: String,
        required: true
    },
    FechaIngreso: {
        type: Date,
        default: Date.now()
    },
    FechaModificacion: {
        type: Date,
        default: Date.now()
    },
    Estado: {
        type: Boolean,
        default: true,
        required: true
    }
});


module.exports = model("Permiso",PermisoSchema);