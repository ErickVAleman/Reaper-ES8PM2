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
      ,Fecha
      ,Almacen
      ,Documento
      ,Referencia
      ,DescripcionTienda
      ,Cajero
      ,NombreCajero
    FROM
        QVDEMovAlmacen
    WHERE Almacen = 21 
      AND TipoDocumento = 'T'
      AND Estatus = 'E' 
      AND Fecha = CAST('20180530' AS DATETIME)
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
      case 'Zaragoza':
        try {
          res = await select(query, "ZR");
        } catch (error) {
          new Error("No se logro consultar la tranferencia")
        }
        return res
        break;
      case 'Victoria':
        try {
          res = await select(query, "VC");
        } catch (error) {
          new Error("No se logro consultar la tranferencia")
        }
        return res
        break;
      case 'Oluta':
        try {
          res = await select(query, "OU");
        } catch (error) {
          new Error("No se logro consultar la tranferencia")
        }
        return res
        break;
      case 'Jaltipan':
        try {
          res = await select(query, "JL");
        } catch (error) {
          new Error("No se logro consultar la tranferencia")
        }
        return res
        break;
      default:
        return new Error("No se ha elegido una sucursal")
        break;
    }
  }

  try {
    bo = await select(query, "BO");

   data = bo.reduce((newArray, item) => {
      doc = item.Documento.split('T');
      docA = `A${doc[1]}`;
      check(item.Referencia, docA)
      .then(data => )
      .catch(err => console.log(err))
      item.status = status.length ? true : false;
      newArray= []
      newArray.push(item);
      return newArray
    },[]);
    console.log(data)

  } catch (e) {
    return new Error("Error al realizar query")
  }
  res.send(data)
}
export default transferencias