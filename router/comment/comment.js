import express, { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'
import { normalLog, errorLog } from '../../private/apis/logger.js'
import { jwtVerify } from '../../private/apis/verifyJWT.js'

const Comment = Router()
const controllerName = 'Comment'

Comment.get(
    '/fetch',
    extractPostNum,
    getComment
)

Comment.put(
    '/put', 
    jwtVerify,
    extractValue,
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
    const { postNum } = req.query

    try{
        if(!postNum) { throw new EmptyPostNum('게시글 값이 전송되지 않음') }

        req.paramBox = {
            sourcePost: postNum
        }

        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-1')
        res.json({ code: 4302, message: '게시글 정보가 전송되지 않았습니다' })
    }
}
 //

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function extractValue(req, res, next){
    const { postNum, text } = req.body

    try{
        if(typeof postNum != 'string') { throw new EmptyPostNum('게시글 값이 전송되지 않음') }
        if(typeof text != 'string') { throw new EmptyComment('댓글내용이 비어있음') }

        req.paramBox['text'] = text
        req.paramBox['postNum'] = postNum
        next()
    }
    catch(err){
        errorLog(req, controllerName, err.message += '-2')
        if(err instanceof EmptyPostNum){
            res.json({ code: 4302, message: '게시글 정보가 전송되지 않았습니다' })
        }
        else if(err instanceof EmptyComment){
            res.json({ code: 4303, message: '빈 댓글은 등록할 수 없습니다' })
        }
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
        if(conn) { await conn.commit() }
        res.json({ code: 9102, message: '댓글을 불러오는 도중 오류가 발생했습니다' })
    }
    finally{
        if(conn) { conn.release() }
    }

}

async function postComment(req, res) {
    const { Account: Author, Nickname, postNum: sourcePost, text } = req.paramBox
    let conn

    try{
        const queryString =
        `INSERT INTO Comments(SourcePost, Author, Nickname, Comment, Date, Time)
        VALUES('${sourcePost}', '${Author}', '${Nickname}', '${text}',NOW(),NOW())` 
                                                                                                        
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        await conn.query(queryString)
        await conn.commit()

        res.json({ code: 271, message: '댓글작성 완료' })
        normalLog(req, controllerName, `${Author}가 ${sourcePost}게시물에 댓글 작성 완료`)
    }
    catch(err){
        if(conn) { await conn.rollback() }
        res.json({ code: 9102, message: '댓글을 작성하는 도중 오류가 발생했습니다' })
    }
    finally{
        if(conn) { conn.release() }
    }

}
////////////////////////////////////////////////////////////

export default Comment

class EmptyPostNum extends Error{ constructor(){ super('게시글 정보가 손상되거나 전송되지 않음') } }
class EmptyComment extends Error{ constructor(){ super('댓글 정보가 손상되거나 전송되지 않음') } }