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
    extractData,
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
    const { sourcePost } = req.query

    try{
        if(typeof sourcePost != 'string') { throw new Error('게시글 값이 전송되지 않음') }

        req.paramBox['sourcePost'] = sourcePost
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-1')
        res.json({ code: 4302, message: '게시글 정보가 전송되지 않았습니다' })
    }
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractData(req, res, next){
    const { postNum, test } = req.body

    try{

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
    const { sourcePost } = req.paramBox
    let conn = null

    try{
        const queryString =
        `SELECT CommentID, Author, Nickname, Comment, Date, Time FROM Comments  WHERE SourcePost = ${sourcePost}`
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ row, fields ] = await conn.query(queryString)
        await conn.commit()

        res.json({ code: 270, comments: row})
        normalLog(req, controllerName, `게시글 ${sourcePost}의 댓글 전송완료`)
    }
    catch(err){
    }
    finally{
        if(conn) {
            conn.commit()
            conn.release()
        }
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
    }
    catch(err){
        console.log(err)
    }
    finally{
        if(conn) { conn.release() }
    }

}
////////////////////////////////////////////////////////////

export default Comment