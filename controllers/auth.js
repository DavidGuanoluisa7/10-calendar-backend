//No vuelve hacer la carga de express, sino que vuelve a usar la librería ya cargada
const {response}=require('express');

const bcrypt=require('bcryptjs');

const Usuario=require('../models/Usuario');

const {generarJWT}=require('../helpers/jwt');

const crearUsuario=async(req, res=response)=>{

    //ESTO HICIMOS PRIMERO
    //PODEMOS BORRAR TODO LO DE ABAJO GRACIAS AL PAQUETE npm i express-validator
    // if(name.length<5){

    //     //después de hacer el return ya no va seguir ejecutandose Nada
    //     //status(400): significa un código de error, que nosotros debemos establecer con status(). También podemos ver->
    //     //todos los códigos de error en: https://www.restapitutorial.com/httpstatuscodes.html
    //     return res.status(400).json({
    //         ok: false,
    //         msg: 'El nombre debe tener 5 letras'
    //     });
    // }


    //ESTO HICIMOS SEGUNDO, Y LO BORRAMOS YA QUE CREAMOS UN CUSTOM MIDDLEWARE
    // //Manejo de errores

    // //El Código de abajo esta manejando "Todos los errores", ya no se debe hacer lo mismo en las Funciones que Siguen
    // //validationResult(): permite obtener todos los errores de req, y ya mostrarlos con console.log(errors) en la Consola de Git
    // const errors=validationResult(req);
    // if(!errors.isEmpty()){

    //     //Confirmado por Fernando, después de hacer return ya no se ejecuta lo de Abajo
    //     return res.status(400).json({
    //         ok: false,
    //         errors: errors.mapped()
    //         //mapped(): permite mostrar los errores en Postman
    //     });
    // }


    const {email, password}=req.body;
    //Dentro de request esta el body, y dentro del body en Postman esta la información de Usuario creada en Postman

    try {

        // sólo email aquí ({email}): significa ({email:email}), xq estamos en javascripst podemos ponerlo así ({email})
        //findOne: es una promesa x lo que podemos usar el await
        let usuario= await Usuario.findOne({email});
        //Usando let, ya no es necesario declarar constante poniendo: const usuario=new Usuario(req.body), sino sólo así: ->
        // usuario=new Usuario(req.body), es decir sin declarar como constante(const)

        //Si el usuario existe retornaremos lo de abajo
        if(usuario){
            return res.status(400).json({
                ok: false,
                masg: 'Un usuario existe con ese Correo'
            });
        }

        //Creamos una nueva instancia llamada "usuario" de Usuario que fue importado Arriba
        usuario=new Usuario(req.body);

        //Encriptar Contraseña
        //Antes de hacer la grabación en Base de Datos vamos a Encriptar Contraseña
        const salt=bcrypt.genSaltSync();
        usuario.password=bcrypt.hashSync(password, salt);        

        //save(): es una promesa por eso puedo agregar el await y arriba también async en async(req, res=response)
        //Y esto también es para guardar en la base de datos
        await usuario.save();

        //Generar JWT
        //Y ya almacena el token en const token
        const token=await generarJWT(usuario.id, usuario.name);


        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token

            // name,
            // email, 
            // password
        }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Please hable con el Admonistrador'
        });
        
    }
    
}

const loginUsuario=async(req, res=response)=>{    

    const {email, password}=req.body;    

    try {

        //Buscamos un Usuario x el email
        const usuario= await Usuario.findOne({email});
        //Como no volvemos a reutilizar let usuario como arriba, ponemos únicamente const usuario
       
        //Luego retornamos el Usuario Aquí
        if(!usuario){
            return res.status(400).json({
                ok: false,
                masg: 'Un usuario no existe con ese Email'
            });
        }

        //Confirmar los Passwords

        //Esto regresará true si es válido y false si no lo es
        const validPassword=bcrypt.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Password Incorrecto'
            })
        }

        //Generar Nuestro JWT(Json Web Token)
        //Si Confirmar los Passwords sale bien, estamos listos para Generar Nuestro JWT
        //Estos Tokens me permiten manejar el estado de la sesión del usuario de forma pasiva

        const token=await generarJWT(usuario.id, usuario.name);



        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Please hable con el Admonistrador'
        });        
    }

    // res.json({
    //     ok: true,
    //     msg:'login',
    //     email,
    //     password
    // })

}

//revalidarToken: para renovar el token y darle una nueva vigencia de 2 horas y estarlo prologando 2 horas->
//mientras el usuario este activo
const revalidarToken=async(req, res=response)=>{  
    
    const {uid, name}= req;

    //Generar un nuevo JWT y Retornarlo en esta petición
    const token=await generarJWT(uid, name);


    res.json({
        ok: true,       
        token
    })

}

module.exports={
    crearUsuario,
    loginUsuario,
    revalidarToken
}