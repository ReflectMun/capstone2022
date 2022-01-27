import { Router } from 'express'
import { createPool } from 'mysql2/promise'

const login = Router()
const Pool = createPool({
    // DB에 연결하는 커넥션 풀을 만드는 함수, 실제 연결은 await Pool.getConnection() 으로 따로 해야함
    host: 'maindb.cxoty2vxx2ed.us-east-1.rds.amazonaws.com',
    user: 'admin',
    password: 'MainDBvotmdnjem!!',
    database: 'MainDB',
    port: 3306
})

login.get('/', async (req, res) => {
    // 테스트용으로 작성한거라 주석처리해두었음

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
        const queryString = `SELECT COUNT(UID) FROM Users WHERE Account = 'ID' AND Password = 'password'`
        conn = await Pool.getConnection(conn => conn) // 커넥션 Pool에서 연결을 받아오는 메서드

        await conn.beginTransaction() // 트랜잭션 시작 알림
        const [row, fields] = await conn.query(queryString) // queryString을 기준으로 DB에 쿼리 실행 후 결과물 받아옴
        await conn.commit() // 실행을 commit 해서 DB에 완료되었음을 알리고 종료

        // query 결과물은 row에 저장됨, fields는 신경안써도 무방
        console.log(row[0]) // 단순히 어떤 형태로 출력되는지 확인해보기 위한 테스트용 코드임. 추후 삭제예정
        response.code = 200
        response.body = row[0]
    }
    catch(err){
        console.log(err) // 에러내용 출력
        
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