import select from '../db/query'

const _Query_ = (perfil) => {

  const list = (array) => {
    let data = '';
    array.map(i => data += `'${i}',`)
    data = data.slice(0, data.length - 1)
    return data
  }

  if (typeof (perfil) === 'object') {
    let data = list(perfil)
    let query = `
    SELECT 
      Consecutivo
      ,TiendaOrigen
      ,FechaInicio
      ,FechaFin
      ,Completo
      ,Exportar
      ,UltimaEjecucion = CAST(UltimaEjecucion AS VARCHAR)
      ,FechaDe
      ,FechaHasta
      ,Perfil
      ,Caja
    FROM Consolidacion
    WHERE YEAR(UltimaEjecucion) >= YEAR(GETDATE())
      AND MONTH(UltimaEjecucion) >= MONTH(GETDATE())
      AND DAY(UltimaEjecucion) = DAY(GETDATE()) - 1
      AND Perfil NOT IN (${data}) 
    `;

    return query
  } else {
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
      AND Perfil NOT IN (${perfil.toString()}) 
    `;
    return query
  }
}

const consolidacioncheckperfil = async (req, res) => {
  let all = Object();
  all = {bo: [],vc: [],zr: [],ou: [],jl: []}
  
  // Error ::: checkPerfilConsolidacionController ::: ( bo )
  
  try {
    let bo = await select(_Query_(['3','14']), "BO"); //.14
    bo.map(item => all.bo.push(item));
  } catch (error) {
    throw new Error(`Error ::: checkPerfilConsolidacionController ::: ( bo ) ::: (${error})`);
  }
  
  // Error ::: checkPerfilConsolidacionController ::: ( vc )
  
  try {
    let vc = await select(_Query_(`'8'`), "vc");
    vc.map(item => all.vc.push(item));
  } catch (error) {
    throw new Error(`Error ::: checkPerfilConsolidacionController ::: ( vc ) ::: (${error})`);
  }
  
  // Error ::: checkPerfilConsolidacionController ::: ( zr )
  
  try {
    let zr = await select(_Query_(`'16'`), "zr");
    zr.map(item => all.zr.push(item));
  } catch (error) {
    throw new Error(`Error ::: checkPerfilConsolidacionController ::: ( zr ) ::: (${error})`);
  }
  
  // Error ::: checkPerfilConsolidacionController ::: ( ou )
  
  try {
    let ou = await select(_Query_(`'4'`), "ou");
    ou.map(item => all.ou.push(item));
  } catch (error) {
    throw new Error(`Error ::: checkPerfilConsolidacionController ::: ( ou ) ::: (${error})`);
  }
  
  // Error ::: checkPerfilConsolidacionController ::: ( jl )
  
  try {
    let jl = await select(_Query_(`'4'`), "jl");
    jl.map(item => all.jl.push(item));
  } catch (error) {
    throw new Error(`Error ::: checkPerfilConsolidacionController ::: ( jl ) ::: (${error})`);
  }

  
  req ? res.status(200).json(all) : console.log('')

  return all

}

export default consolidacioncheckperfil
