import express from 'express';
let router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({title:"Bienvenidos a la API de Super Promociones Acayucan"})
})

router.get('/cotizacion' , (req, res) => {
  res.status(200).send("Cotizacion")
})

export default router