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
    const { UID, POINT } = req.paramBox
    let conn

    try{
        const queryString = `SELECT Point FROM Users WHERE UID = ${UID}`
        conn = await Pool.getConnection()

        await conn.beginTransaction()
        const [ data, fields ] = await conn.query(queryString)
        await conn.commit()

        const current_point = data[0]['Point']
        if(POINT>current_point){
            res.json({ code: 500, msg: "not enough point"})
        }else{
            const queryString2 = `UPDATE Users SET Point=${current_point-POINT} WHERE UID = ${UID}`
            await conn.query(queryString2)
            await conn.commit()
            res.json({ code: 240, point: current_poin=POINT })
        }
        
        normalLog(req, controllerName, `${UID}에게 잔여 포인트량을 전송함`)
    }
    catch(err){
        res.json({ code: 500, msg: "database error"})
    }
}
/////////////////////////////////////////////////////

export default fetchPoint