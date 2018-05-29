import db from './conn';

async function select(query)
{
    try {
      let result = await db.query(query, {type: db.QueryTypes.SELECT})
      return result
    } catch (e) {
      return new Error(`Error al realizar la consulta`)
    }
}

export default select

