import { Router } from 'express'
import { readFile } from 'fs'
import Pool from '../private/server/DBConnector.js'

const signin = Router()

signin.get('/', (req, res) => {
    readFile('public/html/signinPage.html', { encoding: 'utf-8' }, (err, data) => {
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

signin.post(
    '/',
    requestLogSigninService,
    getSigninParameters)

function requestLogSigninService(req, res, next){
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : ${req.ip} : 로그인 요청`)
    next()
}

function getSigninParameters(req, res, next){
    let ID, Password, email

    const response = {
        code: null,
        body: null,
        err: null
    }

    try{
        ID = req.body['ID']
        password = req.body['password']
        email = req.body['email']

        req.paramBox = {
            paramID: ID,
            password: password,
            email: email
        }
    }
    catch(err){
        console.log(err.message)

        response.code = 1000
        response.err = { message: '잘못된 데이터 형식' }

        return res.json(response)
    }

    next()
}

async function checkRegistered(req, res, next){
    const { paramID } = req.paramBox
    let conn

    const response = {
        code: null,
        body: null,
        err: null
    }

    try{
        const queryString = `SELECT COUNT(UID) FROM Users WHERE Account = '${paramID}'`
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        conn.release()
    }
    catch(err){
        if(conn) { conn.release() }

        return 
    }

    next()
}

export default signin // tlqkf 이걸 main 브랜치에서 작업하고 있었네;;;