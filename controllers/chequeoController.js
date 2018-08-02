import select from '../db/query';
//    bo = await select(query, 'BO')
const chequeoController = async (req, res) => {
  let articulo = req.query.articulo;
  
  if(articulo == ''){
    return res.status(500).json({
      success: false,
      message: "Falto ingresar el Articulo"
    })  
  }

  let queryGeneral = `
    DECLARE @Almacen INT = 21, @Tienda INT = 6

    SELECT 
        Articulo,Nombre,
        Relacion = CAST(CAST(FactorCompra AS INT) AS NVARCHAR) + '/' + UnidadCompra + ' - ' + CAST(CAST(FactorVenta AS INT) AS NVARCHAR) + '/' + UnidadVenta
    FROM QVExistencias
    WHERE Almacen = @Almacen AND Tienda = @Tienda
        AND Articulo = '${articulo}'
  `;

  let queryBO = `
    DECLARE @Sucursal NVARCHAR(2) = 'BO', @Almacen INT = 21, @Tienda INT = 6

    SELECT Suc = @Sucursal,
        --Articulo,Nombre,
        ExistUV = ExistenciaActualRegular, ExistUC = ExistenciaActualUC,
        --Relacion = CAST(CAST(FactorCompra AS INT) AS NVARCHAR) + '/' + UnidadCompra + ' - ' + CAST(CAST(FactorVenta AS INT) AS NVARCHAR) + '/' + UnidadVenta,
        CostoNet = UltimoCostoNeto,
        CostoNetUC = UltimoCostoNetoUC,
        CostoExist = CostoExistenciaNeto,
        Stock30	= StockMinimo, Stock30UC = CAST( (StockMinimo / FactorVenta) AS DECIMAL(9,2))
    FROM QVExistencias
    WHERE Almacen = @Almacen AND Tienda = @Tienda
        AND Articulo = '${articulo}'
  `;

  let queryZR = `
    DECLARE @Sucursal NVARCHAR(2) = 'ZR', @Almacen INT = 2, @Tienda INT = 1

    SELECT Suc = @Sucursal,
        --Articulo,Nombre,
        PrecioNet = Precio1IVAUV,
        UtiiPorc = (1 - (UltimoCostoNeto / Precio1IVAUV)) * 100,
        ExistUV = ExistenciaActualRegular, ExistUC = ExistenciaActualUC,
        --Relacion = CAST(CAST(FactorCompra AS INT) AS NVARCHAR) + '/' + UnidadCompra + ' - ' + CAST(CAST(FactorVenta AS INT) AS NVARCHAR) + '/' + UnidadVenta,
        CostoNet = UltimoCostoNeto,
        CostoNetUC = UltimoCostoNetoUC,
        CostoExist = CostoExistenciaNeto,
        Stock30	= StockMinimo, Stock30UC = CAST( (StockMinimo / FactorVenta) AS DECIMAL(9,2))
    FROM QvListaPrecioConCosto
    WHERE Almacen = @Almacen AND Tienda = @Tienda
        AND Articulo = '${articulo}'
  `;

  let queryVC = `
    DECLARE @Sucursal NVARCHAR(2) = 'VC', @Almacen INT = 3, @Tienda INT = 2

    SELECT Suc = @Sucursal,
        --Articulo,Nombre,
        PrecioNet = Precio1IVAUV,
        UtiiPorc = (1 - (UltimoCostoNeto / Precio1IVAUV)) * 100,
        ExistUV = ExistenciaActualRegular, ExistUC = ExistenciaActualUC,
        --Relacion = CAST(CAST(FactorCompra AS INT) AS NVARCHAR) + '/' + UnidadCompra + ' - ' + CAST(CAST(FactorVenta AS INT) AS NVARCHAR) + '/' + UnidadVenta,
        CostoNet = UltimoCostoNeto,
        CostoNetUC = UltimoCostoNetoUC,
        CostoExist = CostoExistenciaNeto,
        Stock30	= StockMinimo, Stock30UC = CAST( (StockMinimo / FactorVenta) AS DECIMAL(9,2))
    FROM QvListaPrecioConCosto
    WHERE Almacen = @Almacen AND Tienda = @Tienda
        AND Articulo = '${articulo}'
  `;

  let queryOU = `
    DECLARE @Sucursal NVARCHAR(2) = 'OU', @Almacen INT = 19, @Tienda INT = 5

    SELECT Suc = @Sucursal,
        --Articulo,Nombre,
        PrecioNet = Precio1IVAUV,
        UtiiPorc = (1 - (UltimoCostoNeto / Precio1IVAUV)) * 100,
        ExistUV = ExistenciaActualRegular, ExistUC = ExistenciaActualUC,
        --Relacion = CAST(CAST(FactorCompra AS INT) AS NVARCHAR) + '/' + UnidadCompra + ' - ' + CAST(CAST(FactorVenta AS INT) AS NVARCHAR) + '/' + UnidadVenta,
        CostoNet = UltimoCostoNeto,
        CostoNetUC = UltimoCostoNetoUC,
        CostoExist = CostoExistenciaNeto,
        Stock30	= StockMinimo, Stock30UC = CAST( (StockMinimo / FactorVenta) AS DECIMAL(9,2))
    FROM QvListaPrecioConCosto
    WHERE Almacen = @Almacen AND Tienda = @Tienda
        AND Articulo = '${articulo}'
  `;

  let queryJL = `
    DECLARE @Sucursal NVARCHAR(2) = 'JL', @Almacen INT = 7, @Tienda INT = 4

    SELECT Suc = @Sucursal,
        --Articulo,Nombre,
        PrecioNet = Precio1IVAUV,
        UtiiPorc = (1 - (UltimoCostoNeto / Precio1IVAUV)) * 100,
        ExistUV = ExistenciaActualRegular, ExistUC = ExistenciaActualUC,
        --Relacion = CAST(CAST(FactorCompra AS INT) AS NVARCHAR) + '/' + UnidadCompra + ' - ' + CAST(CAST(FactorVenta AS INT) AS NVARCHAR) + '/' + UnidadVenta,
        CostoNet = UltimoCostoNeto,
        CostoNetUC = UltimoCostoNetoUC,
        CostoExist = CostoExistenciaNeto,
        Stock30	= StockMinimo, Stock30UC = CAST( (StockMinimo / FactorVenta) AS DECIMAL(9,2))
    FROM QvListaPrecioConCosto
    WHERE Almacen = @Almacen AND Tienda = @Tienda
        AND Articulo = '${articulo}'
  `;

  let queryCompras = `
    SELECT TOP 3
        Fecha,
        --Documento,Referencia,Tercero,
        NombreTercero,
        --TipoDocumento,Estatus,Articulo,Nombre,
        CantidadRegularUC,CostoUnitarioNetoUC
    FROM QVDEMovAlmacen
    WHERE TipoDocumento = 'C' AND Estatus = 'E'
        AND Articulo = '${articulo}'
    ORDER BY Fecha DESC
  `;

  let All = {
    Articulo: null,
    Nombre: null,
    Relacion: null,
    ExistActualUC: null,
    Stock30UC: null,
    CostoNetUCBO: null,
    CostoExistActual: null,
    existencias: [],
    compras: []
  }

  try {
    
    let General = await select(queryGeneral, 'BO')
    let bo = await select(queryBO, 'BO')
    let zr = await select(queryZR, 'ZR')
    let vc = await select(queryVC, 'VC')
    let ou = await select(queryOU, 'OU')
    let jl = await select(queryJL, 'JL')
    let GeneralCompras = await select(queryCompras, 'BO')
    
    General.map(item => {
        All.Articulo = item.Articulo;
        All.Nombre = item.Nombre;
        All.Relacion = item.Relacion;
    })
    bo.map(item => {
        All.ExistActualUC += item.ExistUC;
        All.Stock30UC += item.Stock30UC;
        All.CostoExistActual += item.CostoExist;

        All.CostoNetUCBO += item.CostoNetUC;
        
        All.existencias.push(item);
    })
    zr.map(item => {
        All.ExistActualUC += item.ExistUC;
        All.Stock30UC += item.Stock30UC;
        All.CostoExistActual += item.CostoExist;
        All.existencias.push(item);
    })
    vc.map(item => {
        All.ExistActualUC += item.ExistUC;
        All.Stock30UC += item.Stock30UC;
        All.CostoExistActual += item.CostoExist;
        All.existencias.push(item);
    })
    ou.map(item => {
        All.ExistActualUC += item.ExistUC;
        All.Stock30UC += item.Stock30UC;
        All.CostoExistActual += item.CostoExist;
        All.existencias.push(item);
    })
    jl.map(item => {
        All.ExistActualUC += item.ExistUC;
        All.Stock30UC += item.Stock30UC;
        All.CostoExistActual += item.CostoExist;
        All.existencias.push(item);
    })
    GeneralCompras.map(item => {
        All.compras.push(item);
    })

  } catch (e) {
    throw new Error(`chequeoController ::: \n \t ${e} \n`)
  }
  return res.status(200).json(All)
}
export default chequeoController
