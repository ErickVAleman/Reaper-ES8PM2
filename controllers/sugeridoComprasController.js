import select from '../db/query';

async function sugeridoComprasController(req, res) {
    
    const proveedores = (req, res) => {
        let q = ``;
        try {
            const result = await select(q,'bo');
            result.map( item => console.debug(item) )
        }catch(e){
            throw new Error(`sugeridoComprasController::: \t \n \n${e}`);
        }
    }

    return {
        proveedores
    }
}

export default sugeridoComprasController