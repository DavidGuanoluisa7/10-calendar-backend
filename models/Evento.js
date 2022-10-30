
const {Schema, model}=require('mongoose');
const { trusted } = require('mongoose');


const EventoSchema=Schema({

    title:{
        type: String,

        required: true
        //Significa que es obligatorio
    },
    notes:{
        type: String
    },
    //Fecha de inicio
    start:{
        type: Date,
        required: true
    },
    //Fecha de finalización
    end:{
        type: Date,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        //ref: 'Usuario': que va referenciado al otro esquema ó al archivo Usuario.js

        required: true
    },
});

//De esta forma podemos especificar como se serializa el Modelo, cuando se manda a llamar mongoose en "evento: eventoGuardado" del ->
// archivo events.js de controllers, esta estableciendo el serializador de los modelos. Y lo podemos sobrescribir ->
//como veremos abajo en EventoSchema.method('toJSON', function().
//Y Con esto tengo la referencia a todo el objeto que se esta serializando que es EventoSchema
EventoSchema.method('toJSON', function(){

    //__v, _id: significa que se estan extrayendo
    //...object: significa que todo lo demás va a estar almacenado en object
    const{__v, _id, ...object}=this.toObject();
    object.id=_id;
    return object;
});

module.exports=model('Evento', EventoSchema);