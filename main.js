////////////////////////////////////////////////////////////////
// 서버 작동을 위한 라이브러리들
import './private/apis/env.js'
import express, { urlencoded } from 'express'
import serveStatic from 'serve-static'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 14450

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())
app.use(cookieParser())

app.use(serveStatic(join(__dirname, 'public/html')))
app.use(serveStatic(join(__dirname, 'public/js')))
app.use(serveStatic(join(__dirname, 'client/build')))
////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////
// Router들
import test from './router/test/test.js'
import api from './router/api.js'
import { readFile } from 'fs'
import { normalLog } from './private/apis/logger.js'

app.use('/test', test)
app.use('/api', api)
////////////////////////////////////////////////////////////////

// 서버가 응답을 받을 경우 처리 할 동작들을 정의하는 메서드
// 첫번째 인자는 엔드포인트 이름 / 만 있으면 따로 엔드포인트를 지정하지 않았다는 의미
// 두번째 인자는 해당 엔드포인트로 연결했을 때 실행될 동작들에 대한 정보가 담긴 콜백 함수
app.get('/', (req, res) => {
    readFile('client/build/index.html', { encoding: 'utf-8' }, (err, data) => {
        if(err){
            res.send('No Such File or Directory')
        }
        else{
            res.send(data)
            normalLog(req, 'main', '메인페이지 요청')
        }
    })
})

app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'client/build/index.html'))
})

app.listen(port, () => {
    console.log('Server start')
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
})