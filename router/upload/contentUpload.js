import express, { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'
import multer from 'multer'
import { errorLog, normalLog } from '../../private/apis/logger.js'
import { jwtVerify } from '../../private/apis/verifyJWT.js'
import { putObjectToS3 } from '../../private/server/S3Connector.js'

const contentUpload = Router()
const controllerName = 'ContentUploader'

const fileChecker = multer()

contentUpload.put(
    '/',
    jwtVerify,
    fileChecker.fields([
        { name: 'content' },
        { name: 'BoardURI' },
        { name: 'Title' },
        { name: 'Type' }
    ]),
    extractValues,
    putContentController,
    okResponserController,
    errorHandle
)

////////////////////////////////////////////////////////////////
// Middle Ware
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractValues(req, res, next){
    const { BoardURI, Title, Type } = req.body

    req.file = req.files['content'][0]

    if(typeof BoardURI != 'string'){
        throw new InvalidValueType('BoardURI')
    }
    if(typeof Title != 'string'){
        throw new InvalidValueType('Title')
    }
    if(typeof Type != 'string'){
        throw new InvalidValueType('Type')
    }

    req.paramBox['BoardURI'] = BoardURI
    req.paramBox['Title'] = Title
    req.paramBox['Type'] = Type

    next()
}

/**
 * @param {Error} err 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function errorHandle(err, req, res, next){
    errorLog(req, controllerName, err.message)
    if(err instanceof InvalidValueType){
        res.json({ code: 8810, message: '게시판 이름 또는 글 제목이 손상되었습니다', newToken: req.tokenBox['token'] })
    }
    else if(err instanceof FileExtractFailed){
        res.json({ code: 8812, message: '작성하신 본문이 전송되지 않았거나 손상되었습니다', newToken: req.tokenBox['token'] })
    }
    else if(err.message == 'Unexpected field'){
        res.json({ code: 8813, message: '잘못된 형식의 데이터가 도착하였습니다', newToken: req.tokenBox['token'] })
    }
    else{
        res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다', newToken: req.tokenBox['token'] })
    }
}
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// Controller
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next
 */
async function putContentController(req, res, next){
    const { Account: Author, UID: AuthorUID, BoardURI, Title, Type } = req.paramBox
    const { originalname } = req.file
    let conn

    const renamedName = originalname + `_${Author}_${new Date().getMilliseconds()}`

    try {
        const queryString =
        `INSERT INTO Posts(BoardURI, Title, AuthorUID, Author, Date, Time, Type, FileName)
        VALUES('${BoardURI}', '${Title}', '${AuthorUID}', '${Author}', NOW(), NOW(), ${Type}, '${renamedName}')`

        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        await conn.query(queryString)
        await conn.commit()

        await putObjectToS3('saviorcontent', renamedName, req.file.buffer)
        
        next()
    }
    catch (err) {
        errorLog(req, controllerName, err.message)
        res.json({ code: 5792, message: '글을 저장하는 도중 오류가 발생하였습니다', newToken: req.tokenBox['token'] })
    } 
    finally{
        if (conn) { conn.release() }
    }
}

function okResponserController(req, res){
    const { Account: Author, Title } = req.paramBox
    res.json({ code: 230, message: '본문 작성 완료', newToken: req.tokenBox['token'] })
    normalLog(req, controllerName, `사용자 ${Author}이(가) 게시글 ${Title}을 작성함`)
}
////////////////////////////////////////////////////////////////

export default contentUpload

class InvalidValueType extends Error{ constructor(valueName){ super(`${valueName}이(가) 손상되거나 전송되지 않았음`) } }
class FileExtractFailed extends Error{ constructor(){ super('파일이 실려오지 않았음') } }