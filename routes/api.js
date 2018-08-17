import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { writeFile as wf } from "fs";
import apicache from 'apicache';
import happybirthday from '../controllers/happyBirthDayController';
import tranferencias from '../controllers/tranferenciasController';
import cambioCosto from '../controllers/cambioCostoController';
import checkPerfil from '../controllers/checkPerfilConsolidacionController';
import ventaArticulo from '../controllers/getVentaProductoController';
import AnalisisArticulos from '../controllers/getAnalisisArticulosController';


import chequeo from '../controllers/chequeoController';
import productos from '../controllers/productosController';



import app from '../server/app';

let cache = apicache.middleware;
const { ListaArticulos, DetalleArticulo } = AnalisisArticulos();

let router = Router();

const wfNewUser = (nameFile, userDate ) => {
  wf(`db.json`,  JSON.stringify(userDate), err => {
    if(err) throw err+
    console.log(`save file ${nameFile}.json`)
  })
} 

router.post('/register',(req, res) => {
  let user = req.body.user || req.params.user || req.query.user
  let pass = req.body.pass || req.params.pass || req.query.pass
  let data = new Object();

  if(!user || !pass){
    return res.status(403).json({
      success: false,
      message: "Falta contraseña o usuario"
    })
  }else{
    data.user = user
    data.pass = pass
    let token =  jwt.sign(data, app.get('superSecret'), {
      expiresIn:"1 days"
    })
    if(token) data.token = token
    wfNewUser(`${user}+${pass}`, data)
    res.status(200).json({
      success: true,
      data: data,
      token: token
    })
  }
})

/**
 * Rutas no estrictamente seguras
 */

router.get('/service/happybirthday', (req, res) => {
  happybirthday(req, res);
})

router.get('/tranferencias', (req, res) => {
  tranferencias(req, res);
})

router.get('/AnalizarCostos', (req, res) => {
  cambioCosto(req, res);
})

router.get('/checkPerfil', (req, res) => {
  checkPerfil(req, res)
});

//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
router.get('/venta/articulo',(req, res) => ventaArticulo(req, res));
router.get('/consulta/articulos', (req, res) => ListaArticulos(req, res));
router.get('/consulta/articulosdetalle',cache('5 minutes'), (req, res) => DetalleArticulo(req, res));
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->

router.get('/productos', (req, res) => productos(req, res));
router.get('/chequeo', (req, res) => chequeo(req, res));
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
/**
 * JWT Secured API
 */
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------------------------->
router.use((req, res, next) => {
  let token = req.body.token || req.params.token || req.query.token || req.headers.token
  if(!token){
    return res.status(401).json({
      success: false,
      message: "Error token no ha especificado el token, se le ha inpedido el acceso"
    })    
  }else {
    jwt.verify(token, app.get('superSecret'),(err, decoded) => {
      if(err){
        return res.status(401).json({
          success:false ,
          message: 'Fallo al autenticar el token, su token ha expirado o es incorrecto'
        })
      }else{
        console.log('paso')
        req.decoded = decoded
        next();
      }
    })
  }
})

/**
 * secured API in SPA
 */


export default router
