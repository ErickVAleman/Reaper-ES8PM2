import express from 'express';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import index from '../routes/index'

let app = express();
const port = process.env.ENV_PORT || 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', index);


export default app