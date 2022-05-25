import express, { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'
import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'
import { errorLog } from '../../private/apis/logger.js'
import { jwtVerify } from '../../private/apis/verifyJWT.js'

AWS.config.loadFromPath('./private/credential/s3.json')

const contentUpload = Router()
const s3 = new AWS.S3()
const controllerName = 'ContentUploader'

const fileChecker = multer()
const putContentToS3 = multer({   // multer upload 함수 설정
    storage: multerS3({
        s3: s3,
        bucket: 'saviorcontent',
        key: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    limits: {
        fileSize: 1000 * 1000 * 10
    }
});

contentUpload.put(
    '/',
    // jwtVerify,
    extractValues,
    putContentController,
    putContentToS3.single('content'),
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
    const { BoardURI, Title } = req.body

    if(typeof BoardURI != 'string'){
        throw new InvalidValueType('BoardURI')
    }
    if(typeof Title != 'string'){
        throw new InvalidValueType('Title')
    }

    const ct = multer().single('content')
    ct(req, res, (err) => {
        if(err) { throw err }

        if(!req.file){
            throw new FileExtractFailed()
        }
        else{
            req.paramBox['BoardURI'] = BoardURI
            req.paramBox['Title'] = Title

            next()
        }
    })
}

function errorHandle(err, req, res, next){
    errorLog(req, controllerName, err.message)

}
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// Controller
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function putContentController(req, res){
    const { Account: Author, UID: AuthorUID } = req.paramBox
    let conn

    try {
        const queryString =
        `INSERT INTO Posts(BoardURI, Title, AuthorUID, Author, Date, Time, FileName)
        VALUES()`

        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        await conn.query()
        await conn.commit()
    }
    catch (err) {
        errorLog(req, controllerName, err.message)
        res.json({ code: 5792, message: '글을 저장하는 도중 오류가 발생하였습니다' })
    } 
    finally {
        if (conn) { conn.release() }
    }
    
}
////////////////////////////////////////////////////////////////

export default contentUpload

class InvalidValueType extends Error{ constructor(valueName){ super(`${valueName}이(가) 손상되거나 전송되지 않았음`) } }
class FileExtractFailed extends Error{ constructor(){ super('파일이 실려오지 않았음') } }