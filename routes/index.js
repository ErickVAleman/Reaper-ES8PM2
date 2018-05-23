import express from 'express';
import consolidacionHoy from '../controllers/consolidacion'
let router = express.Router();

router.get('/', (req, res) => {
  consolidacionHoy(req, res);
})

export default router