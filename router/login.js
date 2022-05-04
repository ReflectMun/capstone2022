import { Router } from 'express'
import Pool from '../private/server/DBConnector.js'

const login = Router()

login.post(
    '/',
    requestLogLoginService,
    getLoginParameter,
    checkLoginUserSession,
    processLogin
)

function requestLogLoginService(req, res, next){
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : ${req.ip} : 로그인 요청`)
    next()
}

function getLoginParameter(req, res, next){
    let paramID
    let password

    const response = {
        code: null,
        body: null,
        err: null
    }
    
    try{
        paramID = req.body['ID']
        password = req.body['password']

        if(paramID == null || password == null){
            throw new Error('올바르지 않은 데이터 형식')
        }

        req.parmaBox = {
            paramID: paramID,
            password: password
        }
    }
    catch(err){
        console.log(err)
        
        response.code = 404
        response.err = { message: '올바르지 않은 데이터 형식' }
        
        return res.json(response)
    }

    next()
}

function checkLoginUserSession(req, res, next){
    const { paramID } = req.parmaBox

    const response = {
        code: null,
        body: null,
        err: null
    }

    const body = {
        'COUNT(UID)': null,
        UID: null,
        message: null
    }
    
    if(req.session.user){
        console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : ${req.ip} : 이미 로그인한 유저 ${paramID}`)

        response.code = 100
        body.message = 'An user who already logged in'
        response.body = body

        return res.json(response)
    }

    next()
}

async function processLogin(req, res, next){
    let conn = null
    const { paramID, password } = req.parmaBox

    const response = {
        code: null,
        body: null,
        err: null
    }

    const body = {
        'COUNT(UID)': null,
        UID: null,
        message: null
    }

    try{
        const queryString = `SELECT COUNT(UID), UID FROM Users WHERE Account = '${paramID}' AND Password = '${password}'`
        conn = await Pool.getConnection(conn => conn) // 커넥션 Pool에서 연결을 받아오는 메서드
        
        await conn.beginTransaction() // 트랜잭션 시작 알림
        const [row, fields] = await conn.query(queryString) // queryString을 기준으로 DB에 쿼리 실행 후 결과물 받아옴
        await conn.commit() // 실행을 commit 해서 DB에 완료되었음을 알리고 종료
        
        // query 결과물은 row에 저장됨, fields는 신경안써도 무방
        response.code = 200
        response.body = 'Login Succeed'

        if(row[0]['UID']){
            req.session.user = {
                UID: row[0]['UID'],
                ID: paramID,
                name: 'nickname',
                authroized: true
            }
        }
    }
    catch(err){
        console.log(err) // 에러내용 출력
        
        response.code = 404
        response.err = { message: '유저 테이블 조회중 에러 발생' }
    }
    finally{
        if(conn) { conn.release() } // 할당된 연결이 있다면 연결을 삭제
        
        res.json(response) // 받아온 내용을 응답
    }
}

// main 브랜치에서 작성한 커밋 메시지 남기기용 코멘트
// DB 연결 테스트

export default login