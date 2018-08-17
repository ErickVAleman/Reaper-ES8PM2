import { IncomingWebhook } from "@slack/client";
import { secrets } from '../conf';

const send = new IncomingWebhook(secrets.SLACK_WEBHOOK_URL);
const slack = () => {
  
  const sendSlackMsg = msg => {
    send.send( msg ,(e, res) => {
      if(e){
        new Error("Error al enviar mensaje ha slack")
        console.error("Error al enviar mensaje ha slack")
      }else{
        console.debug("Mensaje Enviador correctamente")          
      }
    })
  }

  return {
    sendSlackMsg,
  }

} 
export default slack
