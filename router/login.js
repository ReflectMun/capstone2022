import { Router } from 'express'
import { createPool } from 'mysql2/promise'

const login = Router()
const Pool = createPool({
    host: 'aws',
    user: 'admin',
    password: 'MainDBvotmdnjem!!',
    database: 'MainDB',
    port: 3306
})

login.get('/', async (req, res) => {
    const body = JSON.parse(req.body)

    const ID = body.ID
    const password = body.password

    let conn = null
    const response = {
        code: null,
        body: null,
        err: null
    }
    try{
        const queryString = `SELECT COUNT(UID) FROM User WHERE ID = '${ID}' AND Password = '${password}'`
        conn = Pool.getConnection()

        await conn.beginTransaction()
        const [row, fields] = await conn.query(queryString)
        await conn.commit()
    }
    catch(err){
        console.log(err)
        
        response.code = 404
        response.err = '유저 테이블 조회중 에러 발생'
    }
    finally{
        if(conn) { conn.close() }
    }
})

export default login