import express, { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'
import { jwtVerifyForSignin } from '../../private/apis/verifyJWT.js'
import { normalLog, errorLog } from '../../private/apis/logger.js'
import issuingJwt from '../jwt/issuingJwt.js'

const login = Router()
const controllerName = 'Login'

login.post(
    '/',
    jwtVerifyForSignin,
    getLoginParameter,
    processLogin
)
login.use('/issue', issuingJwt)

function getLoginParameter(req, res, next){
    const response = {
        code: null,
        body: null,
        err: null
    }
    
    try{
        const { ID, password } = req.body

        if(ID == null || password == null){
            throw new Error('올바르지 않은 데이터 형식')
        }

        req.parmaBox = {
            paramID: ID,
            password: password
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        
        response.code = 404
        response.err = { message: '올바르지 않은 데이터 형식' }
        
        return res.json(response)
    }

    next()
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function processLogin(req, res){
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
        const [ row, fields ] = await conn.query(queryString) // queryString을 기준으로 DB에 쿼리 실행 후 결과물 받아옴
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

        res.redirect('/api/login/issue')
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        
        response.code = 404
        response.err = { message: '유저 테이블 조회중 에러 발생' }

        res.json(response)
    }
    finally{
        if(conn) { conn.release() } // 할당된 연결이 있다면 연결을 삭제
    }
}

export default login