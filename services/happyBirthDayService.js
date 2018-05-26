import select from '../db/query'

async function happyBirthdayService(req, res) {
  const Q = `
    SELECT
      IdTrabajador
      ,Categoria
      ,NumeroDeSeguridadSocial
      ,FechaDeIngreso
      ,Nombre
      ,Direccion
      ,Telefono
      ,Email
      ,FechaDeNacimiento
      ,EmpleadoActivo
      ,DiasRestantes = DAY(FechaDeNacimiento) - DAY(GETDATE())
      ,MesesRestantes = MONTH(FechaDeNacimiento) - MONTH(GETDATE())
    FROM
      Trabajadores
    WHERE YEAR(FechaDeNacimiento) < YEAR(GETDATE()) - 18
    AND MONTH(FechaDeNacimiento) >=  MONTH(GETDATE())
    AND DAY(FechaDeNacimiento) >= DAY(GETDATE())
  `;
  let rQ;
  try {
    rQ = await select(Q);
  } catch (e) {
    new Error(`Error al realizar consulta`)
  }
  return res.status(200).json(rQ)
}

export default happyBirthdayService