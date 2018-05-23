import query from '../db/query'
async function ConsolidacionG(req, res) {
  query(`
  SELECT TipoDocumento, Consecutivo
  ,COUNT(Articulo) AS Articulos, Referencia
  ,NombreCajero, Hora
  FROM [SPAOLUTA.DYNDNS.ORG].SPAOLUTA.dbo.QVDEMovAlmacen
  WHERE TipoDocumento = 'A'
    AND Fecha = CAST(CONVERT(DATE ,GETDATE(), 112) AS DATETIME)
    AND Tienda = 6
  GROUP BY Referencia, Consecutivo, NombreCajero, Hora, TipoDocumento
  UNION ALL
  SELECT TipoDocumento, Consecutivo
  ,COUNT(Articulo) AS Articulos, Referencia
  ,NombreCajero, Hora
  FROM [SPAJALTIPAN.DYNDNS.ORG].SPAJALTIPAN.dbo.QVDEMovAlmacen
  WHERE TipoDocumento = 'A'
    AND Fecha = CAST(CONVERT(DATE ,GETDATE(), 112) AS DATETIME)
    AND Tienda = 6
  GROUP BY Referencia, Consecutivo, NombreCajero, Hora, TipoDocumento
  UNION ALL
  SELECT TipoDocumento COLLATE Traditional_Spanish_ci_ai, Consecutivo
  ,COUNT(Articulo) AS Articulos, Referencia COLLATE Traditional_Spanish_ci_ai
  ,NombreCajero COLLATE Traditional_Spanish_ci_ai, Hora
  FROM [SPACENTRO.DYNDNS.ORG].SPACENTRO.dbo.QVDEMovAlmacen
  WHERE TipoDocumento = 'A'
    AND Fecha = CAST(CONVERT(DATE ,GETDATE(), 112) AS DATETIME)
    AND Tienda = 6
  GROUP BY Referencia, Consecutivo, NombreCajero, Hora, TipoDocumento
  UNION ALL
  SELECT TipoDocumento, Consecutivo
  ,COUNT(Articulo) AS Articulos, Referencia
  ,NombreCajero, Hora
  FROM [SPASUPERUNO.DYNDNS.ORG].SPASUPER1.dbo.QVDEMovAlmacen
  WHERE TipoDocumento = 'A'
    AND Fecha = CAST(CONVERT(DATE ,GETDATE(), 112) AS DATETIME)
    AND Tienda = 6
  GROUP BY Referencia, Consecutivo, NombreCajero, Hora, TipoDocumento
  `)
  .then( resp => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.status(200).send(JSON.stringify(resp))
  })
  .catch( err => {
    res.status(503).json({ message : `${err}` })
  })
}

export default ConsolidacionG