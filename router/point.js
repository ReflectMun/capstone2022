import express, { Router } from 'express'
import { errorLog, normalLog } from '../private/apis/logger.js'
import { jwtVerify } from '../private/apis/verifyJWT.js'
import Pool from '../private/server/DBConnector.js'

const fetchPoint = Router()
const controllerName = 'fetchPoint'

fetchPoint.get(
    '/',
    jwtVerify,
    FetchUserPointController
)

/////////////////////////////////////////////////////
// Controller
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function FetchUserPointController(req, res){
    const { UID } = req.paramBox
    let conn

    try{
        const queryString = `SELECT Point FROM Users WHERE UID = ${UID}`
        conn = await Pool.getConnection()

        await conn.beginTransaction()
        const [ data, fields ] = await conn.query(queryString)
        await conn.commit()

        const point = data[0]['Point']

        conn.release()
        res.json({ code: 240, point: point })
        normalLog(req, controllerName, `유저 UID: ${UID} 에게 잔여 포인트량을 전송함`)
    }
    catch(err){
        if(conn){
            await conn.commit()
            conn.release()
        }
        errorLog(req, controllerName, err.message += '=1')
        res.json({ code: 5050, message: '잔여 포인트량을 불러오는 도중 오류가 발생하였습니다' })
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
export async function checkEnoughPoint(req, res, next){
    const { UID } = req.paramBox
    const pointNeedWhenPost = 10
    let conn

    try{
        const queryString = `SELECT Point FROM Users WHERE UID = ${UID}`
        conn = await Pool.getConnection()

        await conn.beginTransaction()
        const [ data, fields ] = await conn.query(queryString)
        await conn.commit()

        const point = data[0]['Point']
        if(pointNeedWhenPost > point){
            res.json({ code: 5500, msg: "포인트가 부족합니다"})
        }else{
            const queryString2 = `UPDATE Users SET Point=${point - pointNeedWhenPost} WHERE UID = ${UID}`
            await conn.query(queryString2)
            await conn.commit()

            conn.release()
            next()
        }
    }
    catch(err){
        if(conn){
            conn.rollback()
            conn.release()
        }
        errorLog(req, controllerName, err.message += '=2')
        res.json({ code: 5051, message: '포인트량을 처리하는 도중 오류가 발생하였습니다' })
    }
}
/////////////////////////////////////////////////////

export default fetchPoint