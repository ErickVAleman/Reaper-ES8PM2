import express from 'express';
import consolidacionHoy from '../controllers/consolidacion'
let router = express.Router();

router.get('/', (req, res) => {
  consolidacionHoy(req, res)
})

router.get('/cotizacion' , (req, res) => {
  res.status(200).send("Cotizacion")
})

export default router