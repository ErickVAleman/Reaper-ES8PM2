import happyBirthDay from '../controllers/happyBirthDayController';
import slackTool from '../tools/slackTool';

async function alertHappyBirthDay() {
  const {
    sendSlackMsg
  } = slackTool();

  try {

    let hBD = [],
      today, 
      morning, 
      day7;
      
    hBD = await happyBirthDay();

    today = {
      text: null,
      attachments: []
    }

    morning = {
      text: null,
      attachments: []
    }

    day7 = {
      text: null,
      attachments: []
    }


    if (hBD.length) {
      hBD.map(persons => {

        if (persons.MesesRestantes == 0 && persons.DiasRestantes == 0) {

          today.text = "*Cumpliendo años hoy* :congratulations:";
          today.attachments.push({
            "color": "#3AA3E3",
            "text": `${persons.Nombre} ${persons.FechaDeNacimiento} de ${persons.Categoria}`
          })


        } else if (persons.MesesRestantes == 0 && persons.DiasRestantes == 1) {

          morning.text = "*Cumpliran años mañana no te olvides de felicitarlos* :congratulations:";
          morning.attachments.push({
            "color": "#3AA3E3",
            "text": `${persons.Nombre} ${persons.FechaDeNacimiento} de ${persons.Categoria}`
          })


        } else if (persons.MesesRestantes == 0 && persons.DiasRestantes > 1 && persons.DiasRestantes <= 7) {

          day7.text = "*Cumpliran años esta semana* :congratulations:";
          day7.attachments.push({
            "color": "#3AA3E3",
            "text": `${persons.Nombre} ${persons.FechaDeNacimiento} de ${persons.Categoria}`
          })

        }
      })

      today.attachments.length ?
        sendSlackMsg(today) :
        console.log('')
      morning.attachments.length ?
        sendSlackMsg(morning) :
        console.log('')
      day7.attachments.length ?
        sendSlackMsg(day7) :
        console.log('')

    }
  } catch (e) {
    throw new Error(`Error ::: happyBirthDayService ::: ${e}`);
  }
}

export default alertHappyBirthDay
