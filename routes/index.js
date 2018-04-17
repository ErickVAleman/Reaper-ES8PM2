import express from 'express';
let router = express.Router();

router.get('/', (req, res) => {
  let users = [
    {
      nombre: "Erick"
    },
    {
      nombre: "Erick"
    },
  ]
  res.status(200).json(users)
})

export default router