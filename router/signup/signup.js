import express, { Router } from 'express'
import crypto from 'crypto'
import { createTransport } from 'nodemailer'
import smtp from 'nodemailer-smtp-transport'
import { renderFile } from 'ejs'
import { errorLog, normalLog } from '../../private/apis/logger.js'
import Pool from '../../private/server/DBConnector.js'
import session from 'express-session'
import fileSession from 'session-file-store'

const signup = Router()
const controllerName = 'signup'
const transportter = createTransport(smtp({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: 'qnasavior@gmail.com',
        pass: 'syluupofbesfopsp'
    }
}))

const FileStore = fileSession(session)
signup.use(session({
    secret: process.env.SESSION,
    rolling: false,
    saveUninitialized: false,
    resave: true,
    store: new FileStore({
        retries: 1
    })
}))

/////////////////////////////////////////////////////////////////////
// Router
signup.post(
    '/',
    extractSignupParameters,
    checkCorrectData,
    checkRegisteredAccountMiddle,
    checkRegisteredNicknameMiddle,
    checkRegisteredEMailMiddle,
    processRegister
)

signup.post(
    '/check_registered',
    extractSignupParameters,
    checkRegisteredAccount
)

signup.post(
    '/check/email',
    extractEmail
)

/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
// Functions
/**
 * 실제로 DB와 연결해 이미 사용중인 ID인지 체크하는 함수, UID가 일치하는 Row의 갯수 반환
 * @param {string} paramID 중복인지 체크하려는 ID
 * @returns {number} UID가 일치하는 DB 내부의 Row의 갯수
 */
 async function getRegisteredAccountCheck(paramID){
    let conn, result

    try{
        const queryString = `SELECT COUNT(UID) FROM Users WHERE Account = '${paramID}'`
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        result = row[0]['COUNT(UID)']
    } catch(err){
        err.message += '-101'
        console.log(err.message)
        throw new ErrorOnRegisterChecking()
    } finally{
        if(conn) { conn.release() }
    }
    
    return result
}

/**
 * 실제로 DB와 연결해 이미 사용중인 닉네임인지 체크하는 함수, UID가 일치하는 Row의 갯수 반환
 * @param {string} Nickname 중복인지 체크하려는 ID
 * @returns {number} UID가 일치하는 DB 내부의 Row의 갯수
 */
 async function getRegisteredNicknameCheck(Nickname){
    let conn, result

    try{
        const queryString = `SELECT COUNT(UID) FROM Users WHERE Nickname = '${Nickname}'`
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        result = row[0]['COUNT(UID)']
    } catch(err){
        err.message += '-102'
        console.log(err.message)
        throw new ErrorOnRegisterChecking()
    } finally{
        if(conn) { conn.release() }
    }
    
    return result
}

/**
 * 실제로 DB와 연결해 이미 사용중인 닉네임인지 체크하는 함수, UID가 일치하는 Row의 갯수 반환
 * @param {string} email 중복인지 체크하려는 ID
 * @returns {number} UID가 일치하는 DB 내부의 Row의 갯수
 */
 async function getRegisteredEMailCheck(email){
    let conn, result

    try{
        const queryString = `SELECT COUNT(UID) FROM Users WHERE EMail = '${email}'`
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        result = row[0]['COUNT(UID)']
    } catch(err){
        err.message += '-103'
        console.log(err.message)
        throw new ErrorOnRegisterChecking()
    } finally{
        if(conn) { conn.release() }
    }
    
    return result
}

/**
 * 평문 비밀번호 암호화 함수
 * @param {string} password 
 * @returns {string}
 */
function encryptPassword(password){
    return new Promise(function(resolve, reject){
        crypto.scrypt(password, process.env.SALT, 256, (err, key) => {
            if(err){
                err.message += '-104'
                reject(err)
            }
            else{
                resolve(key.toString('base64url'))
            }
        })
    })
}

/**
 * 메일 인증 체크용 ejs 파일
 * @param {string} authCode 
 * @returns {string} ejs 파일
 */
function ejsRender(authCode){
    return new Promise(function(resolve, reject){
        renderFile('./public/authPage.ejs', { authCode: authCode }, function(err, string){
            if(err){
                err.message += -105
                reject(err)
            }
            else{
                resolve(string)
            }
        })
    })
}
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
// Middle ware

