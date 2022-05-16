import express, { Router } from 'express'
import { normalLog, errorLog } from '../../private/apis/logger.js'
import { jwtVerify } from '../../private/apis/verifyJWT.js'
import Pool from '../../private/server/DBConnector.js'

const fetchSendedMessage = Router()
const controllerName = 'fetchSendedMessage'

fetchSendedMessage.get(
    '/sended',
    jwtVerify,
)

////////////////////////////////////////////
// Functions
////////////////////////////////////////////

////////////////////////////////////////////
// MiddleWare
/**
 * 메시지 Fetching에 필요한 값들을 추출하는 미들웨어
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractSender(req, res, next){
    const { Sender } = req.paramBox['Account']
}
////////////////////////////////////////////

////////////////////////////////////////////
// Controller
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function fetchMessageController(req, res){
}
////////////////////////////////////////////

export default fetchSendedMessage
class SenderNotExist extends Error{ constructor(){ super('Sender 값이 존재하지 않음') } }