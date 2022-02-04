import { Router } from 'express'
import { readFile } from 'fs'
import AWS from 'aws-sdk'

const test = Router()
const S3 = new AWS.S3({
    accessKeyId: 'AKIAY6X2UAVIUFOCEBEJ',
    secretAccessKey: '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',
    region: 'us-east-1'
})

const bucketName = 'capsotnestorage'

S3.listBuckets((err, data) => {
    if(err) { console.log(err) }      
    else{
        console.log(data)
    }
})

test.get('/', (req, res) => {
    readFile('public/html/test.html', { encoding: 'utf-8' }, (err, data) => {
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

export default test //망할 커밋