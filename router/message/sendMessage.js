import express, { Router } from 'express'
import { jwtVerify } from '../../private/apis/verifyJWT.js'
import { normalLog, errorLog } from '../../private/apis/logger.js'

const sendMessage = Router()
const controllerName = 'sendMessage'

sendMessage.put(
    '/',
    jwtVerify,
    extractAuthorAndRecipient,
)

///////////////////////////////////////////////
// Functions
///////////////////////////////////////////////

///////////////////////////////////////////////
// Middle Ware
/**
 * @param {express.Request} req 
 * @param {express.Router} res 
 * @param {express.NextFunction} next 
 */
function extractAuthorAndRecipient(req, res, next){
    const { Account: Author } = req.paramBox['Account']
    const { Recipient } = req.body
    try{
        if(typeof Author != 'string') { throw new AuthorMustBeString }
        if(typeof Recipient != 'string') { throw new RecipientMustBeString }

        req.paramBox['Author'] = Author
        req.paramBox['Recipient'] = Recipient
    }
    catch(err){
        errorLog(req)
        if(err instanceof AuthorMustBeString){
            res.json({ code: 3901, message: '발신자 이름이 잘못되었습니다' })
        }
        if(err instanceof RecipientMustBeString){
            res.json({ code: 3092, message: '수신자 이름이 잘못되었습니다' })
        }
    }
}
///////////////////////////////////////////////

///////////////////////////////////////////////
// Controller
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function sendMessageController(req, res){
}
///////////////////////////////////////////////
export default sendMessage

class AuthorMustBeString extends Error{ constructor() { super('발신자 정보는 문자여링어야 함') } }
class RecipientMustBeString extends Error{ constructor() { super('발신자 정보는 문자여링어야 함') } }