import Select from '../db/query';
import { tienda } from '../conf';

function getAnalisisArticulos() {

  async function ListaArticulos(req, res) {
    let articulo = req.body.articulo || req.query.articulo;
    let data = [];
    const todoArticulos = `
      SELECT
        Articulo, CodigoBarras, Nombre, Descripcion,
        Relacion = '[ '+ CAST(CAST(FactorCompra AS INT) AS NVARCHAR) +' '+ UnidadCompra +'/'+ CAST(CAST(FactorVenta AS INT) AS NVARCHAR)+ ' ' + UnidadVenta +' ]'
      FROM Articulos ORDER BY Articulo
    `;
    const todoArticulo = `
      SELECT
        Articulo, CodigoBarras, Nombre, Descripcion,
        Relacion = '[ '+ CAST(CAST(FactorCompra AS INT) AS NVARCHAR) +' '+ UnidadCompra +'/'+ CAST(CAST(FactorVenta AS INT) AS NVARCHAR)+ ' ' + UnidadVenta +' ]'
      FROM Articulos WHERE Articulo = ${articulo  } ORDER BY Articulo
    `;

    try {
      const ListArticulos = await Select(todoArticulos, 'BO');
      data = ListArticulos.map(item => {
        item.URL = `http://127.0.0.1:3001/api/v1/consulta/articulosdetalle?articulo=${item.Articulo}`;
        return item
      })
      Promise.all(data)
        .then(ok => res.status(200).json(ok))
        .catch(err => res.status(500).json({success: false, message: `${err}`}))
    } catch (e) {
      return res.status(303).json({ success: false, message: `Error al solicitar lista de articulos, comuniquese con su administrador de sistemas` })
    }

  }

  async function DetalleArticulo(req, res) {
    //recibir el articulo
    //extraer de base de datos la informacion necesaria
    // RETORNAR LA INFOR
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
        ORDER BY Articulo
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
              AND Articulo = '${articulo}'
        `;
        
        return query
      }

      try {
        const basicInf = await Select(infBasicArt, 'BO');
        basicInf.map( item => {
          All.Articulo = item.Articulo
          All.Nombre = item.Nombre
          All.Relacion = item.Relacion
        })
        try {
          const zr = await Select(consulta('ZR'),'ZR')
          zr.map(item =>{
            All.ExistActualUC += item.ExistUC;
            All.Stock30UC += item.Stock30UC;
            All.CostoExistActual += item.CostoExist;
            All.CostoNetUCBO += item.CostoNetUC;
            All.existencias.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
            All.ExistActualUC +=0;
            All.Stock30UC += 0;
            All.CostoExistActual += 0;
            All.CostoNetUCBO += 0;
            All.existencias.push({zr: 'No Data'});
          new Error(`getAnalisisController => ZR \n ${e}`)
        }
        try {
          const vc = await Select(consulta('VC'),'VC')
          vc.map(item =>{
            All.ExistActualUC += item.ExistUC;
            All.Stock30UC += item.Stock30UC;
            All.CostoExistActual += item.CostoExist;
            All.CostoNetUCBO += item.CostoNetUC;
            All.existencias.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
            All.ExistActualUC +=0;
            All.Stock30UC += 0;
            All.CostoExistActual += 0;
            All.CostoNetUCBO += 0;
            All.existencias.push({zr: 'No Data'});
          new Error(`getAnalisisController => VC \n ${e}`)
        }
        try {
          const ou = await Select(consulta('OU'),'OU')
          ou.map(item =>{
            All.ExistActualUC += item.ExistUC;
            All.Stock30UC += item.Stock30UC;
            All.CostoExistActual += item.CostoExist;
            All.CostoNetUCBO += item.CostoNetUC;
            All.existencias.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
            All.ExistActualUC +=0;
            All.Stock30UC += 0;
            All.CostoExistActual += 0;
            All.CostoNetUCBO += 0;
            All.existencias.push({zr: 'No Data'});
          new Error(`getAnalisisController => OU \n ${e}`)
        }
        try {
          const jl = await Select(consulta('JL'),'JL')
          jl.map(item =>{
            All.ExistActualUC += item.ExistUC;
            All.Stock30UC += item.Stock30UC;
            All.CostoExistActual += item.CostoExist;
            All.CostoNetUCBO += item.CostoNetUC;
            All.existencias.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
            All.ExistActualUC +=0;
            All.Stock30UC += 0;
            All.CostoExistActual += 0;
            All.CostoNetUCBO += 0;
            All.existencias.push({zr: 'No Data'});
          new Error(`getAnalisisController => JL \n ${e}`)
        }
        try {
          const bo = await Select(consulta('BO'),'BO')
          bo.map(item =>{
            All.ExistActualUC += item.ExistUC;
            All.Stock30UC += item.Stock30UC;
            All.CostoExistActual += item.CostoExist;
            All.CostoNetUCBO += item.CostoNetUC;
            All.existencias.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
            All.ExistActualUC +=0;
            All.Stock30UC += 0;
            All.CostoExistActual += 0;
            All.CostoNetUCBO += 0;
            All.existencias.push({zr: 'No Data'});
          new Error(`getAnalisisController => BO \n ${e}`)
        }
        try {
          const boCompras = await Select(queryCompras,'BO')
          boCompras.map(item =>{
            All.compras.push(item);
          })
          // return res.status(200).json()
        } catch (e) {
          new Error(`getAnalisisController => BO \n ${e}`)
        }
        
      } catch (e) {
        new Error(`getAnalisisController \n ${e}`)
        return res.status(404).json({success: false, message: ` No se ha encontrado el articulo especificado ${e}`})
      }
      return res.status(200).json(All)
    }
    return res.status(303).json({ success: false, message: "No se ha recibido ningun codigo de articulo" })
  }

  return {
    ListaArticulos,
    DetalleArticulo
  }
}

module.exports = getAnalisisArticulos;
