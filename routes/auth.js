/*
Rutas de Usuarios / Auth
host + /api/auth
*/


//Router esta desestructurado de 'express'
const {Router}=require('express');

//check: es un middleware que se va a encargar de validar un campo a la vez
const {check}=require('express-validator');

const {validarCampos}=require('../middlewares/validar-campos');

const {crearUsuario, loginUsuario, revalidarToken}=require('../controllers/auth')

const {validarJWT}=require('../middlewares/validar-jwt');


const router=Router();


//Las 4 peticiones necesarias: sólo son GET, POST, PUT, DELETE
//  /: el slash hace referencia a lo que esta esperando en Chrome en localhost:4000/
// req: request, res: response
router.post(
    '/new',
    [//colección de middlewares

        //not().isEmpty(): significa el nombre no puede estar vacío
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener 6 caracteres').isLength({min:6}),
        validarCampos
    ],
     crearUsuario
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe tener 6 caracteres').isLength({min:6}),
        validarCampos
    ],
    loginUsuario
);

//  /renew: va a verificar el JWT actual y va a regresar un nuevo JWT para seguir prolongandose otras 2 horas, mientras el usuario->
//este activo
router.get('/renew', validarJWT, revalidarToken);

//Exportación en Node, exportación por defecto
module.exports=router;

// post: para crear un nuevo usuario xq necesito hacer un posteo de información