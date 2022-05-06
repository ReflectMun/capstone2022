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
 * express의 일반적인 콜백의 동작을 따름
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractUserInfo(req, res, next){
    try{
        const { UID, account } = req.body
        
        if(!UID || !account){
            throw new ValueIsUndefined()
        }

        req.paramBox = {
            UID: UID,
            Account: account
        }

        next()
    }
    catch(err){
        console.log(err.message)
        if(err instanceof ValueIsUndefined){
            res.json({ code: 351, message: '계정정보가 누락되었습니다' })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다' })
        }
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function issueJwtToken(req, res){
    const { UID, Account } = req.paramBox
    const accessToken = sign(
        { UID: UID, Account: Account },
        process.env.JWT_SECRET,
        { issuer: 'SaviorQNA', expiresIn: '20m', algorithm: 'RS512' }
    )
}

export default issuingJwt

////////// Error Type Class Define ////////// 
class ValueIsUndefined extends Error{ constructor(){ super('UID 또는 계정정보가 누락됨') } }