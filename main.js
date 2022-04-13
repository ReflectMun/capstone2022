import express, { urlencoded } from 'express'
import serveStatic from 'serve-static'
import bodyParser from 'body-parser'
import session from 'express-session'
import cookieParser from 'cookie-parser'

import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 14450

// const sessionStorage = new MySQLStore()

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
    secret: 'oKvIld1552DJFO38a9S1azzo339DKskz34ALxl1120z',
    resave: false,
    saveUninitialized: true,
    rolling: true,
    cookie: { maxAge: 1000 * 60 }
}))

app.use(serveStatic(join(__dirname, 'public/html')))
app.use(serveStatic(join(__dirname, 'public/js')))
app.use(serveStatic(join(__dirname, 'public/css')))

////////////////////////////////////////////////////////
// 여기 이 영역은 글로 설명하기엔 힘드니 다음번에 만났을 때
// 그림 그려가면서 설명해드리겠습니다

import login from './router/login.js'
import loginPage from './router/pages/loginPage.js'
import signin from './router/signin.js'
import upload from './router/upload.js'
import logout from './router/logout.js'
import comment from './router/comment.js'

app.use('/api/comment',comment)  // /api/comment 라우터 추가
                                 
app.use('/api/login', login)
app.use('/login', loginPage)
app.use('/signin', signin)
app.use('/logout', logout)

app.use('/upload', upload)
////////////////////////////////////////////////////////

// 서버가 응답을 받을 경우 처리 할 동작들을 정의하는 메서드
// 첫번째 인자는 엔드포인트 이름 / 만 있으면 따로 엔드포인트를 지정하지 않았다는 의미
// 두번째 인자는 해당 엔드포인트로 연결했을 때 실행될 동작들에 대한 정보가 담긴 콜백 함수
app.get('/', (req, res) => {
    // req는 서버에 요청을 날린 클라이언트의 정보가 담긴 객체
    // res는 서버에 요청을 날린 클라이언트에게 응답할 객체
    const response = {
        code: 200,
        body: 'Hello, World!'
    }
    
    // json의 형태로 응답하는 메서드
    res.json(response)
})

app.listen(port, () => {
    // 서버를 실행시키는 코드, 여기에 정의된 동작들이 서버 실행직후 동작됨
    console.log('Server start')
})

// 가지 체크용 코멘트 dd