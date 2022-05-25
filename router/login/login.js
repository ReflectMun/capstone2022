import express, { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'
import { stringify as queryStringify } from 'querystring'

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

/**
 * 로그인에 쓰일 파라미터들을 추출하는 미들웨어.
 * 명시한 파라미터가 모두 있는지, 올바른 형식으로 보낸 것이 맞는지 체크
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @returns {void}
 */
function getLoginParameter(req, res, next){
    try{
        const { ID, Password } = req.body

        if(typeof ID != 'string'){
            errorLog(req, controllerName, 'ID must be string')
            throw new InvalidDataType()
        }

        if(typeof Password != 'string'){
            errorLog(req, controllerName, 'Password must be string')
            throw new InvalidDataType()
        }

        req.parmaBox = {
            paramID: ID,
            Password: Password
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        if(err instanceof InvalidDataType){
            res.json({ code: 151, message: '올바르지 않은 데이터 형식이 전송되었습니다' })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다' })
        }

        return
    }

    next()
}

/**
 * 로그인을 진행하는 API 컨트롤러. 정상적으로 처리시 토큰을 발급하는 페이지로 리다이렉트
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function processLogin(req, res){
    let conn = null
    const { paramID, Password } = req.parmaBox

    try{
        const queryString = `SELECT COUNT(UID), UID FROM Users WHERE Account = '${paramID}' AND Password = '${Password}'`
        conn = await Pool.getConnection(conn => conn) // 커넥션 Pool에서 연결을 받아오는 메서드
        
        await conn.beginTransaction() // 트랜잭션 시작 알림
        const [ row, fields ] = await conn.query(queryString) // queryString을 기준으로 DB에 쿼리 실행 후 결과물 받아옴
        await conn.commit() // 실행을 commit 해서 DB에 완료되었음을 알리고 종료
        
        if(row[0]['COUNT(UID)'] == 1){
            const UrlQuery = queryStringify({
                UID: row[0]['UID'],
                Account: paramID
            })
            normalLog(req, controllerName, `로그인 요청 도착함 ID = ${paramID}, Password = ${Password}`)

            res.redirect('/api/login/issue?' + UrlQuery)
        }
        else{
            res.json({ code: 300, message: '계정 혹은 비밀번호가 틀렸습니다'})
        }

    }
    catch(err){
        errorLog(req, controllerName, err.message)
        res.json({ code: 150, message: '로그인을 위해 DB 조회중 오류가 발생하였습니다' })
    }
    finally{
        if(conn) { conn.release() } // 할당된 연결이 있다면 연결을 삭제
    }
}

export default login

class InvalidDataType extends Error{ constructor(){ super('올바르지 않은 데이터 타입') } }