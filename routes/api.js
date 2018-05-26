import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { writeFile as wf } from "fs";
import happybirthday from '../services/happyBirthDayService'
import app from '../server/app';
let router = Router();

const wfNewUser = (nameFile, userDate ) => {
  wf(`${nameFile}.json`,  JSON.stringify(userDate), err => {
    if(err) throw err
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
 * JWT Secured API
 */
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
        return res.json({
          success:false ,
          message: 'Fallo al autenticar el token'
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
 * HappyBirthDay in SPA
 */

router.post('/service/happybirthday', (req, res) => {
  happybirthday(req, res);
})

export default router