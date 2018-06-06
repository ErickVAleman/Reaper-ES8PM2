import checkPerfilCC from '../controllers/checkPerfilConsolidacionController';
import slackTool from '../tools/slackTool';

const checkPerfilConsolidacionService = async () => {
  const {
    sendSlackMsg
  } = slackTool();
  let data = {};
  let message = {
    text: "*Alerta de uso de perfil de consolidacion no permitido*",
    attachments: []
  }

  try {

    data = await checkPerfilCC();

    if (data.bo.length) {
      data.bo.map(item => {
        message.attachments.push({
          "color": "#ff0000",
          "text": `${item.Consecutivo}:   *Tienda:* ${item.TiendaOrigen}  *Ejecucion:* ${item.UltimaEjecucion}   *Perfil:* ${item.Perfil} *Caja:* ${item.Caja}`
        })
      })
      sendSlackMsg(message);
    }

    if (data.vc.length) {
      data.vc.map(item => {
        message.attachments.push({
          "color": "#ff0000",
          "text": `${item.Consecutivo}:   *Tienda:* ${item.TiendaOrigen}  *Ejecucion:* ${item.UltimaEjecucion}   *Perfil:* ${item.Perfil} *Caja:* ${item.Caja}`
        })
      })
      sendSlackMsg(message);
    }

    if (data.zr.length) {
      data.zr.map(item => {
        message.attachments.push({
          "color": "#ff0000",
          "text": `${item.Consecutivo}:   *Tienda:* ${item.TiendaOrigen}  *Ejecucion:* ${item.UltimaEjecucion}   *Perfil:* ${item.Perfil} *Caja:* ${item.Caja}`
        })
      })
      sendSlackMsg(message);
    }

    if (data.ou.length) {
      data.ou.map(item => {
        message.attachments.push({
          "color": "#ff0000",
          "text": `${item.Consecutivo}:   *Tienda:* ${item.TiendaOrigen}  *Ejecucion:* ${item.UltimaEjecucion}   *Perfil:* ${item.Perfil} *Caja:* ${item.Caja}`
        })
      })
      sendSlackMsg(message);
    }

    if (data.jl.length) {
      data.jl.map(item => {
        message.attachments.push({
          "color": "#ff0000",
          "text": `${item.Consecutivo}:   *Tienda:* ${item.TiendaOrigen}  *Ejecucion:* ${item.UltimaEjecucion}   *Perfil:* ${item.Perfil} *Caja:* ${item.Caja}`
        })
      })
      sendSlackMsg(message);
    }

  } catch (e) {
    throw new Error(`Error ::: checkPerfilConsolidacionService ::: ${e}`)
  }
}

export default checkPerfilConsolidacionService
