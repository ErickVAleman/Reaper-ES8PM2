import select from '../db/query'

const _Query_ = (perfil) => {
  let query = `
    SELECT 
      Consecutivo
      ,TiendaOrigen
      ,FechaInicio
      ,FechaFin
      ,Completo
      ,Exportar
      ,UltimaEjecucion
      ,FechaDe
      ,FechaHasta
      ,Perfil
      ,Caja
    FROM Consolidacion
    WHERE YEAR(UltimaEjecucion) >= YEAR(GETDATE())
      AND MONTH(UltimaEjecucion) >= MONTH(GETDATE())
      AND DAY(UltimaEjecucion) >= DAY(GETDATE()) - 1
      AND Perfil NOT IN (${perfil}) 
    `;
  return query
}

const consultaAll = async () => {
  let all = new Object();
  all = {
    bo: () => await select(_Query_('3,14'), "BO"),
    zr: [],
    vc: [],
    ou: [],
    jl: []
  }

}

async function consolidacioncheckperfil() {

}

export default consolidacioncheckperfil