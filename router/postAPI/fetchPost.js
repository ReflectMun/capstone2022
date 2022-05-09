import express, { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'
import { ErrorOnS3Fetching, getObjectFromS3 } from '../../private/server/S3Connector.js'
import { jwtVerify } from '../../private/apis/verifyJWT.js'
import { errorLog } from '../../private/apis/logger.js'

const fetchPost = Router()
const controllerName = 'fetchPost'

fetchPost.get(
    '/fetch/content',
    jwtVerify,
    extractBoardName,
    extractPostNum,
    checkExistingBoard,
    checkExistingPost,
    ContentViewerController
)

fetchPost.get(
    '/fetch/postlist',
    jwtVerify,
    extractBoardName,
    extractPageNum,
    checkExistingBoard,
    LoadPostListController
)

/////////////////////////////////////////////////////////
// Just Functions
/**
 * 응답용 객체를 리턴해주는 함수
 * @returns {object} 응답용 객체. code, message, newToken 프로퍼티가 존재함
 */
function getResponseObject(){
    const obj = {
        code: null,
        message: null,
        newToken: null
    }

    return obj
}

/**
 * S3로부터 지정된 게시판, 지정된 번호에 해당하는 게시글의 HTML을 꺼내오는 함수
 * @param {string} boardURI 
 * @param {string} postNum 
 * @returns {object} HTML 컨텐츠
 */
function getPostHTMLContent(boardURI, postNum){
    const objectKey = `/${boardURI}/${postNum}`
    const content = getObjectFromS3('contentHTML', objectKey)

    if(!content){
        throw new EmptyContentFetched()
    }

    return content
}

/**
 * 게시판의 게시글 리스트를 불러와서 리턴하는 함수
 * @param {string} boardURI 게시판의 URI
 * @param {string} startNum 게시글의 시작 번호
 * @param {string} pagePerPost 
 * @returns {Array<object>} 게시글 리스트 배열 객체
 */
async function getPostList(boardURI, startNum, pagePerPost){
    let connection
    try{
        const queryString = 
            `SELECT PostID, Title, Author, Date, Time
            FROM(
                SELECT PostID, Title, Author, Date, Time
                FROM MainDB.Posts
                WHERE BoardURI = '${boardURI}' AND isDeleted = 0
                ORDER BY PostID DESC
            )
            LIMIT ${startNum}, ${pagePerPost}`
        connection = await Pool.getConnection(connection => connection)

        await connection.beginTransaction()
        const [ data, fields ] = await connection.query(queryString)
        await connection.commit()

        return data
    }
    catch(err){
        throw new Error('게시글 목록을 불러오는 중 오류가 발생함')
    }
    finally{
        if(connection) { connection.release() }
    }
}
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// Middle ware

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractBoardName(req, res, next){
    const resObj = getResponseObject()
    try{
        const { boardURI } = req.query

        if(typeof boardURI != 'string'){
            throw new BoardURIExtractFailed()
        }

        req.paramBox['board'] = boardURI

        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        if(err instanceof BoardURIExtractFailed){
            resObj.code = 9972
            resObj.message = '게시판 이름이 없습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else{
            resObj.code = 9999
            resObj.message = '알 수 없는 오류가 발생하였습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        res.json(resObj)
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractPostNum(req, res, next){
    const resObj = getResponseObject()
    try{
        const { postNum } = req.query

        if(typeof postNum != 'string'){
            throw new PostNumExtractFailed()
        }

        req.paramBox['postNum'] = postNum 

        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        if(err instanceof PostNumExtractFailed){
            resObj.code = 9972
            resObj.message = '게시판 이름이 없습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else{
            resObj.code = 9999
            resObj.message = '알 수 없는 오류가 발생하였습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        res.json(resObj)
    }
}
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractPageNum(req, res, next){
    const resObj = getResponseObject()
    try{
        const { pageNum } = req.query

        if(typeof pageNum != 'string'){
            throw new PageNumExtractFailed()
        }

        req.paramBox['pageNum'] = pageNum
        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        if(err instanceof PageNumExtractFailed){
            resObj.code = 9973
            resObj.message = '페이지 번호가 없습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else{
            resObj.code = 9999
            resObj.message = '알 수 없는 오류가 발생하였습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        res.json(resObj)
    }
}

async function checkExistingBoard(req, res, next){
    const resObj = getResponseObject()
    let conn

    try{
        const queryString = `SELECT COUNT(BoardsID) FROM Boards WHERE BoardName = '${req.paramBox['board']}'`
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        const duplicate = row[0]['COUNT(BoardsID)']
        if(duplicate == 0){
            throw new BoardNotExist()
        }
        else if(duplicate > 1){
            throw new UnknownDuplicateOnDataBase('board', req.paramBox['board'])
        }
        else{
            next()
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        if(err instanceof BoardNotExist){
            resObj.code = 3304
            resObj.message = '존재하지 않는 게시판 입니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else if(err instanceof UnknownDuplicateOnDataBase){
            resObj.code = 3306
            resObj.message = '알 수 없는 오류가 DB에서 발생하였습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else{
            resObj.code = 9999
            resObj.message = '알 수 없는 오류가 발생하였습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        res.json(resObj)
    }
    finally{
        if(conn) { conn.release() }
    }
}

async function checkExistingPost(req, res, next){
    const resObj = getResponseObject()
    let conn

    try{
        const queryString = `SELECT COUNT(PostID), isDeleted FROM Posts WHERE PostID = ${req.paramBox['postNum']}`
        conn = await Pool.getConnection(conn => conn)
        
        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        const exist = row[0]['COUNT(PostID)']
        if(exist == 0){
            throw new PostNotExist()
        }
        else if(exist > 1){
            throw new UnknownDuplicateOnDataBase('post', req.paramBox['postNum'])
        }
        else{
            next()
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        if(err instanceof PostNotExist){
            resObj.code = 3305
            resObj.message = '존재하지 않거나 삭제된 게시물 입니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else if(err instanceof UnknownDuplicateOnDataBase){
            resObj.code = 3306
            resObj.message = '원인 미상의 오류가 DB에서 발생하였습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else{
            resObj.code = 9999
            resObj.message = '원인을 알 수 없는 오류가 발생하였습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        
        res.json(resObj)
    }
    finally{
        if(conn) { conn.release() }
    }
}
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// Controller
function ContentViewerController(req, res, next){
    const resObj = getResponseObject()

    try{
        const contentText = getPostHTMLContent(req.paramBox['board'], req.paramBox['postNum'])
        res.json({ code: 100, content: contentText })
    }
    catch(err){
        console.log(`Error : ContentViewerController : ${err.message}`)
        if(err instanceof EmptyContentFetched){
            resObj.code = 4473
            resObj.message = '컨텐츠가 존재하지 않습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else if(err instanceof ErrorOnS3Fetching){
            resObj.code = 4507
            resObj.message = '컨텐츠를 꺼내 오는 도중 오류가 발생하였습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else{
            resObj.code = 9999
            resObj.message = '알 수 없는 오류가 발생하였습니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }

        res.json(resObj)
    }
}

function LoadPostListController(req, res, next){
    try{
        const postList = getPostList()
    }
    catch(err){
        console.log(err.message)
    }
}
/////////////////////////////////////////////////////////

export default fetchPost

class EmptyContentFetched extends Error{ constructor() { super('컨텐츠가 존재하지 않음') } }
class BoardURIExtractFailed extends Error{ constructor() { super('게시판 URI 추출 실패') } }
class PostNumExtractFailed extends Error{ constructor() { super('게시물 번호 추출 실패') } }
class PageNumExtractFailed extends Error{ constructor() { super('페이지 번호 추출 실패') } }
class BoardNotExist extends Error{ constructor() { super('존재하지 않는 게시판') } }
class UnknownDuplicateOnDataBase extends Error{
    constructor(kindof, item) { super(`원인을 알 수 없는 중복 데이터가 DB에 존재함 : ${kindof} ${item}`) }
}
class PostNotExist extends Error{ constructor() { super('존재하지 않는 게시물') } }