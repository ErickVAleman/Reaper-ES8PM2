import { IncomingWebhook } from "@slack/client";
import happyBirthDay from '../controllers/happyBirthDayController';
import { secrets } from '../conf';

const send = new IncomingWebhook(secrets.SLACK_WEBHOOK_URL)

async function alertHappyBirthDay() {
  
  const sendmsg = msg => {
    send.send( msg ,(e, res) => {
      if(e){
        new Error("Error al enviar mensaje ha slack")
        console.error("Error al enviar mensaje ha slack")
      }else{
        console.debug("Mensaje Enviador correctamente")          
      }
    })
  }

  try {
    let hBD = new Array();
    let message = new Object();
    hBD = await happyBirthDay()
    message = {
      text: null,
      attachments: []
    }

    if(hBD.length){
      hBD.map( persons => {
        if(persons.MesesRestantes == 0 && persons.DiasRestantes == 0){
          message.text = "*Cumpliendo años hoy* :congratulations:";
          message.attachments.push({
            "color": "#3AA3E3",
            "text" : `${persons.Nombre} ${persons.FechaDeNacimiento} de ${persons.Categoria}`
          })
          console.debug(message)
          sendmsg(message);
        }else if (persons.MesesRestantes == 0 && persons.DiasRestantes == 1){
          message.text = "*Cumpliran años mañana no te olvides de felicitarlos* :congratulations:";
          message.attachments.push({
            "color": "#3AA3E3",
            "text" : `${persons.Nombre} ${persons.FechaDeNacimiento} de ${persons.Categoria}`
          })
          console.debug(message)
          sendmsg(message);
        }else if(persons.MesesRestantes == 0  && persons.DiasRestantes >= 1 && persons.DiasRestantes <= 7){
          message.text = "*Cumpliran años esta semana* :congratulations:";
          message.attachments.push({
            "color": "#3AA3E3",
            "text" : `${persons.Nombre} ${persons.FechaDeNacimiento} de ${persons.Categoria}`
          })
          console.debug(message)
          sendmsg(message);
        }
      })
    } else {
      message.text = "Por ahora nadien cumple años :smile:"
      sendmsg(message)
    }
  } catch (e) {
    new Error("No se ha devuelto la promesa hBD")
  }

}

export default alertHappyBirthDay