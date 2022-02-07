import { Router } from 'express'
import { readFile } from 'fs'
import AWS from 'aws-sdk'

const test = Router()

// 로컬에서 테스트 시엔 이 코드를 주석 해제하고 테스트 해보시면 됩니다
// 주석 설정 단축키 : ctrl(command) + /
const S3 = new AWS.S3({
    accessKeyId: 'AKIAY6X2UAVIUFOCEBEJ',
    secretAccessKey: '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',
    region: 'us-east-1'
})

// 서버로 푸시할 땐 반드시 이거 주석 해제하시고, 위 코드는 주석 처리 후 푸시해주세요
// const S3 = new AWS.S3()

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

export default test

////