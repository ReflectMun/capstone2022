import { Router } from 'express'
import { readFile } from 'fs'
import { S3 } from 'aws-sdk'

const test = Router()
const bucketName = 'capsotnestorage'

test.get('/', (req, res) => {
    readFile('/public/html/test.html', { encoding: 'utf-8' }, (err, data) => {
        if(err) { res.send('Not Found') }
        else{

        }
    })
})

test.get('/s3Image', (req, res) => {
    
})

export default test //망할 커밋