import Select from '../db/query';

function getAnalisisArticulos() {

  // const QVListaprecioConCosto = `
  //   SELECT TiendaDescripcion, Articulo, CodigoBarras, Nombre, Descripcion
  //     ,DescripcionSubfamilia, DescripcionFamilia, FactorCompra, FactorVenta
  //     ,Precio1IVAUV,Precio2IVAUV, Precio3IVAUV
  //   FROM QVListaprecioConCosto WHERE Tienda = ${Tienda} AND Almacen = ${Almacen}
  // `
  // const QVExistencias = `
  //   SELECT ExistenciaActualRegular,
  //     ExistenciaActualUC
  //   FROM QVExistencias WHERE Tienda = ${Tienda} AND Almacen = ${Almacen}
  // `

  async function ListaArticulos(req, res) {
    const articulo = req.query.articulo
    const todoArticulos = `
      DECLARE @Tienda INT = 6, @Almacen INT = 21 
      SELECT LPC.Almacen,LPC.Tienda, LPC.TiendaDescripcion,
        LPC.Articulo,LPC.CodigoBarras, LPC.Nombre, LPC.DescripcionFamilia, LPC.DescripcionSubfamilia,
        Relacion = '[ '+ CAST(CAST(LPC.FactorCompra AS INT) AS NVARCHAR) +' '+ LPC.UnidadCompra +'/'+ CAST(CAST(LPC.FactorVenta AS INT) AS NVARCHAR)+ ' ' + LPC.UnidadVenta +' ]' 
      FROM Catalogo Cat
      LEFT JOIN QVListaprecioConCosto LPC ON LPC.Articulo = Cat.Articulo AND LPC.Tienda = @Tienda AND LPC.Almacen = @Almacen
      WHERE Cat.Tienda = @Tienda AND Cat.Baja = 0
    `;
    const porArticulo = `
      DECLARE @Tienda INT = 6, @Almacen INT = 21 
      SELECT LPC.Almacen,LPC.Tienda, LPC.TiendaDescripcion,
        LPC.Articulo,LPC.CodigoBarras, LPC.Nombre, LPC.DescripcionFamilia, LPC.DescripcionSubfamilia,
        Relacion = '[ '+ CAST(CAST(LPC.FactorCompra AS INT) AS NVARCHAR) +' '+ LPC.UnidadCompra +'/'+ CAST(CAST(LPC.FactorVenta AS INT) AS NVARCHAR)+ ' ' + LPC.UnidadVenta +' ]' 
      FROM Catalogo Cat
      LEFT JOIN QVListaprecioConCosto LPC ON LPC.Articulo = Cat.Articulo AND LPC.Tienda = @Tienda AND LPC.Almacen = @Almacen
      WHERE Cat.Tienda = @Tienda AND Cat.Baja = 0 AND Cat.Articulo = '${articulo}'
    `;
    const query = articulo ? porArticulo : todoArticulos;

    try {
      const ListArticulos = await Select(query, 'BO');
      return res.status(200).json(ListArticulos);
    } catch (e) {
      return res.status(303).json({ success: false, message: `Error al solicitar lista de articulos, comuniquese con su administrador de sistemas` })
    }
    
  }

  async function dataXArticulos(req, res) {
    
    const art = req.body.articulo || req.query.articulo;
    
    if (!art) return res.status(303).json({ success: false, message: `No se ha establecido ningun articulo para su busqueda` })
    
    const data = {
      stock: {
        bo: '',
        zr: '',
        vc: '',
        ou: '',
        jl: ''
      },
      costoNeto: '',
      ultimosCostos: {
        0: '',
        1: '',
        2: ''
      },
      rotacion: ''
    }

    

  }

  return {
    ListaArticulos
  }
}

module.exports = getAnalisisArticulos;
