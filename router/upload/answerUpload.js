import express, { Router } from 'express'
import multer from 'multer'
import { jwtVerify } from '../../private/apis/verifyJWT.js'
import { putObjectToS3 } from '../../private/server/S3Connector.js'
import Pool from '../../private/server/DBConnector.js'
import { errorLog, normalLog } from '../../private/apis/logger.js'
import { increaseUserPoint } from '../point.js'

const answerUploader = Router()
const controllerName = 'answerUpload'

const fileCheck = multer()

answerUploader.put(
    '/',
    jwtVerify,
    fileCheck.fields([
        { name: 'content' },
        { name: 'SourceQuestion' }
    ]),
    extractValues,
    increaseUserPoint,
    answerUploadController,
    answerUploadErrorController
)

//////////////////////////////////////////////////////////////
// Functions
//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
// Middle Ware
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractValues(req, res, next){
    const { SourceQuestion } = req.body
    req.file = req.files['content'][0]

    if(typeof SourceQuestion != 'string'){
        throw new InvalidValueType()
    }

    req.paramBox['SourceQuestion'] = SourceQuestion

    next()
}
//////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
// Controller
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next
 */
async function answerUploadController(req, res, next){
    const { Account: Author, UID: AuthorUID, Nickname: AuthorNickname, SourceQuestion } = req.paramBox
    const { originalname } = req.file
    const renamedName = originalname + `_${Author}_${new Date().getMilliseconds()}`

    let conn

    try{
        const queryString =
        `INSERT INTO Posts(Author, AuthorUID, AuthorNickname, Date, Time, Type, FileName, SourceQuestion)
        VALUES('${Author}', '${AuthorUID}', '${AuthorNickname}', NOW(), NOW(), 3, '${renamedName}', ${SourceQuestion})`
        conn = await Pool.getConnection()

        await conn.beginTransaction()
        await conn.query(queryString)
        await conn.commit()

        await putObjectToS3('saviorcontent', renamedName, req.file.buffer)

        res.json({ code: 231, message: '답변글 작성 완료', newToken: req.tokenBox['token'] })
        normalLog(req, controllerName, `${Author}이(가) 글번호 ${SourceQuestion}에 답변글을 작성함`)
    }
    catch(err){
        errorLog(req, controllerName, err.message += '=1')
        res.json({ code: 2023, message: '답변글을 등록하는 중 오류가 발생하였습니다', newToken: req.tokenBox['token'] })
    }
    finally{
        if(conn) { conn.release() }
    }
}

/**
 * @param {Error} err 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function answerUploadErrorController(err, req, res, next){
    errorLog(req, controllerName, err.message += 'err1')
    if(err instanceof InvalidValueType){
        res.json({ code: 5024, message: '해당 답변이 달릴 질문글의 주소가 누락되거나 손상되었습니다', newToken: req.tokenBox['token']})
    }
    else{
        res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다', newToken: req.tokenBox['token'] })
    }
}
//////////////////////////////////////////////////////////////

export default answerUploader

class InvalidValueType extends Error{ constructor(){ super('올바르지 않은 타입의 데이터가 전송됨') } }