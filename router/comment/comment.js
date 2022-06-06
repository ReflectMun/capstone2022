import express, { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'
import { normalLog, errorLog } from '../../private/apis/logger.js'

const Comment = Router()
const controllerName = 'Comment'

Comment.get(
    '/fetch',
    extractPostNum,
    getComment
)

Comment.put(
    '/put', 
    postComment
)

////////////////////////////////////////////////////////////
// Middle Ware
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractPostNum(req, res, next){
    const { PostNum } = req.query

    try{
        if(typeof PostNum != 'string') { throw new Error('게시글 값이 전송되지 않음') }
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-1')
        res.json({ code: 4302, message: '게시글 정보가 전송되지 않았습니다' })
    }
}
////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
// Controller
/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
async function getComment(req, res) {
    const { SourcePost } = req.paramBox
    let conn = null

    try{
        const queryString =
        `SELECT CommentID, Author, Nickname, Comment, Date, Time FROM Comments  WHERE SourcePost = ${SourcePost}`
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [row] = await conn.query(queryString)
        await conn.commit()

        response.code = 200
        response.body = row
    }
    catch(err){
    }
    finally{
        if(conn) { conn.release() }
    }

}

async function postComment(req, res) {
    let conn

    try{
        const queryString = `INSERT INTO Comments(Nickname,Comment,Date,Time) VALUES('${nickname}','${comment}',NOW(),NOW())` 
                                                                                                        
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        await conn.query(queryString)
        await conn.commit()


        response.code = 200
        response.body = "success"
    }
    catch(err){
        console.log(err)
        response.code = 404
        response.err = {message:'댓글 테이블 데이터 삽입중 에러 발생'}
    }
    finally{
        if(conn) { conn.release() }

        res.json(response)
    }

}
////////////////////////////////////////////////////////////

export default Comment