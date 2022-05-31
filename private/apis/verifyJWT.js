import jwt from 'jsonwebtoken'
import express from 'express'
import { errorLog, normalLog } from './logger.js'
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

        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        const verifiedToken = verify(row[0]['Token'], process.env.JWT_SECRET)

        if(conn) { conn.release() }
        return true
    } catch(err) {
        if(conn) { conn.release() }
        console.log(err.message)
        throw new RefreshTokenExpired()
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
        process.env.JWT_PRIVATE,
        { algorithm: 'RS512', issuer:'SaiorQNA', expiresIn: '20m'}
    )

    return newToken
}

/**
 * 일반적인 서비스에서 액세스 토큰 유효성을 검증하는 미들웨어
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export async function jwtVerify(req, res, next){
    req.paramBox = {}
    req.tokenBox = {}

    const token = req.headers.authorization
    console.log('체크', token)
    try{
        if(!token){
            throw new TokenDosentContained()
        }
        
        const verifiedToken = verify(token, process.env.JWT_PUBLIC, { algorithms: 'RS512' })

        if(await checkVaildRefreshToken(verifiedToken['UID'])){
            req.paramBox['UID'] = verifiedToken['UID']
            req.paramBox['Account'] = verifiedToken['Account']
            normalLog(req, controllerName, `로그인한 사용자 ${verifiedToken['Account']}`)
            next()
        }
        else{
            throw new RefreshTokenExpired()
        }
    }
    catch(err){
        if(err.message == 'jwt expired'){
            try{
                const expToken = verify(token, process.env.JWT_PUBLIC, { algorithms: 'RS512', ignoreExpiration: true }) 

                if(await checkVaildRefreshToken(expToken['UID'])){
                    const newAccessToken = issueNewAccessToken(expToken['UID'], expToken['Account'])
                    req.tokenBox['token'] = newAccessToken
                    normalLog(req, controllerName, `로그인한 사용자 ${expToken['Account']}, 새로운 인증토큰 발급 완료`)
                    next()
                }
                else{
                    errorLog(req, controllerName, err.message)
                    res.json({ code: 908, message: '로그인 하지 않았거나 로그인 시간이 만료된 사람입니다.' })
                }
            }
            catch(err){
                errorLog(req, controllerName, err.message)
                res.json({ code: 908, message: '로그인 하지 않았거나 로그인 시간이 만료된 사람입니다.' })
            }
        }
        else if(err.message == 'invalid token'){
            errorLog(req, controllerName, err.message)
            res.json({ code: 912, message: '로그인용 토큰이 아닌 유효하지 않은 데이터가 전송되었습니다' })
        }
        else{
            errorLog(req, controllerName, err.message)
            if(err instanceof TokenDosentContained){
                res.json({ code: 906, message: '로그인 정보가 없습니다. 로그인을 해 주세요' })
            }
            else if(err instanceof RefreshTokenExpired){
                res.json({ code: 908, message: '로그인 하지 않았거나 로그인 시간이 만료된 사람입니다.' })
            }
            else{
                res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다' })
            }
        }
    }
}

/**
 * 로그인 API에 쓰일 액세스 토큰 검증. 서비스용 검증과는 달리 손상되어 있어야 next 호출
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export async function jwtVerifyForSignin(req, res, next){
    const token = req.headers.authorization
    if(!token){
        next()
        return 
    }

    try{
        verify(token, process.env.JWT_PUBLIC, { algorithms: 'RS512' })
        res.json({ code: 905, error: '이미 로그인한 사람입니다.' })
    }
    catch(err){
        try{
            const vaildToken = verify(token, process.env.JWT_PUBLIC, { algorithms: 'RS512', ignoreExpiration: true })
            if(!await checkVaildRefreshToken(vaildToken['UID'])){
                next()
            }
            else{
                errorLog(req, controllerName, err.message)
                res.json({ code: 905, error: '이미 로그인한 사람입니다.' })
            } 
        }
        catch(err){
            next()
        }
    }
}

///
class RefreshTokenExpired extends Error{ constructor(){ super('RefreshToken 만료됨') } }
class TokenDosentContained extends Error{ constructor(){ super('Payload에 토큰 정보가 없음') } }