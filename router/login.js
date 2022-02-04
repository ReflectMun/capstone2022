import { Router } from 'express'
import Pool from '../public/js/server/DBConnector.js'

const login = Router()

login.post('/', async (req, res) => {
    console.log('POST 호출')
    
    const response = {
        code: null,
        body: null,
        err: null
    }
    
    let ID
    let password
    try{
        ID = req.body['ID']
        password = req.body['password']
    }
    catch(err){
        console.log(err)
        
        response.code = 404
        response.err = { message: '올바르지 않은 데이터 형식' }
        res.json(response)
        
        return
    }
    
    console.log(`${ID}, ${password}`)
    let conn = null
    try{
        const queryString = `SELECT COUNT(UID) FROM Users WHERE Account = '${ID}' AND Password = '${password}'`
        conn = await Pool.getConnection(conn => conn) // 커넥션 Pool에서 연결을 받아오는 메서드
        
        await conn.beginTransaction() // 트랜잭션 시작 알림
        const [row, fields] = await conn.query(queryString) // queryString을 기준으로 DB에 쿼리 실행 후 결과물 받아옴
        await conn.commit() // 실행을 commit 해서 DB에 완료되었음을 알리고 종료
        
        // query 결과물은 row에 저장됨, fields는 신경안써도 무방
        response.code = 200
        response.body = row[0]
    }
    catch(err){
        console.log(err) // 에러내용 출력
        
        response.code = 404
        response.err = { message: '유저 테이블 조회중 에러 발생' }
    }
    finally{
        if(conn) { conn.close() } // 할당된 연결이 있다면 연결을 삭제
        
        res.json(response) // 받아온 내용을 응답
    }
})

// main 브랜치에서 작성한 커밋 메시지 남기기용 코멘트
// DB 연결 테스트

export default login