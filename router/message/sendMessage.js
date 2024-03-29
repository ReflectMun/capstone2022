import express, { Router } from 'express'
import { jwtVerify } from '../../private/apis/verifyJWT.js'
import { normalLog, errorLog } from '../../private/apis/logger.js'
import Pool from '../../private/server/DBConnector.js'

const sendMessage = Router()
const controllerName = 'sendMessage'

sendMessage.put(
    '/',
    jwtVerify,
    extractAuthorAndRecipient,
    extractMessageContent,
    checkVaildRecipient,
    sendMessageController
)

///////////////////////////////////////////////
// Middle Ware
/**
 * @param {express.Request} req 
 * @param {express.Router} res 
 * @param {express.NextFunction} next 
 */
function extractAuthorAndRecipient(req, res, next){
    const { Account: Author, Nickname: AuthorNickname } = req.paramBox
    const { Recipient } = req.body

    console.log(req.headers['content-type'])
    console.log('발신자 이름: ', Author)
    console.log('쪽지발신 body 내용물: ', req.body)
    
    try{
        if(typeof Author != 'string') { throw new AuthorMustBeString }
        if(typeof AuthorNickname != 'string') { throw new AuthorNicknameMustBeString }
        if(typeof Recipient != 'string') { throw new RecipientMustBeString }

        req.paramBox['Author'] = Author
        req.paramBox['AuthorNickname'] = AuthorNickname
        req.paramBox['Recipient'] = Recipient

        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-1')
        if(err instanceof AuthorMustBeString){
            res.json({ code: 3901, message: '발신자 이름이 잘못되었습니다', newToken: req.tokenBox?.['token'] ?? null })
        }
        else if(err instanceof AuthorNicknameMustBeString){
            res.json({ code: 3902, message: '발신자 닉네임이 잘못되었습니다', newToken: req.tokenBox?.['token'] ?? null })
        }
        else if(err instanceof RecipientMustBeString){
            res.json({ code: 3093, message: '수신자 이름이 잘못되었습니다', newToken: req.tokenBox?.['token'] ?? null })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다', newToken: req.tokenBox?.['token'] ?? null })
        }
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractMessageContent(req, res, next){
    const { Content } = req.body

    try{
        if(typeof Content != 'string'){
            throw new InvaliedContent()
        }
        if(!Content || Content.length == 0){
            throw new EmptyContent()
        }
        if(Content.length < 0 || Content.length > 512){
            throw new InvaliedContent()
        }
        
        req.paramBox['Content'] = Content

        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-2')
        if(err instanceof EmptyContent){
            res.json({ code: 5901, message: '빈 메시지를 전송할 수 없습니다', newToken: req.tokenBox?.['token'] ?? null })
        }
        else if(err instanceof InvaliedContent){
            res.json({ code: 5092, message: '올바르지 않은 데이터가 전송되었습니다', newToken: req.tokenBox?.['token'] ?? null })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다', newToken: req.tokenBox?.['token'] ?? null })
        }
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function checkVaildRecipient(req, res, next){
    const { Recipient } = req.paramBox
    let conn

    try{
        const queryString = `SELECT Account, Nickname FROM Users WHERE Account = '${Recipient}' AND isSignedOut = 0`

        conn = await Pool.getConnection()

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        if(row.length == 1){
            req.paramBox['RecipientNickname'] = row[0]['Nickname']
            next()
        }
        else if(row.length == 0){
            throw new UserNotFound()
        }
        else{
            throw new Error('Unknown Error on DB')
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-3')
        if(err instanceof UserNotFound){
            res.json({ code: 5911, message: '받는사람을 찾을 수 없습니다', newToken: req.tokenBox?.['token'] ?? null })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다', newToken: req.tokenBox?.['token'] ?? null })
        }
    }
    finally{
        if(conn) { conn.release() }
    }
}
///////////////////////////////////////////////

///////////////////////////////////////////////
// Controller
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function sendMessageController(req, res){
    let conn = null
    const { Author, AuthorNickname, Recipient, RecipientNickname, Content } = req.paramBox
    try{
        const queryString = 
        `INSERT INTO Messages(Author, AuthorNickname, Recipient, RecipientNickname, Date, Time, Content)
        VALUES('${Author}', '${AuthorNickname}', '${Recipient}', '${RecipientNickname}', NOW(), NOW(), '${Content}')`

        conn = await Pool.getConnection()

        await conn.beginTransaction()
        await conn.query(queryString)
        await conn.commit()

        res.send({ code: 220, message: '메시지 송신 완료', newToken: req.tokenBox?.['token'] ?? null })
        normalLog(req, controllerName, `${AuthorNickname}이(가) ${RecipientNickname} 에게 쪽지를 전송함`)
    }
    catch(err){
        errorLog(req, controllerName, err.message += '=1')
        res.json({ code: 8081, message: '쪽지 전송 중 오류가 발생했습니다', newToken: req.tokenBox?.['token'] ?? null })
    }
    finally{
        if(conn) { conn.release() }
    }
}
///////////////////////////////////////////////
export default sendMessage

class AuthorMustBeString extends Error{ constructor() { super('발신자 정보는 문자열이어야 함') } }
class AuthorNicknameMustBeString extends Error{ constructor() { super('발신자 정보는 문자열이어야 함') } }
class RecipientMustBeString extends Error{ constructor() { super('수신자 정보는 문자열이어야 함') } }
class EmptyContent extends Error{ constructor() { super('빈 메시지가 전송됨') } }
class InvaliedContent extends Error{ constructor() { super('올바르지 않은 메시지가 전송됨') } }
class UserNotFound extends Error{ constructor() { super('유저를 찾을 수 없음') } }