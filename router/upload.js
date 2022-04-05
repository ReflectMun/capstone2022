import { Router } from 'express'
import { readFile } from 'fs'

import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'

AWS.config.loadFromPath('./private/credential/s3.json')

const upload = Router()
const s3 = new AWS.S3()
const upload_func = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'capstonestorage',
        // acl: 'public-read',
        key: function (req, file, cb) {
            console.log(file.originalname)
            cb(null,file.originalname)
        }
    }),
    limits: {
        fileSize: 1000 * 1000 * 10
    }
});


upload.get('/', uploadform)
function uploadform(req, res) {
    readFile('./public/html/upload/upload.html', { encoding: 'utf-8' }, (err, data) => {
        if (err) { res.send('404 Not Found') }
        else {
            res.writeHead(200, {
                'Content-Type': 'text/html; encoding=utf-8'
            })
            res.write(data)
            res.end()
        }
    })
}

upload.post('/putS3', upload_func.single('img'), (req, res) => {
    console.log('여기까지 넘어오긴 하나')
    let imgFile = req.file
})

upload.get('/getS3/:filename', function (req, res, next) {
    let { filename } = req.params;
    try {
        console.log(filename)
        let fileToSend = s3.getObject({ Bucket: "capstonestorage", Key: filename }).createReadStream()
        fileToSend.pipe(res)
    } catch (error) {
        res.send({ error: "server error" })
    }
})

export default upload