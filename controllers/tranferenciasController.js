import select from '../db/query'

async function transferencias(req, res) {
  let data = new Array(),
      bo = new Array(),
      doc, 
      docA, 
      status;

  const query = `
  SELECT 
    Suc = 'BO'
    ,COUNT(Articulo) AS Articulo
    ,Fecha = CAST(CONVERT(DATE,Fecha)AS VARCHAR)
    ,Almacen
    ,Documento
    ,Referencia
    ,DescripcionTienda
    ,Cajero
    ,NombreCajero
  FROM
      QVDEMovAlmacen
  WHERE TipoDocumento = 'A'
    AND Estatus = 'E' 
    AND Fecha = CAST(CONVERT(VARCHAR,GETDATE(),112) AS DATETIME)
  GROUP BY Fecha,Almacen,Documento,Referencia
  ,DescripcionTienda,DescripcionAlmacen,NombreCajero,Cajero
  `;
  async function check(sucursal, documento) {
    let res = new Array(),
      query;
    query = `
      SELECT 
        COUNT(Articulo) AS Articulos,
        Documento, Fecha, Cajero
      FROM
        QVDEMovAlmacen
      WHERE TipoDocumento = 'A'
      AND Documento = '${documento}'
      GROUP BY Documento, Fecha, Cajero
    `;
    switch (sucursal) {
      case 2:
        res = await select(query, "ZR");
        return res
        break;
      case 3:
        res = await select(query, "VC");
        return res
        break;
      case 19:
        res = await select(query, "OU");
        return res
        break;
      case 7:
        res = await select(query, "JL");
        return res
        break;
      default:
        return new Error("No se ha elegido una sucursal")
        break;
    }
  }

  try {
    bo = await select(query, "BO");

    data = bo.map(async(item) => {
        doc = item.Documento
        docA = doc
        status = await check(item.Almacen, docA)
        console.log(status.length,item.Almacen)
        item.status = status.length > 0 ? "Tranferido" : "No Tranferido"
        return item
      });

  } catch (e) {
    return new Error("Error al realizar query")
  }
  
  Promise.all(data)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(200).json(`msg: ${err}`))  
}
export default transferencias