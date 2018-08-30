import Select from '../db/query';
import { tienda } from '../conf';
import { writeFileSync } from 'fs'

/**
 * @param {function} Retorna 3 tipos de funciones para endpoint
 */

function getAnalisisArticulos() {
  async function ListaArticulos(req, res) {
    console.log(req.headers.host)    
    let articulo = req.body.q || req.query.q;
    let data = [];
    const todoArticulos = `
      SELECT 
        Articulo, CodigoBarras, Nombre, Descripcion,
        Relacion = '[ '+ CAST(CAST(FactorCompra AS INT) AS NVARCHAR) +' '+ UnidadCompra +'/'+ CAST(CAST(FactorVenta AS INT) AS NVARCHAR)+ ' ' + UnidadVenta +' ]'
      FROM Articulos ORDER BY Articulo`;
    const forArticulo = `
      SELECT
        Articulo, CodigoBarras, Nombre, Descripcion,
        Relacion = '[ '+ CAST(CAST(FactorCompra AS INT) AS NVARCHAR) +' '+ UnidadCompra +'/'+ CAST(CAST(FactorVenta AS INT) AS NVARCHAR)+ ' ' + UnidadVenta +' ]'
      FROM Articulos WHERE Nombre LIKE REPLACE('${articulo}','*','%') ORDER BY Articulo`;
    let query = articulo ? forArticulo : todoArticulos;
    try {
      const ListArticulos = await Select(query, 'BO');
      data = ListArticulos.map(item => {
        item.URL = `https://${req.headers.host}/api/v1/consulta/articulosdetalle?articulo=${item.Articulo}`;
        return item
      });
      Promise.all(data)
        .then(ok => res.status(200).json(ok))
        .catch(err => res.status(500).json({
          success: false,
          message: `${err}`
        }));
    } catch (e) {
      return res.status(303).json({
        success: false,
        message: `Error al solicitar lista de articulos, comuniquese con su administrador de sistemas`
      })
    }

  }

  async function DetalleArticulo(req, res) {
    let articulo = req.body.articulo || req.query.articulo;
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
    };
    if (articulo) {

      const infBasicArt = `
        SELECT
          Articulo, CodigoBarras, Nombre, Descripcion,
          Relacion = '[ '+ CAST(CAST(FactorCompra AS INT) AS NVARCHAR) +' '+ UnidadCompra +'/'+ CAST(CAST(FactorVenta AS INT) AS NVARCHAR)+ ' ' + UnidadVenta +' ]'
        FROM Articulos WHERE Articulo = '${articulo}'
        ORDER BY Articulo`;

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
          ORDER BY Fecha DESC`;

      const consulta = (suc) => {
        let query = `
          ${tienda(suc)}
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
              AND Articulo = '${articulo}'`;

        return query
      }

      try {
        const basicInf = await Select(infBasicArt, 'BO');
        basicInf.map(item => {
          All.Articulo = item.Articulo
          All.Nombre = item.Nombre
          All.Relacion = item.Relacion
        })
        try {
          const zr = await Select(consulta('ZR'), 'ZR')
          zr.map(item => {
            All.ExistActualUC += item.ExistUC;
            All.Stock30UC += item.Stock30UC;
            All.CostoExistActual += item.CostoExist;
            All.existencias.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
          All.ExistActualUC += 0;
          All.Stock30UC += 0;
          All.CostoExistActual += 0;
          All.CostoNetUCBO += 0;
          All.existencias.push({
            Suc: 'ZR'
          });
          new Error(`getAnalisisController => ZR \n ${e}`)
        }
        try {
          const vc = await Select(consulta('VC'), 'VC')
          vc.map(item => {
            All.ExistActualUC += item.ExistUC;
            All.Stock30UC += item.Stock30UC;
            All.CostoExistActual += item.CostoExist;
            All.existencias.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
          All.ExistActualUC += 0;
          All.Stock30UC += 0;
          All.CostoExistActual += 0;
          All.CostoNetUCBO += 0;
          All.existencias.push({
            Suc: 'VC'
          });
          new Error(`getAnalisisController => VC \n ${e}`)
        }
        try {
          const ou = await Select(consulta('OU'), 'OU')
          ou.map(item => {
            All.ExistActualUC += item.ExistUC;
            All.Stock30UC += item.Stock30UC;
            All.CostoExistActual += item.CostoExist;
            All.existencias.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
          All.ExistActualUC += 0;
          All.Stock30UC += 0;
          All.CostoExistActual += 0;
          All.CostoNetUCBO += 0;
          All.existencias.push({
            Suc: 'OU'
          });
          new Error(`getAnalisisController => OU \n ${e}`)
        }
        try {
          const jl = await Select(consulta('JL'), 'JL')
          jl.map(item => {
            All.ExistActualUC += item.ExistUC;
            All.Stock30UC += item.Stock30UC;
            All.CostoExistActual += item.CostoExist;
            All.existencias.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
          All.ExistActualUC += 0;
          All.Stock30UC += 0;
          All.CostoExistActual += 0;
          All.CostoNetUCBO += 0;
          All.existencias.push({
            Suc: 'JL'
          });
          new Error(`getAnalisisController => JL \n ${e}`)
        }
        try {
          const bo = await Select(consulta('BO'), 'BO')
          bo.map(item => {
            All.ExistActualUC += item.ExistUC;
            All.Stock30UC += item.Stock30UC;
            All.CostoExistActual += item.CostoExist;
            All.CostoNetUCBO += item.CostoNetUC;
            All.existencias.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
          All.ExistActualUC += 0;
          All.Stock30UC += 0;
          All.CostoExistActual += 0;
          All.CostoNetUCBO += 0;
          All.existencias.push({
            Suc: 'BO'
          });
          new Error(`getAnalisisController => BO \n ${e}`)
        }
        try {
          const boCompras = await Select(queryCompras, 'BO')
          boCompras.map(item => {
            All.compras.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
          new Error(`getAnalisisController => BO \n ${e}`)
        }

      } catch (e) {
        new Error(`getAnalisisController \n ${e}`)
        return res.status(404).json({
          success: false,
          message: ` Error: ${e}`
        })
      }
      return res.status(200).json(All)
    }
    return res.status(303).json({
      success: false,
      message: "No se ha recibido ningun codigo de articulo"
    })
  }
  async function analisisVariosArticulos (req, res) {
    function generateQuery (suc,articulos) {
      let query = `
        DECLARE @toDay DATETIME = GETDATE()
        DECLARE @MesAnterior2Inicio DATETIME = DATEADD(MM,DATEDIFF(MM,0,@toDay) - 2,0)
        DECLARE @MesAnterior2Final DATETIME = DATEADD(MM,DATEDIFF(MM,0,@toDay) - 1,0) - 1
        DECLARE @MesAnterioInicio DATETIME = DATEADD(MM,DATEDIFF(MM,0,@toDay) - 1,0)
        DECLARE @MesAnteriorFinal DATETIME = DATEADD(MM,DATEDIFF(MM,0,@toDay),0) - 1
        DECLARE @MesActualInicio DATETIME = DATEADD(MM,DATEDIFF(MM,0,@toDay),0)
        DECLARE @MesActualFinal DATETIME = DATEADD(MM,DATEDIFF(MM,0,@toDay) + 1,0) - 1
        
        DECLARE @SemanaAnteriorInicio DATETIME = DATEADD(WW,DATEDIFF(WW,0,@toDay) - 1,0)
        DECLARE @SemanaAnteriorFinal DATETIME = DATEADD(WW,DATEDIFF(WW,0,@toDay),0) - 1
        DECLARE @SemanaActualInicio DATETIME = DATEADD(WW,DATEDIFF(WW,0,@toDay),0)
        DECLARE @SemanaActualFinal DATETIME = DATEADD(WW,DATEDIFF(WW,0,@toDay) + 1,0) - 1
        
        DECLARE @DiasSemana INT = 7
        DECLARE @DiaActual INT = DATEPART(DW,@toDay)
        ${suc}        
        WITH articulosCTE (Articulo)
        AS
        (
          SELECT Articulo FROM Articulos WHERE Articulo IN (${articulos})
        
        SELECT 
          Lista.*,
          Tendencia = CASE 
            WHEN mnxSemAct > ((mnxSemAnt / @DiasSemana) * @DiaActual) THEN 1 - (((mnxSemAnt / @DiasSemana) * @DiaActual) / mnxSemAct) 
            WHEN mnxSemAct < ((mnxSemAnt / @DiasSemana) * @DiaActual) THEN -1 * (1 - (mnxSemAct / ((mnxSemAnt / @DiasSemana) * @DiaActual)))
            ELSE 0.00
          END
        FROM (
        SELECT Suc = @Sucursal,
          --A.Subfamilia,A.DescripcionSubfamilia,
          A.Articulo,Nombre,ExistUV = ExistenciaActualRegular, --ExistUC = ExistenciaActualUC,
          Relacion = CAST(CAST(FactorCompra AS INT) AS NVARCHAR) + '/' + UnidadCompra + ' - ' + CAST(CAST(FactorVenta AS INT) AS NVARCHAR) + '/' + UnidadVenta,
          CostoNet = UltimoCostoNeto,
          CostoExist = CostoExistenciaNeto,
          PrecioUNO = ISNULL(Precio1IVAUV,0.00),
          UtilUNO = CASE WHEN Precio1IVAUV = 0 THEN 0.00 ELSE ISNULL(1 - (UltimoCostoNeto/Precio1IVAUV),0.00) END,
          PrecioDOS = ISNULL(Precio2IVAUV,0.00),
          UtilDOS = CASE WHEN Precio2IVAUV = 0 THEN 0.00 ELSE ISNULL(1 - (UltimoCostoNeto/Precio2IVAUV),0.00) END,
          Estatus = CASE WHEN ExistenciaActualRegular >= StockMinimo AND ExistenciaActualRegular <= StockMaximo THEN 'OK' WHEN ExistenciaActualRegular < StockMinimo THEN 'BAJO' WHEN ExistenciaActualRegular > StockMaximo THEN 'SOBRE' ELSE '' END,
          Stock30	= StockMinimo,
          uvMesAnterior2 = ISNULL(MesAnterior2.CantUV,0.00),
          uvMesAnterior = ISNULL(MesAnterior.CantUV,0.00),
          uvMesActual = ISNULL(MesActual.CantUV,0.00),
          mnxMesAnterior2 = ISNULL(MesAnterior2.VentUV,0.00),
          mnxMesAnterior = ISNULL(MesAnterior.VentUV,0.00),
          mnxMesActual = ISNULL(MesActual.VentUV,0.00),
          
          FechaCompra = DiasCompras.FechaCompra,
          DiasCompras = DiasCompras.Dias,
          FechaVenta = DiasVentas.FechaVenta,
          DiasVentas = DiasVentas.Dias,
          
          mnxSemAnt = ISNULL(SemanaAnterior.VentUV,0.00),
          mnxSemAct = ISNULL(SemanaActual.VentUV,0.00)
        FROM QVListaprecioConCosto A
        LEFT JOIN (
          SELECT 
            Articulo,CantUV,CantUC,VentUV
          FROM OrderListaMovimientosVentaPorPeriodo(@MesAnterior2Inicio,@MesAnterior2Final)
          WHERE Articulo IN (SELECT Articulo FROM articulosCTE)
        ) AS MesAnterior2 ON MesAnterior2.Articulo = A.Articulo
        LEFT JOIN (
          SELECT 
            Articulo,CantUV,CantUC,VentUV
          FROM OrderListaMovimientosVentaPorPeriodo(@MesAnterioInicio,@MesAnteriorFinal)
          WHERE Articulo IN (SELECT Articulo FROM articulosCTE)
        ) AS MesAnterior ON MesAnterior.Articulo = A.Articulo
        LEFT JOIN (
          SELECT 
            Articulo,CantUV,CantUC,VentUV
          FROM OrderListaMovimientosVentaPorPeriodo(@MesActualInicio,@MesActualFinal)
          WHERE Articulo IN (SELECT Articulo FROM articulosCTE)
        ) AS MesActual ON MesActual.Articulo = A.Articulo
        
        LEFT JOIN (
          SELECT 
            Articulo,CantUV,CantUC,VentUV
          FROM OrderListaMovimientosVentaPorSemana(@SemanaAnteriorInicio,@SemanaAnteriorFinal)
          WHERE Articulo IN (SELECT Articulo FROM articulosCTE)
        ) AS SemanaAnterior ON SemanaAnterior.Articulo = A.Articulo
        LEFT JOIN (
          SELECT 
            Articulo,CantUV,CantUC,VentUV
          FROM OrderListaMovimientosVentaPorSemana(@SemanaActualInicio,@SemanaActualFinal)
          WHERE Articulo IN (SELECT Articulo FROM articulosCTE)
        ) AS SemanaActual ON SemanaActual.Articulo = A.Articulo
        LEFT JOIN (
          SELECT
            Articulo,FechaCompra,Dias
          FROM FuncionBIExistencias(@Almacen,@Tienda)
          WHERE Articulo IN (SELECT Articulo FROM articulosCTE)
        ) AS DiasCompras ON DiasCompras.Articulo = A.Articulo
        LEFT JOIN (
          SELECT
            Articulo,FechaVenta,Dias
          FROM FuncionBIVentas(@Almacen,@Tienda)
          WHERE Articulo IN (SELECT Articulo FROM articulosCTE)
        ) AS DiasVentas ON DiasVentas.Articulo = A.Articulo
        WHERE Almacen = @Almacen AND Tienda = @Tienda
          AND A.Articulo IN (SELECT Articulo FROM articulosCTE)
          --AND A.ExistenciaActualRegular < A.StockMinimo
          --AND A.ExistenciaActualRegular > 0 AND ( MesActual.CantUV = 0 OR MesActual.CantUV IS NULL )
        ) AS Lista
        --ORDER BY Stock30 DESC
        ORDER BY CostoExist DESC
      `;
      return query;
    }
    /**
     * @param {String} articulos 
     * recibe los articulos como arreglo y los pasa a string listo para una consulta SQL
     */
    function articulosToText (articulos) {
      let artQuery = ``;
      articulos.data.map(i => artQuery += `'${i.Articulo}',`)
      return artQuery.slice(0, artQuery.length - 1)
    }

    console.log( generateQuery( tienda('BO') , articulosToText(req.body) ) )
    return res.json ({
      success: true,
      message: `Todo Bien Todo Correcto y yo que me alegro`
    })
    
  }
  return {
    ListaArticulos,
    DetalleArticulo,
    analisisVariosArticulos
  }
}

module.exports = getAnalisisArticulos;
