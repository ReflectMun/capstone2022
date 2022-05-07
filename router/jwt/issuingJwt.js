import jwt from 'jsonwebtoken'
import express, { Router } from 'express'

const issuingJwt = Router()
const { sign } = jwt

issuingJwt.get(
    '/', 
    extractUserInfo,
    issueJwtToken
)

/**
 * 유저 정보 추출용 함수.
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractUserInfo(req, res, next){
    try{
        const { UID, account } = req.query
        
        // UID or account 정보가 없어서 null, undefined 등 false 값일 경우
        if(!UID || !account){
            throw new ValueIsUndefined()
        }

        // 추출에 성공했다면 리퀘스트 객체에 값을 담아서 다음 미들웨어로 넘김
        req.paramBox = {
            UID: UID,
            Account: account
        }
    }
    catch(err){
        console.log(err.message)
        if(err instanceof ValueIsUndefined){ // UID, account 값 누락시
            return res.json({ code: 351, message: '계정정보가 누락되었습니다' })
        }
        else{ // 정의되지 않은 예외 발생시
            return res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다' })
        }
    }

    next()
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function issueJwtToken(req, res){
    const { UID, Account } = req.paramBox
    try{
        // 서비스 이용에 쓰이는 액세스 토큰 발급
        const accessToken = sign(
            { UID: UID, Account: Account },
            process.env.JWT_SECRET,
            { issuer: 'SaviorQNA', expiresIn: '20m', algorithm: 'RS512' }
        )

        // 서비스 이용 중 액세스 토큰 만료시 이를 재발급 하기 위한 리프레시 토큰 발급
        const refreshToken = sign(
            { UID: UID, Account: Account },
            process.env.JWT_SECRET,
            { issuer: 'SaviorQNA', expiresIn: '20m', algorithm: 'RS512' }
        )
    }
    catch(err){

    }
}

export default issuingJwt

////////// Error Type Class Define ////////// 
class ValueIsUndefined extends Error{ constructor(){ super('UID 또는 계정정보가 누락됨') } }