/*
    Event Routes
    /api/events
*/
const {Router}=require('express');
const {check}=require('express-validator');
const {validarJWT}=require('../middlewares/validar-jwt');
//Al hacer un middleware significa que tengo que colocarselo a cada una de las 4 peticiones router de Abajo

//middleware que tengo que llamar después de todos los checks
const {validarCampos}=require('../middlewares/validar-campos');

const {isDate}=require('../helpers/isDate');

const {getEventos, crearEvento, actualizarEvento, eliminarEvento}=require('../controllers/events');

const router=Router();

//Todos tienen que pasar por la Validación de JWT


//Para validar cada uno de los siguientes eventos puedo usar el middleware de la siguiente manera
router.use(validarJWT);
// router.use(validarJWT) :significa cualquier petición que se encuentre justo abajo de esto va a tener que tener su JWT
//Si cualquiera de las rutas de abajo fuera pública tendría que estar antes de Esta Línea xq no va requerir la validación de JWT


//Obtener eventos
router.get('/', getEventos);

//Crear un Nuevo Evento

//check: es para validar la información obligatoria de la función EventoSchema en el archivo Evento.js
//el check: es to lo que se encuentra dentro de [], y es una colección de middlewares que tengo que llamar
router.post(
    '/',
    [
        //En check 1ro va el título, 2do el mensaje de error 
        check('title', 'El título es obligatorio').not().isEmpty(),

        //custom(): es para agregar una función externa que haga la validación
        check('start', 'Fecha de inicio obligatoia').custom(isDate),

        //El Título 'end': se conecta directamente al end:{} del archivo Evento.js. Ya que para funcionar deben tener el mismo Nombre
        check('end', 'Fecha de finalización obligatoia').custom(isDate),
        validarCampos
    ], 
    crearEvento);

//Actualizar Evento
router.put(
    '/:id',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    actualizarEvento);

//Borrar Evento
router.delete('/:id', eliminarEvento);


module.exports=router;

//Para trabajar con nuestros endpoints que son los 4 de Arriba tal vez-> 
//vamos a ocupar nuestro Modelo de Evento, que nos va a permitir grabar, leer, ->
//actualizar y eliminar.