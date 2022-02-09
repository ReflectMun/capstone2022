import { Router } from 'express'
import { readFile } from 'fs'

const test = Router()


const bucketName = 'capsotnestorage'

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

test.put('/putS3')

export default test

////