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

/////////////////////////////////////////////////////////////////////
// Router
signin.post(
    '/',
    requestLogSigninService,
    getSigninParameters,
    checkRegisteredMiddle,
    processRegister
)

signin.post('/check_registered', getSigninParameters, checkRegistered)

/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
// Middle ware
function getResponseObject(){
    return { code: null, body: null, err: null }
}

function requestLogSigninService(req, res, next){
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : ${req.ip} : 로그인 요청`)
    next()
}

function getSigninParameters(req, res, next){
    let ID, Password, email
    const response = getResponseObject()

    try{
        ID = req.body['ID']
        Password = req.body['password']
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

function checkRegisteredMiddle(req, res, next){
    const { paramID } = req.paramBox
    const response = getResponseObject()

    const isRegistered = await getRegisteredCheck()

    if(isRegistered == 1){
        response.code = 705
        response.body = { message: '이미 등록된 사용자입니다' }
        
        res.json(response)
    }

    next()
}

async function getRegisteredCheck(paramID){
    let conn

    try{
        const queryString = `SELECT COUNT(UID) FROM Users WHERE Account = '${paramID}'`
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        conn.release()

        const result = row[0]['COUNT(UID)']
        return result
    }
    catch(err){
        if(conn) { conn.release() }
        console.log(err)

        throw new Error(err.message)
    }
}

/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
// Controller
function checkRegistered(req, res, next){
    const { paramID } = req.paramBox
    const response = getResponseObject()

    const isRegistered = await getRegisteredCheck()

    if(isRegistered == 1){
        response.code = 705
        response.body = { message: '이미 등록된 사용자입니다' }
        
        res.json(response)
    }
    else{
        response.code = 205
        response.body = { message: '사용가능한 ID 입니다' }

        res.json(response)
    }
}

function processRegister(req, res, next){
    const { paramID: Account, Password, email } = req.paramBox

}

/////////////////////////////////////////////////////////////////////

export default signin