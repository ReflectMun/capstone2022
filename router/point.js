import express, { Router } from 'express'
import { normalLog } from '../private/apis/logger.js'
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

        res.json({ code: 240, point: point })
        normalLog(req, controllerName, `유저 UID: ${UID} 에게 잔여 포인트량을 전송함`)
    }
    catch(err){
    }
}
/////////////////////////////////////////////////////

export default fetchPoint