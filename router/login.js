import { Router } from 'express'
import { createPool } from 'mysql2/promise'

const login = Router()
const Pool = createPool({
    host: 'maindb.cxoty2vxx2ed.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'MainDBvotmdnjem!!',
    port: 3306
})

login.get('/', async (req, res) => {
    // const body = JSON.parse(req.body)

    // const ID = body.ID
    // const password = body.password

    let conn = null
    const response = {
        code: null,
        body: null,
        err: null
    }
    try{
        const queryString = `SELECT COUNT(UID) FROM Users WHERE ID = 'ID' AND Password = 'password'`
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [row, fields] = await conn.query(queryString)
        await conn.commit()

        console.log(row)
        response.body = row
    }
    catch(err){
        console.log(err)
        
        response.code = 404
        response.err = '유저 테이블 조회중 에러 발생'
    }
    finally{
        if(conn) { conn.close() }

        res.json(response)
    }
})

export default login

// main 브랜치에서 작성한 커밋 메시지 남기기용 코멘트
// DB 연결 테스트