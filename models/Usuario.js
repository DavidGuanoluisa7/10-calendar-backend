
// Schema: es como la información que yo voy a guardar en la Base de Datos
const {Schema, model}=require('mongoose');

const UsuarioSchema=Schema({

    //Cualquier objeto de mis usuarios ó UsuarioSchema va tener todo lo de Abajo, que es name, email y password
    name:{
        type: String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required: true
    }
});


//'Usuario': significa yo defino que se va ha llamar Usuario
module.exports=model('Usuario', UsuarioSchema);