import { Router } from 'express'
import { readFile } from 'fs'
import AWS from 'aws-sdk'
import multer from 'multer'

const test = Router()
const upload = multer({ dest: null })

const S3 = new AWS.S3({
    accessKeyId: 'AKIAY6X2UAVITBIQ7V4B',
    secretAccessKey: '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',
    region: 'us-east-1'
})

const bucketName = 'capsotnestorage'

test.get('/', (req, res) => {
    readFile('public/html/test/test3.html', { encoding: 'utf-8' }, (err, data) => {
        if(err) { res.send('Not Found') }
        else{
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })
            .write(data)

            res.end()
        }
    })
})

test.get('/s3Image', (req, res) => {
    console.log('이미지 요청')
    S3.getObject({ Bucket: 'capstonestorage', Key:'Fox.jpeg' }, (err, data) => {
        if(err) { console.log(err) }
        else{
            // console.log(data)
            res.send(data.Body)
        }
    })
})

test.post('/putS3', upload.array('file'), (req, res) => {
    console.log('POST /putS3')

    for(const file of req.files){
        console.log(file)
    }

    res.json({ code: 200, message: 'OK' })
})

export default test