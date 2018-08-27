const conf = {
  dialect : 'mssql',
  hosts:{
    local: 'localhost',
    ZR: 'spasuperuno.dyndns.org',//'spasuperuno.dyndns.org',
    VC: 'spacentro.dyndns.org',
    OU: 'spaoluta.dyndns.org',
    JL: 'spajaltipan.dyndns.org',
    BO: 'spabodega.dyndns.org',
    HP: '192.168.123.63'
  },
  db:{
    local: 'localhost',
    ZR: 'spasuper1',
    VC: 'spacentro',
    OU: 'spaoluta',
    JL: 'spajaltipan',
    BO: 'spabodega',
    HP: 'CA2015'
  },
  num:{
    ZR: {tienda: 1, almacen: 2},
    VC: {tienda: 2, almacen: 3},
    OU: {tienda: 5, almacen: 19},
    JL: {tienda: 4, almacen: 7},
    BO: {tienda: 6, almacen: 21},
  },
  port: 1433,
  user: 'sa',
  password: 'wincaja', 
}

const secrets = { 
  jwtSec : "Reaperv1",
  SLACK_WEBHOOK_URL: process.env.ENV_NODE === "true" ? "https://hooks.slack.com/services/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" : "https://hooks.slack.com/services/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", 
}

const db = item => {
  item = item.toUpperCase()
  let resp = `${conf.dialect}://${conf.user}:${conf.password}@${conf.hosts[item]}/${conf.db[item]}`
  return resp
}

const tienda = item => {
  item = item.toUpperCase()
  let resp = `DECLARE @Sucursal NVARCHAR(2) = '${item}', @Almacen INT = ${conf.num[item].almacen}, @Tienda INT = ${conf.num[item].tienda}`
  return resp
}

export default db
export {
  secrets,
  tienda
}
