import db from './conn';

async function Select(query) {
  let promise =  new Promise((resolve , reject) => {
    db.query(query, {type: db.QueryTypes.SELECT})
      .then( result => resolve(result) )
      .catch( error => reject(error) )
  })
  let resp = await promise
  return resp  
}

export default Select

