import select from '../db/query';
//    bo = await select(query, 'BO')
const getVentaProductoController = async (req, res) => {
  let articulo = req.query.articulo;
  
  if(articulo == ''){
    return res.status(500).json({
      success: false,
      message: "Falto ingresar el Articulo"
    })  
  }

  let query = `
    SELECT 
      TipoDocumento,
      Documento,
      Articulo,
      Nombre,
      Descripcion,
      CantidadRegular,
      CantidadRegularUC,
      CostoValorNeto,
      Precio,
      Fecha
    FROM QVDEMovAlmacen
    WHERE TipoDocumento IN ('V', 'T') AND Estatus = 'E'
    AND Articulo = '${articulo}' 
    AND Fecha BETWEEN CAST('20180612' AS DATETIME) AND CAST('20180617' AS DATETIME)
    ORDER BY Fecha DESC
  `;
  let All = {
    bo: {
      data: [],
      CantidadRegular: null,
      CantidadRegularUC: null,
      CostoValorNeto: null,
      Precio: null
    },
    zr: {
      data: [],
      CantidadRegular: null,
      CantidadRegularUC: null,
      CostoValorNeto: null,
      Precio: null
    },
    vc: {
      data: [],
      CantidadRegular: null,
      CantidadRegularUC: null,
      CostoValorNeto: null,
      Precio: null
    },
    ou: {
      data: [],
      CantidadRegular: null,
      CantidadRegularUC: null,
      CostoValorNeto: null,
      Precio: null
    },
    jl: {
      data: [],
      CantidadRegular: null,
      CantidadRegularUC: null,
      CostoValorNeto: null,
      Precio: null
    }
  }

  try {
    
    let bo = await select(query, 'BO')
    let zr = await select(query, 'ZR')
    let vc = await select(query, 'VC')
    let ou = await select(query, 'OU')
    let jl = await select(query, 'JL')
    
    zr.map(item => {
      if(item.TipoDocumento == 'V'){
        All.zr.CantidadRegular += item.CantidadRegular;
        All.zr.CantidadRegularUC += item.CantidadRegularUC;
        All.zr.CostoValorNeto += item.CostoValorNeto;
        All.zr.Precio += item.Precio;
      } else {
        All.zr.CantidadRegular += item.CantidadRegular;
        All.zr.CantidadRegularUC += item.CantidadRegularUC;    
      }
      All.zr.data.push(item)
    })
    vc.map(item => {
      if(item.TipoDocumento == 'V'){
        All.vc.CantidadRegular += item.CantidadRegular;
        All.vc.CantidadRegularUC += item.CantidadRegularUC;
        All.vc.CostoValorNeto += item.CostoValorNeto;
        All.vc.Precio += item.Precio;
      }else{
        All.vc.CantidadRegular += item.CantidadRegular;
        All.vc.CantidadRegularUC += item.CantidadRegularUC;  
      }
      All.vc.data.push(item)
    })
    ou.map(item => {
      if(item.TipoDocumento == 'V'){
        All.ou.CantidadRegular += item.CantidadRegular;
        All.ou.CantidadRegularUC += item.CantidadRegularUC;
        All.ou.CostoValorNeto += item.CostoValorNeto;
        All.ou.Precio += item.Precio;
      }else{
        All.ou.CantidadRegular += item.CantidadRegular;
        All.ou.CantidadRegularUC += item.CantidadRegularUC;  
      }
      All.ou.data.push(item)
    })
    jl.map(item => {
      if(item.TipoDocumento == 'V'){
        All.jl.CantidadRegular += item.CantidadRegular;
        All.jl.CantidadRegularUC += item.CantidadRegularUC;
        All.jl.CostoValorNeto += item.CostoValorNeto;
        All.jl.Precio += item.Precio;
      }else{
        All.jl.CantidadRegular += item.CantidadRegular;
        All.jl.CantidadRegularUC += item.CantidadRegularUC;  
      }
      All.jl.data.push(item)
    })
    bo.map(item => {
      All.bo.CantidadRegular += item.CantidadRegular;
      All.bo.CantidadRegularUC += item.CantidadRegularUC;
      All.bo.CostoValorNeto += item.CostoValorNeto;
      All.bo.Precio += item.Precio;
      All.bo.data.push(item)
    })
  } catch (e) {
    throw new Error(`getVentaProductoController ::: \n \t ${e} \n`)
  }
  return res.status(200).json(All)
}
export default getVentaProductoController
