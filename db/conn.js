import Sequelize from 'sequelize';
import db from '../conf'

async function conn(DB) {
  
  let URLDB = db(DB);
  const sequelize = new Sequelize(URLDB);
  
  return sequelize
}

export default conn













































