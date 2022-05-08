import express, { Router } from 'express'
import { errorLog, normalLog } from '../../private/apis/logger.js'
import { jwtVerify } from '../../private/apis/verifyJWT.js'
import Pool from '../../private/server/DBConnector.js'

const logout = Router()
const controllerName = 'logout'

logout.get(
    '/', 
    jwtVerify,
    processLogout
)

/**
 * 로그아웃을 진행하는 API. DB에 저장되어 있는 RefreshToken을 제거함 
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function processLogout(req, res){
    let conn
    try{
        const queryString =
        `DELETE FROM RefreshTokens WHERE UID = '${req.paramBox['UID']}'`

        conn = await Pool.createConnection(conn => conn)

        await conn.beginTransaction()
        await conn.query(queryString)
        await conn.commit()

        normalLog(req, controllerName, `유저 ${req.paramBox['Account']} 로그아웃 및 RefreshToken 파기 완료`)
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        res.json({ code: 4403, message: '로그아웃 중 서버에서 오류가 발생하였습니다' })
    }
}

export default logout