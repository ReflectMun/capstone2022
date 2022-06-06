import jwt from 'jsonwebtoken'
import express, { Router } from 'express'
import { errorLog, normalLog } from '../../private/apis/logger.js'
import Pool from '../../private/server/DBConnector.js'

const issuingJwt = Router()
const { sign } = jwt

issuingJwt.get(
    '/', 
    extractUserInfo,
    issueJwtToken
)

const controllerName = 'issuingJwt'

///////////////////////////////////////////////////////////////
// Functions

/**
 * DB에 RefreshToken을 삼입하는 함수
 * @param {string} refreshToken
 * @param {string} UID 
 */
async function insertTokenToDB(refreshToken, UID, req){
    let conn = null

    try{
        const queryString =
        `INSERT INTO RefreshTokens(UID, Token, Expiration) VALUES(${UID}, '${refreshToken}', NOW() + INTERVAL 12 HOUR)`
        
        conn = await Pool.getConnection(conn => conn)
        
        await conn.beginTransaction()
        await conn.query(queryString)
        await conn.commit()

        conn.release()
    } catch(err) {
        if(conn) { conn.release() }
        err.message += '-101'
        errorLog(req, controllerName, err.message)
        throw new ErrorOnInsertingRefreshToken()
    }
}

/**
 * DB에서 해당 유저의 닉네임을 가져오는 함수
 * @param {string} UID 
 * @return {string} 해당 유저의 닉네임
 */
async function fetchNickname(UID){
    let conn, Nickname

    return new Promise(async function(resolve, reject){
        try{
            const queryString = `SELECT Nickname FROM Users WHERE UID = ${UID}`
            conn = await Pool.getConnection(conn => conn)
            
            await conn.beginTransaction()
            const [ data, fields ] = await conn.query(queryString)
            await conn.commit()
            
            Nickname = data[0]['Nickname']
            resolve(Nickname)
        }
        catch(err){
            if(conn) { conn.release() }
            err.message += '-102'
            reject(err)
        }
    })
    
}
///////////////////////////////////////////////////////////////

/**
 * 유저 정보 추출용 함수.
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractUserInfo(req, res, next){
    try{
        const { UID, Account } = req.query
        
        // UID or account 정보가 없어서 null, undefined 등 false 값일 경우
        if(typeof UID != 'string'){
            throw new ValueIsUndefined()
        }

        if(typeof Account != 'string'){
            throw new ValueIsUndefined()
        }

        // 추출에 성공했다면 리퀘스트 객체에 값을 담아서 다음 미들웨어로 넘김
        req.paramBox = {
            UID: UID,
            Account: Account
        }
        
        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message + '-01')
        if(err instanceof ValueIsUndefined){ // UID, account 값 누락시
            res.json({ code: 351, message: '계정정보가 누락되었습니다' })
        }
        else{ // 정의되지 않은 예외 발생시
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다' })
        }
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function issueJwtToken(req, res){
    const { UID, Account } = req.paramBox
    try{
        // 서비스 이용에 쓰이는 액세스 토큰 발급
        const Nickname = await fetchNickname(UID)

        const accessToken = sign(
            { UID: UID, Account: Account, Nickname: Nickname },
            process.env.JWT_PRIVATE,
            { algorithm:'RS512', issuer: 'SaviorQNA', expiresIn: '20m' }
        )
        
        const refreshToken = sign(
            { UID: UID, Account: Account, Nickname: Nickname },
            process.env.JWT_SECRET,
            { issuer: 'SaviorQNA', expiresIn: '12h' }
        )

        await insertTokenToDB(refreshToken, UID)
        res.json({ token: accessToken })

        normalLog(req, controllerName, `유저 ${UID} 인증토큰 발급 완료`)
    }
    catch(err){
        errorLog(req, controllerName, err.message + '-02')
        if(err instanceof ErrorOnInsertingRefreshToken){
            res.json({ code: 3802, message: '사용자 인증 토큰 발급을 위해 DB와 통신하던 중 오류가 발생하였습니다' })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다'})
        }
    }
}

export default issuingJwt

////////// Error Type Class Define ////////// 
class ValueIsUndefined extends Error{ constructor(){ super('UID 또는 계정정보가 누락됨') } }
class ErrorOnInsertingRefreshToken extends Error{ constructor(){ super('토큰 보관을 위해 DB와 통신하는 중 에러가 발생함') } }