/**
 * 회원가입 진행에 쓰일 파라미터들을 추출하는 미들웨어.
 * 명시한 파라미터들이 존재하는지, 올바른 타입으로 전송한 것이 맞는지 체크
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @returns {void}
 */
function extractSignupParameters(req, res, next){
    try{
        const { Account, Password, EMail, Nickname } = req.body

        if(typeof Account != 'string'){
            errorLog(req, controllerName, 'ID must be string')
            throw new ValuesIsMalformed()
        }

        if(typeof Password != 'string'){
            errorLog(req, controllerName, 'Password must be string')
            throw new ValuesIsMalformed()
        }

        if(typeof EMail != 'string'){
            errorLog(req, controllerName, 'EMail msust be string')
            throw new ValuesIsMalformed()
        }

        if(typeof Nickname != 'string'){
            errorLog(req, controllerName, 'Nickname must be string')
            throw new ValuesIsMalformed()
        }

        req.paramBox = {
            paramID: Account,
            password: Password,
            email: EMail,
            nickname: Nickname
        }

        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-1')
        if(err instanceof ValuesIsMalformed){
            res.json({ code: 1010, message: '올바르지 않은 형태의 데이터가 전송되었습니다' })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다' })
        }

        return
    }
}

/**
 * 지정된 글자 수 이내인지, 제한된 양식은 잘 지켰는지, 올바른 이메일인지 등등
 * 
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function checkCorrectData(req, res, next){
    const { paramID, password, email, nickname } = req.paramBox

    try{
        if(paramID.length > 20){
            res.json({ code: 2120, message: '아이디는 16글자 이내여야 합니다' })
            return
        }

        if(password.length > 20){
            res.json({ code: 2121, message: '비밀번호는 20글자 이내여야 합니다' })
            return
        }

        if(email.length > 45){
            res.json({ code: 2122, message: '이메일은 45글자 이내여야 합니다' })
            return
        }

        if(nickname.length > 20){
            res.json({ code: 2123, message: '닉네임은 20글자 이내여야 합니다' })
            return
        }

        const IDRegex = /^[a-zA-Z]+[0-9]+/g
        if(IDRegex.test(paramID) == false){
            res.json({ code: 2124, message: '아이디에는 영문자와 숫자만 사용가능 합니다' })
            return
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]+)(?=.*[!@#$%^&*()\-_=+{}\[\]:;<>,.?/\\\|~₩'])[a-zA-Z0-9!@#$%^&*()\-_=+{}\[\]:;<>,.?/\\\|~₩']+/g
        if(passwordRegex.test(password) == false){
            res.json({ code: 2125, message: '비밀번호에는 대문자, 숫자, 특수문자가 모두 하나 이상 포함되어야 합니다' })
            return
        }

        const emailRegex = /\w+@(\w+[.]?)+[.]ac[.]kr/g
        if(emailRegex.test(email) == false){
            res.json({ code: 2126, message: '이메일이 ac.kr로 끝나는 형식의 올바른 이메일이 아닙니다'})
            return
        }

        next()
    } catch(err) {
        errorLog(req, controllerName, err.message += '-2')
        res.json({ code: 2130, message: '값을 검증하는 중 오류가 발생하였습니다' })
    }
}

/**
 * ID 중복 체크용 미들웨어
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @returns {void}
 */
