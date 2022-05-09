import express, { Router } from 'express'
import { errorLog, normalLog } from '../../private/apis/logger.js'
import Pool from '../../private/server/DBConnector.js'

const signin = Router()
const controllerName = 'signin'

/////////////////////////////////////////////////////////////////////
// Router
signin.post(
    '/',
    getSigninParameters,
    checkRegisteredMiddle,
    processRegister
)

signin.post(
    '/check_registered',
    getSigninParameters,
    checkRegistered
)

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
function getSigninParameters(req, res, next){
    try{
        const { ID, Password, email, nickname } = req.body

        if(typeof ID != 'string'){
            errorLog(req, controllerName, 'ID must be string')
            throw new ValuesIsMalformed()
        }

        if(typeof Password != 'string'){
            errorLog(req, controllerName, 'Password must be string')
            throw new ValuesIsMalformed()
        }

        if(typeof email != 'string'){
            errorLog(req, controllerName, 'EMail msust be string')
            throw new ValuesIsMalformed()
        }

        if(typeof nickname != 'string'){
            errorLog(req, controllerName, 'Nickname must be string')
            throw new ValuesIsMalformed()
        }

        req.paramBox = {
            paramID: ID,
            password: Password,
            email: email,
            nickname: nickname
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        if(err instanceof ValuesIsMalformed){
            res.json({ code: 1010, message: '올바르지 않은 형태의 데이터가 전송되었습니다' })
        }
        else{
            res.json({ code: 9999, message: '알 수 없는 오류가 발생하였습니다' })
        }

        return
    }

    next()
}

/**
 * ID 중복 체크용 미들웨어
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 * @returns {void}
 */
async function checkRegisteredMiddle(req, res, next){
    const { paramID } = req.paramBox

    try{
        const isRegistered = await getRegisteredCheck(paramID)

        if(isRegistered != 0){
            throw new RegisterdUser()
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message)
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

    next()
}

/**
 * 실제로 DB와 연결해 이미 사용중인 ID인지 체크하는 함수, UID가 일치하는 Row의 갯수 반환
 * @param {string} paramID 중복인지 체크하려는 ID
 * @returns {number} UID가 일치하는 DB 내부의 Row의 갯수
 */
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
    } catch(err){
        throw new ErrorOnRegisterChecking(err.message)
    } finally{
        if(conn) { conn.release() }
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

    } catch(err) {
        errorLog(req, controllerName, err.message)
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
async function checkRegistered(req, res){
    const { paramID } = req.paramBox

    try{
        const isRegistered = await getRegisteredCheck(paramID)

        if(isRegistered != 0){
            throw new RegisterdUser()
        }
        else{
            res.json({ code: 202, message: '사용할 수 있는 ID 입니다' })
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message)
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

    let conn
    try{
        const queryString = 
        `INSERT INTO Users(Account, Password, EMail, Nickname) VALUES('${Account}', '${Password}', '${email}', '${nickname}')`

        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        await conn.query(queryString)
        await conn.commit()

        res.json({ code: 401, message: '회원가입에 성공하였습니다' })
        normalLog(req, controllerNamem, `사용자 ${Account} 회원가입 성공`)
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        res.json({ code: 1021, message: '회원가입 도중 오류가 발생하였습니다' })
    }
    finally{
        if(conn) { conn.release() }
    }
}

/////////////////////////////////////////////////////////////////////

export default signin

///// Error controll class
class ValuesIsMalformed extends Error{ constructor(){ super('올바르지 않은 데이터 형식이 전송됨') } }
class RegisterdUser extends Error{ constructor(){ super('이미 회원가입이 완료된 유저') } }
class ErrorOnRegisterChecking extends Error{ constructor(err){ super(err.message) } }