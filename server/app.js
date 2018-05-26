import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import cors from 'cors'

import { secrets } from '../conf' 

//rutas
import index from '../routes/index';
import api from '../routes/api'

//conf de server
let app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('superSecret',secrets.jwtSec)

// direcciones de URL
app.use('/', index);
app.use('/api/v1', api)

// Error 404
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
})

// Error 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('50 - Server Error');
})

export default app