async function checkRegisteredAccountMiddle(req, res, next){
    const { paramID } = req.paramBox

    try{
        const isRegistered = await getRegisteredAccountCheck(paramID)

        if(isRegistered != 0){
            throw new RegisterdUser()
        }
        else{
            next()
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-3')
        if(err instanceof RegisterdUser){
            res.json({ code: 1011, message: '이미 사용중인 ID 입니다' })
        }
        else if(err instanceof ErrorOnRegisterChecking){
            res.json({ code: 1019, message: '회원가입 여부 조회중 오류가 발생하였습니다' })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다'})
        }

        return
    }
}

/**
 * 닉네임 중복 체크용 미들웨어
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function checkRegisteredNicknameMiddle(req, res, next){
    const { nickname } = req.paramBox

    try{
        const isRegistered = await getRegisteredNicknameCheck(nickname)

        if(isRegistered != 0){
            throw new RegisterdNickname()
        }
        else{
            next()
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-4')
        if(err instanceof RegisterdNickname){
            res.json({ code: 1012, message: '이미 사용중인 닉네임 입니다' })
        }
        else if(err instanceof ErrorOnRegisterChecking){
            res.json({ code: 1019, message: '회원가입 여부 조회중 오류가 발생했습니다' })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다' })
        }

        return
    }
}

/**
 * 닉네임 중복 체크용 미들웨어
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function checkRegisteredEMailMiddle(req, res, next){
    const { email } = req.paramBox

    try{
        const isRegistered = await getRegisteredEMailCheck(email)

        if(isRegistered != 0){
            throw new RegisterdEMail()
        }
        else{
            next()
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-5')
        if(err instanceof RegisterdEMail){
            res.json({ code: 1013, message: '이미 사용중인 이메일 입니다' })
        }
        else if(err instanceof ErrorOnRegisterChecking){
            res.json({ code: 1019, message: '회원가입 여부 조회중 오류가 발생했습니다' })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다' })
        }

        return
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractEmail(req, res, next){
    const { EMail } = req.body

    try{
        if(typeof EMail != 'string') { throw new ValuesIsMalformed() }

        if(EMail.length > 45){
            res.json({ code: 2122, message: '이메일은 45글자 이내여야 합니다' })
            return
        }

        const emailRegex = /\w+@(\w+[.]?)+[.]ac[.]kr/g
        if(emailRegex.test(EMail) == false){
            res.json({ code: 2126, message: '이메일이 ac.kr로 끝나는 형식의 올바른 이메일이 아닙니다'})
            return
        }

        req.paramBox = {
            EMail: EMail
        }

        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message + '-6')
        if(err instanceof ValuesIsMalformed){
            res.json({ code: 1010, message: '올바르지 않은 형태의 데이터가 전송되었습니다' })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다' })
        }
    }
}
/////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////
// Controller
/**
 * 별개로 제공하는 ID 중복 체크 API
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function checkRegisteredAccount(req, res){
    const { paramID } = req.paramBox

    try{
        const isRegistered = await getRegisteredAccountCheck(paramID)

        if(isRegistered != 0){
            throw new RegisterdUser()
        }
        else{
            res.json({ code: 202, message: '사용할 수 있는 ID 입니다' })
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message += '=1')
        if(err instanceof RegisterdUser){
            res.json({ code: 1011, message: '이미 사용중인 ID 입니다' })
        }
        else if(err instanceof ErrorOnRegisterChecking){
            res.json({ code: 1019, message: '회원가입 여부 조회중 오류가 발생하였습니다' })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다'})
        }
    }
}

/**
 * 회원가입을 진행하는 API 컨트롤러
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function processRegister(req, res){
    const { paramID: Account, password: Password, email, nickname } = req.paramBox
    const encryptedPassword = await encryptPassword(Password)

    let conn
    try{
        const queryString = 
        `INSERT INTO Users(Account, Password, EMail, Nickname) VALUES('${Account}', '${encryptedPassword}', '${email}', '${nickname}')`

        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        await conn.query(queryString)
        await conn.commit()

        res.json({ code: 204, message: '회원가입에 성공하였습니다' })
        normalLog(req, controllerName, `사용자 ${Account} 회원가입 성공`)
    }
    catch(err){
        errorLog(req, controllerName, err.message += '=2')
        res.json({ code: 1021, message: '회원가입 도중 오류가 발생하였습니다' })
    }
    finally{
        if(conn) { conn.release() }
    }
}

async function emailAuthController(req, res){
    const { EMail } = req.paramBox
}
/////////////////////////////////////////////////////////////////////

export default signup

///// Error controll class
class ValuesIsMalformed extends Error{ constructor(){ super('올바르지 않은 데이터 형식이 전송됨') } }
class RegisterdUser extends Error{ constructor(){ super('이미 회원가입이 완료된 유저') } }
class RegisterdNickname extends Error{ constructor(){ super('이미 사용중인 닉네임') } }
class RegisterdEMail extends Error{ constructor(){ super('이미 사용중인 이메일') } }
class ErrorOnRegisterChecking extends Error{ constructor(){ super('중복유저 확인을 위해 DB와 통신 중 오류 발생') } }