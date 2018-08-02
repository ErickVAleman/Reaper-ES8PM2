import select from '../db/query';
//    bo = await select(query, 'BO')
const productosController = async (req, res) => {
  let articulo = req.query.articulo;

  let urlEndPoint = `http://${req.hostname}:3001${req.baseUrl}`;
  
  if(articulo === ''){
    return res.status(500).json({
      success: false,
      message: "Falto ingresar el Articulo"
    })  
  }

  let query = `
    SELECT 
      Articulo,
      CodigoBarras,
      Nombre,
      Descripcion,
      Relacion = CAST(CAST(FactorCompra AS INT) AS NVARCHAR) + '/' + UnidadCompra + ' - ' + CAST(CAST(FactorVenta AS INT) AS NVARCHAR) + '/' + UnidadVenta,
      href = '${urlEndPoint}' + '/chequeo?articulo=' + Articulo
    FROM Articulos 
    WHERE Nombre LIKE REPLACE('${articulo}','*','%')
    ORDER BY Articulo
  `;
  let All = {
    bo: {
      data: []
    }
  }

  try {
    
    let bo = await select(query, 'BO')
    bo.map(item => {
      All.bo.data.push(item)
    })
  } catch (e) {
    throw new Error(`productosController ::: \n \t ${e} \n`)
  }
  return res.status(200).json(All)
}
export default productosController
