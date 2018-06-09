import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import moment from "moment";
import helmet from 'helmet';
import session from 'cookie-session';
// secretos
import conf,{ secrets } from "../conf";

// llamada alos servicios
import hbd from "../services/happyBirthDayService";
import ccp from "../services/checkPerfilConsolidacionService";

//rutas
import index from "../routes/index";
import api from "../routes/api";

//conf de server
let app = express();
let expiryDate = new Date( Date.now() + 60*60*1000)

app.use(helmet())
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  name: 'session-Reaper',
  keys: ['kill','dead'],
  cookie: {
    secure: true,
    httpOnly: true,
    domain: conf('BO'),
    expires: expiryDate
  }
}))
app.set("superSecret", secrets.jwtSec);

// direcciones de URL
app.use("/", index);
app.use("/api/v1", api);

/**
 * services
 */
if (process.env.SERVICES === "true") {
  console.log('on Services');
  //primer llamada
  hbd();
  ccp();
  
  //llamada recurrente
  setInterval(() => {
    if (moment().format("LTS") == "9:26:30 AM") {
      hbd();
      ccp();
    }
  }, 1000);
}

// Error 404
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.type("text/plain");
  res.status(404);
  res.send("404 - Not Found");
});

// Error 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.type("text/plain");
  res.status(500);
  res.send("500 - Server Error");
});

export default app;
