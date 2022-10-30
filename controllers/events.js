const {response}=require('express');

//Necesitamos la referencia a mi modelo para grabar la información en el backend
//Como es una importación por defecto no se necesita las llaves
const Evento=require('../models/Evento');


const getEventos=async(req, res=response)=>{

    //find(): por defecto si no tiene nada dentro del paréntesis, trae "todo" de donde este referenciado
    //populate('user', 'name'): significa que de user, sólo vamos obtener el name. Eso significa la forma en que están ubicadas ->
    //las palabras dentro del paréntesis. Y siempre va aparecer el _id aunque no se especifique.
    const eventos=await Evento.find()
                                    .populate('user', 'name');

    res.json({
        ok: true,
        eventos
    })
}

const crearEvento=async(req, res=response)=>{
    const evento=new Evento(req.body);

    try {

        evento.user=req.uid;
        const eventoGuardado=await evento.save();

        res.json({
            ok:true,
            evento: eventoGuardado
        });
        
    } catch (error) {
        console.log(error);
        res.sendStatus(500).json({
            ok:false,
            msg: 'Hable con el Administrador'
        })
        
    };
}

const actualizarEvento=async(req, res=response)=>{

    //Actualización en base de datos de los eventos
    //Obtenemos el Id de evento de esta manera
    const eventoId=req.params.id;

    const uid= req.uid;

    try {
        
        const evento=await Evento.findById(eventoId);

        //Verificamos si esto existe en la base de datos con nuestro modelo de mongoose
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        }

        //Vamos a verificar si la persona que creo este evento es la misma persona que lo quiere actualizar, y si es así entonces->
        // lo dejo pasar
        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este evento'
            });
        }

        const nuevoEvento={

            //...desestructuramos todo lo de la request.body, que es lo que esta en Body en Postman. Y adicionamente vamos a agregar->
            // el user que será igual a uid: user:uid
            ...req.body,
            user:uid
            
        }

        //El id del evento: eventoId, la nueva data que quiero guardar: nuevoEvento, y agregar configuraciones adicionales como ->
        //{new: true} que significa que quiero que regrese los datos actualizados que acabo de insertar
        const eventoActualizado=await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});

        //Esto es lo que se va a Visualizar
        res.json({
            ok: true,
            evento: eventoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el Administrador'
        });        
    }
}

const eliminarEvento=async(req, res=response)=>{

    const eventoId=req.params.id;

    const uid= req.uid;

    try {
        
        const evento=await Evento.findById(eventoId);

        //Verificamos si esto existe en la base de datos con nuestro modelo de mongoose
        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe con ese id'
            });
        }

        //Vamos a verificar si la persona que creo este evento es la misma persona que lo quiere actualizar, y si es así entonces->
        // lo dejo pasar
        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento'
            });
        }

        //El id del evento que quiero eliminar: eventoId
        //Se eliminará y desaparecerá por eso no necesita ser igualado a una constante este código
        //Eliminamos los eventos en Postman así: de "getEventos" copiamos el respectivo id de un evento, luego ponemos el id del ->
        //evento en el url de "eliminarEvento" en Postman mismo al final del url: localhost:4000/api/events/635e0725289161a4dd79d122
        await Evento.findByIdAndDelete(eventoId);

        res.json({ok: true});

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg:'Hable con el Administrador'
        });        
    }    
}

module.exports={
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento    
}


