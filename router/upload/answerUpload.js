import express, { Router } from 'express'
import multer from 'multer'
import { jwtVerify } from '../../private/apis/verifyJWT.js'
import { putObjectToS3 } from '../../private/server/S3Connector.js'
import Pool from '../../private/server/DBConnector.js'
import { normalLog } from '../../private/apis/logger.js'

const answerUploader = Router()
const controllerName = 'answerUpload'

const fileCheck = multer()

answerUploader.put(
    '/',
    // jwtVerify,
    fileCheck.fields([
        { name: 'content' },
        { name: 'SourceQuestion' }
    ]),
    extractValues,
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
 */
async function answerUploadController(req, res){
    const { Account: Author, UID: AuthorUID, SourceQuestion } = req.paramBox
    const { originalname } = req.file
    const renamedName = originalname + `_${Author}_${new Date().getMilliseconds()}`

    let conn

    try{
        const queryString =
        `INSERT INTO Posts(Author, AuthorUID, Date, Time, Type, FileName, SourceQuestion)
        VALUES('${Author}', '${AuthorUID}', NOW(), NOW(), 3, '${renamedName}', ${SourceQuestion})`
        conn = await Pool.getConnection()

        await conn.beginTransaction()
        await conn.query(queryString)
        await conn.commit()

        await putObjectToS3('saviorcontent', renamedName, req.file.buffer)

        res.json({ code: 231, message: '답변글 작성 완료'})
        normalLog(req, controllerName, `${Author}이(가) 글번호 ${SourceQuestion}에 답변글을 작성함`)
    }
    catch(err){

    }
    finally{

    }
}

/**
 * @param {Error} err 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function answerUploadErrorController(err, req, res, next){

}
//////////////////////////////////////////////////////////////

export default answerUploader

class InvalidValueType extends Error{ constructor(){ super('올바르지 않은 타입의 데이터가 전송됨') } }