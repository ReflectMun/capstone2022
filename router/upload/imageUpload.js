import express, { Router } from 'express'
import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'
import { normalLog } from '../../private/apis/logger.js'
import { jwtVerify } from '../../private/apis/verifyJWT.js'

AWS.config.loadFromPath('./private/credential/s3.json')

const imageUpload = Router()
const S3 = new AWS.S3()
const controllerName = 'ImageUploader'
const imageUploadToS3 = multer({
    storage: multerS3({
        s3: S3,
        bucket: 'saviorimg',
        key: function (req, file, callback) {
            let fileType
            const fileMimetype = file.mimetype

            switch(fileMimetype){
                case 'image/jpeg':
                    fileType = 'jpeg'
                    break
                case 'image/png':
                    fileType = 'png'
                    break
                case 'image/gif':
                    fileType = 'gif'
                    break
                case 'image/webp':
                    fileType = 'webp'
                    break
                default:
                    fileType = 'jpg'
                    break
            }

            file.encodedName = Buffer.from(file.originalname + new Date().getMilliseconds()).toString('base64url') + `.${fileType}`
            callback(null, file.encodedName)
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});

imageUpload.put(
    '/',
    jwtVerify,
    imageUploadToS3.single('files'),
    imageUploadController
)

/**
 * AWS S3에 Put한 파일을 편집기에서 이용할 수 있도록 파일의 퍼블링 링크를 리턴
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function imageUploadController (req, res) {
    const { encodedName } = req.file

    const objectPublicUrl =`https://saviorimg.s3.ap-northeast-2.amazonaws.com/${encodedName}`
    res.json(objectPublicUrl)

    normalLog(req, controllerName, `파일 ${encodedName} 업로드 완료`)
}

export default imageUpload