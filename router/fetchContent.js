import { Router } from 'express'
import Pool from '../private/server/DBConnector.js'
import { getObjectFromS3 } from '../private/server/S3Connector.js'

const fetchContent = Router()

fetchContent.get(
    '/:board/:postNum',
    checkExistingBoard,
    checkExistingPost,
    ContentViewerController
)

fetchContent.get(
    '/:board',
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
/////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////
// Middle ware
function checkExistingBoard(req, res, next){
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
        console.log(`Error - message: ${err.message}`)

        const responseObject = getResponseObject()
        responseObject.code = 3304
        responseObject.message = '게시판 조회중 오류가 발생하였습니다'

        res.json(responseObject)
    }
    finally{
        if(conn) { conn.release() }
    }
}

function checkExistingPost(req, res, next){
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
        console.log(`Error - message: ${err.message}`)

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
    const contentText = getPostHTMLContent(req.params['board'], req.params['postNum'])
    let d
}

function LoadPostListController(req, res, next){
    const postList = []
}
/////////////////////////////////////////////////////////

export default fetchContent