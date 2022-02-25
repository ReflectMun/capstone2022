import { Router } from 'express'
import { readFile } from 'fs'
import AWS from 'aws-sdk'

const test = Router()

test.get('/', (req, res) => {
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
})

test.get('/s3Image', (req, res) => {
    const S3 = new AWS.S3({
        accessKeyId: 'AKIAY6X2UAVITBIQ7V4B',
        secretAccessKey: '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',
        region: 'ap-northeast-2'
    })

    S3.getObject({
        Bucket: 'capstonestorage',
        Key: 'Fox.jpeg'
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

export default test