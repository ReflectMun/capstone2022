import express, { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'
import { ErrorOnS3Fetching, getObjectFromS3 } from '../../private/server/S3Connector.js'
import { jwtVerify } from '../../private/apis/verifyJWT.js'
import { errorLog, normalLog } from '../../private/apis/logger.js'

const fetchPost = Router()
const controllerName = 'fetchPost'
const NoFileErrorMessage = 'NoFile'

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
    extractPostType,
    checkExistingBoard,
    LoadPostListController
)

fetchPost.get(
    '/fetch/answer',
    jwtVerify,
    extractPostNum,
    checkExistingPost,
    FetchAnswerListController
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
 * @param {string} contentKeyName S3에서 게시글 파일을 찾기 위한 키
 * @returns {AWS.S3.GetObjectOutput.Body} HTML 컨텐츠
 */
async function fetchPostHTMLContent(contentKeyName){
    const content = await getObjectFromS3('saviorcontent', contentKeyName)

    if(!content){
        throw new EmptyContentFetched()
    }

    return content
}

/**
 * 게시판의 게시글 리스트를 불러와서 리턴하는 함수
 * @param {string} boardURI 게시판의 URI
 * @param {string} startNum 게시글의 시작 번호
 * @returns {Array<object>} 게시글 리스트 배열 객체
 */
async function fetchPostList(boardURI, startNum, Type){
    return new Promise(async function(resolve, reject){
        let connection
        try{
            const queryString = 
            `SELECT PostID, Title, Author, AuthorNickname, Date, Time, Type
            FROM(
                SELECT PostID, Title, Author, AuthorNickname, Date, Time, Type
                FROM MainDB.Posts
                WHERE BoardURI = '${boardURI}' AND isDeleted = 0 AND Type = ${Type}
                ORDER BY PostID DESC
            ) AS View
            LIMIT ${startNum}, 15`
            
            connection = await Pool.getConnection(connection => connection)
            
            await connection.beginTransaction()
            const [ data, fields ] = await connection.query(queryString)
            await connection.commit()
            
            connection.release()
            resolve(data)
        }
        catch(err){
            err.message += '-101'
            if(connection) { connection.release() }
            reject(err)
        }
    }) 
}

/**
 * 답변글 목록을 리스트 형태로 반환하는 함수
 * @param {string} postNum 소스 질문글의 글 번호
 * @returns {Array<object>} 답변글 목록
 */
async function fetchAnswerList(postNum){
    return new Promise(async function(resolve, reject){
        let conn

        try{
            const queryString =
            `SELECT PostID, Author, AuthorUID, AuthorNickname, Date, Time, FileName
            FROM Posts WHERE isDeleted = 0 AND Type = 3 AND SourceQuestion = ${postNum}`

            conn = await Pool.getConnection()

            await conn.beginTransaction()
            const [ collection, fields ] = await conn.query(queryString)
            await conn.commit()

            const list = []

            for(const row of collection){
                const { FileName } = row
                const file = await getObjectFromS3('saviorcontent', FileName)

                const obj = {
                    PostID: row['PostID'],
                    Author: row['Author'],
                    AuthorUID: row['AuthorUID'],
                    Nickname: row['AuthorNickname'],
                    Date: row['Date'],
                    Time: row['Time'],
                    content: file
                }

                list.push(obj)
            }

            conn.release()
            resolve(list)
        }
        catch(err){
            err.message += '-102'
            if(conn) { conn.release() }
            reject(err)
        }
    })
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
        errorLog(req, controllerName, err.message += '-1')
        if(err instanceof BoardURIExtractFailed){
            resObj.code = 9972
            resObj.message = '게시판 이름이 손상되거나 누락되었습니다'
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

        req.paramBox['postNum'] = parseInt(postNum, 10)

        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-2')
        if(err instanceof PostNumExtractFailed){
            resObj.code = 9653
            resObj.message = '게시글 번호가 손상되거나 누락되었습니다'
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
        errorLog(req, controllerName, err.message += '-3')
        if(err instanceof PageNumExtractFailed){
            resObj.code = 9973
            resObj.message = '페이지 번호가 없거나 손상되었습니다'
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
 function extractPostType(req, res, next){
    const resObj = getResponseObject()
    try{
        const { Type } = req.query

        if(typeof type != 'string'){
            throw new PostTypeExtractFailed()
        }

        req.paramBox['type'] = type
        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-4')
        if(err instanceof PostTypeExtractFailed){
            resObj.code = 9974
            resObj.message = '게시글 타입이 손상되거나 없습니다'
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
async function checkExistingBoard(req, res, next){
    const resObj = getResponseObject()
    const { board } = req.paramBox
    let conn

    try{
        const queryString = `SELECT COUNT(BoardID) FROM BoardLists WHERE BoardName = '${board}'`
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
        errorLog(req, controllerName, err.message += '-5')
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

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
async function checkExistingPost(req, res, next){
    const resObj = getResponseObject()
    const { board, postNum } = req.paramBox
    let conn

    try{
        const queryString = `SELECT isDeleted FROM Posts WHERE BoardURI = '${board}' AND PostID = ${postNum}`
        conn = await Pool.getConnection(conn => conn)
        
        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        if(row.length == 0){
            throw new PostNotExist()
        }
        else if(row.length > 1){
            throw new UnknownDuplicateOnDataBase('post', req.paramBox['postNum'])
        }

        const isDeleted = row[0]['isDeleted']
        if(isDeleted){
            throw new DeletedPost()
        }
        else{
            next()
        }
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-6')
        if(err instanceof PostNotExist){
            resObj.code = 3305
            resObj.message = '존재하지 않는 게시물 입니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else if(err instanceof DeletedPost){
            resObj.code = 3306
            resObj.message = '삭제된 게시물 입니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else if(err instanceof UnknownDuplicateOnDataBase){
            resObj.code = 3307
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

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function ContentViewerController(req, res){
    const resObj = getResponseObject()
    const { postNum } = req.paramBox
    let conn

    try{
        const queryString =
        `SELECT PostID, Title, Author, AuthorUID, AuthorNickname, Date, Time, FileName, Type
        FROM Posts WHERE PostID = ${postNum} AND isDeleted = 0`
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ data, fields ] = await conn.query(queryString)
        await conn.commit()

        const objectFileName = data[0]['FileName']
        if(objectFileName == NoFileErrorMessage){
            throw new PostFileNotExist()
        }

        const contentText = await fetchPostHTMLContent(objectFileName)

        res.json({
            code: 210,
            PostID: data[0]['PostID'],
            Title: data[0]['Title'],
            Author: data[0]['Author'],
            AuthorUID: data[0]['AuthorUID'],
            Nickname: data[0]['AuthorNickname'],
            Date: data[0]['Date'],
            Time: data[0]['Time'],
            Type: data[0]['Type'],
            content: contentText,
            newToken: req.tokenBox['totken']
        })
        normalLog(req, controllerName, `${req.paramBox['Account']}에게 게시글 ${req.paramBox['postNum']} 전송 완료`)
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-7')
        if(err instanceof PostFileNotExist){
            resObj.code = 4470
            resObj.message = '손상되어 불러올 수 없는 게시물 입니다'
            if(req.tokenBox['token']){
                resObj.newToken = req.tokenBox['token']
            }
        }
        else if(err instanceof EmptyContentFetched){
            resObj.code = 4473
            resObj.message = '볼 수 없는 게시글 입니다'
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

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function LoadPostListController(req, res){
    const { pageNum, board, type } = req.paramBox
    try{
        const startNum = 15 * pageNum
        const postList = await fetchPostList(board, startNum, type)
        res.json({ code: 210, postlist: postList, newToken: req.tokenBox['token'] })
        normalLog(req, controllerName, `에게 게시판 ${board}의 게시글 목록 전송완료`)
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-8')
        res.json({ code: 8334, message: '게시글 리스트를 불러오는 도중 오류가 발생하였습니다' })
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function FetchAnswerListController(req, res){
    const { postNum } = req.paramBox
    try{
        const list = await fetchAnswerList(postNum)
        res.json({ code: 212, answerlist: list, newToken: req.tokenBox['token'] })
        normalLog(req, controllerName, `에게 질문글 ${postNum}의 답변글 목록 전송완료`)
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-9')
        res.json({ code: 8335, message: '답변글 목록을 불러오는 도중 오류가 발생하였습니다', newToken: req.tokenBox['token'] })
    }
}
/////////////////////////////////////////////////////////

export default fetchPost

class EmptyContentFetched extends Error{ constructor() { super('컨텐츠가 존재하지 않음') } }
class BoardURIExtractFailed extends Error{ constructor() { super('게시판 URI 추출 실패') } }
class PostNumExtractFailed extends Error{ constructor() { super('게시물 번호 추출 실패') } }
class PageNumExtractFailed extends Error{ constructor() { super('페이지 번호 추출 실패') } }
class PostTypeExtractFailed extends Error{ constructor() { super('게시글 타입 추출 실패') } }
class BoardNotExist extends Error{ constructor() { super('존재하지 않는 게시판') } }
class UnknownDuplicateOnDataBase extends Error{
    constructor(kindof, item) { super(`원인을 알 수 없는 중복 데이터가 DB에 존재함 : ${kindof} ${item}`) }
}
class PostNotExist extends Error{ constructor() { super('존재하지 않는 게시물') } }
class DeletedPost extends Error{ constructor() { super('삭제된 게시물 입니다') } }
class PostFileNotExist extends Error{ constructor() { super('게시글 파일이 존재하지 않음') } }