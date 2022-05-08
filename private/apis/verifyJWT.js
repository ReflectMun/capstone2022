import jwt from 'jsonwebtoken'
import express from 'express'
import { errorLog } from './logger.js'
import Pool from '../server/DBConnector.js'

const { sign, verify } = jwt
const controllerName = 'jwtVerify'

/**
 * 리프레시 토큰이 유효한지 검사하는 함수
 * @param {string} UID 
 * @returns {boolean} 유효한 리프레시 토큰일 경우 true 리턴
 */
async function checkVaildRefreshToken(UID){
    let conn
    try{
        const queryString = `SELECT Token FROM RefreshTokens WHERE UID = ${UID}`

        conn = await Pool.createConnection(conn => conn)

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        const verifiedToken = verify(row[0]['Token'], process.env.JWT_SECRET, { algorithms: 'RS512' })
        return true
    } catch(err) {
        return false
    } finally {
        if(conn) { conn.release() }
    }
}

/**
 * 발급된 기존 토큰을 대체하는 새로운 토큰을 발급해주는 함수
 * @param {string} UID 
 * @param {string} Account 
 * @returns {string} 새로 발급된 토큰
 */
function issueNewAccessToken(UID, Account){
    const newToken = sign(
        { UID: UID, Account: Account },
        process.env.JWT_SECRET,
        { issuer:'SaiorQNA', algorithm: 'RS512', expiresIn: '20m'}
    )

    return newToken
}

/**
 * 일반적인 서비스에서 액세스 토큰 유효성을 검증하는 미들웨어
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export function jwtVerify(req, res, next){
    req.paramBox = {}
    req.tokenBox = {}

    const token = req.headers.authorization
    try{
        const verifiedToken = verify(token, process.env.JWT_SECRET, { algorithms: 'RS512' })
        const refreshIsVaild = checkVaildRefreshToken(verifiedToken['UID'])
        if(refreshIsVaild){
            req.paramBox['UID'] = verifiedToken['UID']
            req.paramBox['Account'] = verifiedToken['Account']
            next()
        }
        else{
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        if(err.message == 'jwt expired'){
            const expToken = verify(token, process.env.JWT_SECRET, { algorithms: 'RS512', ignoreExpiration: true }) 
            const refreshIsVaild = checkVaildRefreshToken(expToken['UID'])
            if(refreshIsVaild){
                const newAccessToken = issueNewAccessToken(expToken['UID'], expToken['Account'])
                req.tokenBox['token'] = newAccessToken
                next()
            }
            else{
                res.json({ code: 908, error: '로그인 하지 않았거나 로그인 시간이 만료된 사람입니다.' })
            }
        }
        else{
            res.json({ code: 908, error: '로그인 하지 않았거나 로그인 시간이 만료된 사람입니다.' })
        }
    }
}

/**
 * 로그인 API에 쓰일 액세스 토큰 검증. 서비스용 검증과는 달리 손상되어 있어야 next 호출
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export function jwtVerifyForSignin(req, res, next){
    const token = req.headers.authorization
    try{
        verify(token, process.env.JWT_SECRET)
        res.json({ code: 222, error: '이미 로그인한 사람입니다.' })
    }
    catch(err){
        const vaildToken = verify(token, process.env.JWT_SECRET, { algorithms: 'RS512' })
        const refreshIsVaild = checkVaildRefreshToken(vaildToken['UID'])
        if(!refreshIsVaild){
            next()
        }
        else{
            res.json({ code: 222, error: '이미 로그인한 사람입니다.' })
        }
    }
}

///
class RefreshTokenExpired extends Error{ constructor(){ super('RefreshToken 만료됨') } }