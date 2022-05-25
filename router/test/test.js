import { Router } from 'express'
import { readFile } from 'fs'
import AWS from 'aws-sdk'
import multer from 'multer'

const test = Router()
const formData = multer()

// test.get('/', testS3Image)
test.put('/', formData.single('content'), (req, res) => {
    console.log(req.body)
    console.log(req.file.originalname)
    res.json('ok')
})

test.get('/s3Image', (req, res) => {
    const S3 = new AWS.S3({
        accessKeyId: '',
        secretAccessKey: '',
        region: 'ap-northeast-2'
    })

    S3.getObject({
        Bucket: 'saviorimg',
        Key: 'EmperorChick.jpeg'
    }, (err, data) => {
        if(err) { console.log(`S3 Bucket에 파일이 존재하지 않음`) }
        else{
            res.send(data.Body)
        }
    })
})

test.get('/param/:num', param)

function param(req, res, next){
    const { num: uid } = req.params
    console.log(req.params)

    const doc = 
    `
    <!DOCTYPE html>
    <html>
        <body>
            <h1>Your Parameters</h1>
            <h2>${uid}</h2>
        </body>
    </html>
    `

    res.send(doc)
}

function testS3Image(req, res, next){
    readFile('./public/html/test/test.html', { encoding: 'utf-8' }, (err, data) => {
        if(err) { res.send('404 Not Found') }
        else{
            res.writeHead(200, {
                'Content-Type': 'text/html; encoding=utf-8'
            })
            res.write(data)
            res.end()
        }
    })
}

export default test