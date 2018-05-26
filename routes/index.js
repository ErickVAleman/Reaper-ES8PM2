import express from 'express';
let router = express.Router();

router.get('/', (req, res) => {
  res.send('wellcome to API')
})

export default router