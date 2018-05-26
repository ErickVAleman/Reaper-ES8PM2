import express from 'express';
import happybirthday from '../services/happyBirthDayService'
let router = express.Router();

router.get('/service/happybirthday', (req, res) => {
  happybirthday(req, res);
})

export default router