import conn from './conn';
async function select(query, DB)
{
    const db = await conn(DB.toUpperCase());
    try {
      let result = await db.query(query, {type: db.QueryTypes.SELECT})
      return result
    } catch (e) {
      return new Error(`Error al realizar la consulta`);
    }
}

export default select
