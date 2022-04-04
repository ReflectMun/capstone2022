import { Router } from 'express'
import { readFile } from 'fs'
import AWS from 'aws-sdk'

import * as jwt from 'jsonwebtoken'
import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

const test = Router()

test.get('/jwt', OK)

function OK(req, res, nest){ 
    console.log('dddd')
    try{
        passport.authenticate('login', (err, user, info) => {
            console.log('dks')
            if(err || !user){
                res.send('로그인 실패')
                return
            }
            else{
                req.login(user, { session: false }, (loginErr) => {
                    if(loginErr){
                        res.send(loginErr)
                        return
                    }
                    else{
                        const token = jwt.sign(
                            { 
                                id: user.id,
                            },
                            'password'
                        )

                        res.json(token)
                    }
                })
            }
        })
    }
    catch(err){
        res.send(err)
    }
}

test.get('/', testS3Image)

test.get('/s3Image', (req, res) => {
    const S3 = new AWS.S3({
        accessKeyId: '',
        secretAccessKey: '',
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