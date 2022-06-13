import express, { Router } from 'express'
import { normalLog, errorLog } from '../../private/apis/logger.js'
import { jwtVerify } from '../../private/apis/verifyJWT.js'
import Pool from '../../private/server/DBConnector.js'

const fetchMessage = Router()
const controllerName = 'fetchMessage'

fetchMessage.get(
    '/sended',
    jwtVerify,
    extractSender,
    extractPageNum,
    fetchSendedMessageController
)

fetchMessage.get(
    '/received',
    jwtVerify,
    extractRecipient,
    extractPageNum,
    fetchReceivedMessageController
)

////////////////////////////////////////////
// MiddleWare
/**
 * 메시지 Fetching에 필요한 값들을 추출하는 미들웨어
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractSender(req, res, next){
    const Author = req.paramBox['Account']
    req.paramBox['Author'] = Author
    next()
}

/**
 * 메시지 Fetching에 필요한 값들을 추출하는 미들웨어
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractRecipient(req, res, next){
    const Recipient = req.paramBox['Account']
    req.paramBox['Recipient'] = Recipient
    next()
}

/**
 * 메시지 Fetching에 필요한 값들을 추출하는 미들웨어
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractPageNum(req, res, next){
    try{
        const { pageNum } = req.query

        if(!pageNum){
            throw new Error()
        }

        console.log(`pageNum: '${pageNum}'`)

        req.paramBox['pageNum'] = parseInt(pageNum, 10)

        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        res.json({ code: 7700, message: '페이지 번호가 없습니다', newToken: req.tokenBox?.['token'] ?? null})
    }
}
////////////////////////////////////////////

////////////////////////////////////////////
// Controller
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function fetchSendedMessageController(req, res){
    let conn
    const { Author } = req.paramBox
    const pageNum = req.paramBox['pageNum'] * 15
    try{
        const queryString =
        `SELECT MessagesID, Recipient, RecipientNickname, Date, Time, Content
        FROM Messages
        WHERE Author = '${Author}' && HiddenForAuthor = 0
        ORDER BY MessagesID DESC
        LIMIT ${pageNum}, 15`

        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ messages, fields ] = await conn.query(queryString)
        await conn.commit()

        if(messages.length < 1){
            res.json({
                code: 215,
                messages: '보낸 메시지가 존재하지 않습니다',
                newToken: req.tokenBox?.['token'] ?? null
            })
            normalLog(req, controllerName, '보낸 메시지가 없음')
        }
        else{
            res.json({
                code: 214,
                list: messages,
                newToken: req.tokenBox?.['token'] ?? null
            })
            normalLog(req, controllerName, '보낸 메시지 전송 완료')
        }
    }
    catch(err){
        errorLog(req, controllerName, err.messages)
        res.json({ code: 7701, message: '보낸 메시지 목록을 불러오는 중 오류가 발생하였습니다', newToken: req.tokenBox?.['token'] ?? null })
    }
    finally{
        if(conn) { conn.release() }
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function fetchReceivedMessageController(req, res){
    let conn
    const { Recipient } = req.paramBox
    const pageNum = req.paramBox['pageNum'] * 15
    try{
        const queryString =
        `SELECT MessagesID, Author, AuthorNickname, Date, Time, Content
        FROM Messages
        WHERE Recipient = '${Recipient}' && HiddenForRecipient = 0
        ORDER BY MessagesID DESC
        LIMIT ${pageNum}, 15`

        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ messages, fields ] = await conn.query(queryString)
        await conn.commit()

        if(messages.length < 1){
            res.json({
                code: 217,
                messages: '받은 메시지가 존재하지 않습니다',
                newToken: req.tokenBox?.['token'] ?? null
            })
            normalLog(req, controllerName, '받은 메시지가 없음')
        }
        else{
            res.json({
                code: 216,
                list: messages,
                newToken: req.tokenBox?.['token'] ?? null
            })
            normalLog(req, controllerName, '받은 메시지 전송 완료')
        }
    }
    catch(err){
        errorLog(req, controllerName, err.messages)
        res.json({ code: 7701, message: '보낸 메시지 목록을 불러오는 중 오류가 발생하였습니다', newToken: req.tokenBox?.['token'] ?? null })
    }
    finally{
        if(conn) { conn.release() }
    }
}
////////////////////////////////////////////

export default fetchMessage