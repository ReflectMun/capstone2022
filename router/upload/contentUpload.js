import express, { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'
import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'
import { errorLog } from '../../private/apis/logger.js'

AWS.config.loadFromPath('./private/credential/s3.json')

const contentUpload = Router()
const s3 = new AWS.S3()
const controllerName = 'ContentUploader'
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
    putContentController,
    putContentToS3.single('content')
)

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function putContentController(req, res){
    let conn

    try {
        const queryString =
        `INSERT INTO Posts()`

        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        await conn.query()
        await conn.commit()
    }
    catch (err) {
        errorLog(req, controllerName, err.message)
    } 
    finally {
        if (conn) { conn.release() }
    }
    
}

export default contentUpload