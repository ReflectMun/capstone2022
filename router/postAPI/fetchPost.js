import { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'
import { getObjectFromS3 } from '../../private/server/S3Connector.js'
import { jwtVerify } from '../../private/apis/verifyJWT.js'

const fetchPost = Router()

fetchPost.get(
    '/fetch/content',
    jwtVerify,
    checkExistingBoard,
    checkExistingPost,
    ContentViewerController
)

fetchPost.get(
    '/fetch/postlist',
    jwtVerify,
    extractPageNum,
    checkExistingBoard,
    LoadPostListController
)

/////////////////////////////////////////////////////////
// Just Functions
function getResponseObject(){
    const obj = {
        code: null,
        message: null
    }

    return obj
}

function getPostHTMLContent(boardURI, postNum){
    const objectKey = `/${boardURI}/${postNum}`
    const content = getObjectFromS3('contentHTML', objectKey)
    return content
}

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
        connection = await Pool.createConnection(connection => connection)

        await connection.beginTransaction()
        const [ data, fields ] = await connection.query(queryString)
        await connection.commit()

        return data
    }
    catch(err){
        console.log(`Error : checkExistingBoard : ${err.message}`)
        throw new Error('게시글 목록을 불러오는 중 오류가 발생함')
    }
    finally{
        if(connection) { connection.release() }
    }
}
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// Middle ware
function extractPageNum(req, res, next){
    const { pageNum } = req.body
    if(!pageNum){
        console.log('Error : extractPage : pageNum not defined')
        res.json({ code: 9973, message: '올바르지 않은 데이터 형식' })
    }
    else{
        req.paramBox = { pageNum: pageNum }
        next()
    }
}

async function checkExistingBoard(req, res, next){
    let conn
    try{
        const queryString = `SELECT COUNT(BoardsID) FROM Boards WHERE BoardName = '${req.params['board']}'`
        conn = Pool.createConnection(conn => conn)

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        const duplicate = row[0]['COUNT(BoardsID)']
        if(duplicate == 0){
            const responseObject = getResponseObject()
            responseObject.code = 3317
            responseObject.message = '존재하지 않는 게시판입니다'
            res.json(responseObject)
        }
        else if(duplicate > 1){
            throw new Error()
        }
        else{
            next()
        }
    }
    catch(err){
        console.log(`Error : checkExistingBoard : ${err.message}`)

        const responseObject = getResponseObject()
        responseObject.code = 3304
        responseObject.message = '게시판 조회중 오류가 발생하였습니다'

        res.json(responseObject)
    }
    finally{
        if(conn) { conn.release() }
    }
}

async function checkExistingPost(req, res, next){
    let conn
    try{
        const queryString = `SELECT COUNT(PostID), isDeleted FROM Posts WHERE PostID = ${req.params['postNum']}`
        conn = Pool.createConnection(conn => conn)
        
        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        const exist = row[0]['COUNT(PostID)']
        if(exist == 0){
            const responseObject = getResponseObject()
            responseObject.code = 3318
            responseObject.message = '존재하지 않거나 삭제된 게시물입니다'
            res.json(responseObject)
        }
        else if(exist > 1){
            throw new Error()
        }
        else{
            next()
        }
    }
    catch(err){
        console.log(`Error : checkoExistingPost : ${err.message}`)

        const responseObj = getResponseObject()

        responseObj.code = 3305
        responseObj.message = '게시물 조회중 오류가 발생하였습니다'

        res.json(responseObj)
    }
    finally{
        if(conn) { conn.release() }
    }
}
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// Controller
function ContentViewerController(req, res, next){
    try{
        const contentText = getPostHTMLContent(req.params['board'], req.params['postNum'])
        res.json({ code: 100, content: contentText })
    }
    catch(err){
        console.log(`Error : ContentViewerController : ${err.message}`)
        res.json({ code: 723, content: '원인을 알 수 없는 에러가 발생하였습니다' })
    }
}

function LoadPostListController(req, res, next){
    try{
        const postList = getPostList(req.params)
    }
    catch(err){
        console.log(err.message)
    }
}
/////////////////////////////////////////////////////////

export default fetchPost