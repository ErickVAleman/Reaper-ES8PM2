import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';

//rutas
import index from '../routes/index';

//conf de server
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// direcciones de URL
app.use('/', index);


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