import select from '../db/query'

async function cambioCosto(req, res) {
  let data;
  let articulo = req.query.art
  const query = `
    SELECT 
      Almacen,Tienda,Fecha,TipoDocumento,Documento,
      Articulo,Nombre,CostoUnitarioNeto
    FROM QVDEMovAlmacen 
    WHERE Articulo = '${articulo}' 
    AND TipoDocumento NOT IN ('X')
    AND YEAR(Fecha) = 2018
    ORDER BY Fecha,Hora
  `;

  try {
    let consulta = await select(query, "BO");
    let cambio;
    let artCambio = new Array();
    data = consulta.map( item => {
      if(cambio == null) cambio = item.CostoUnitarioNeto
      if(cambio != item.CostoUnitarioNeto){
        cambio = item.CostoUnitarioNeto
        artCambio.push(item);
      } 
      return artCambio
    })
    res.status(200).json(artCambio)
  } catch (e) {
    new Error('Error al realizar consulta :cambioCostoController:')
  }
}

export default cambioCosto