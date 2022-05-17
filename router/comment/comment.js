import { Router } from 'express'
import Pool from '../../private/server/DBConnector.js'

const Comment = Router()

Comment
    .get('/', getComment)   // /api/comment 에 GET 요청 시
    .post('/', postComment) // /api/comment 에 POST 요청 시

async function getComment(req, res) {
    let conn = null

    const response = {
        code: null,
        body: null,
        err: null
    }

    try{
        const queryString = `SELECT * FROM Comments`  // Comment 테이블의 Idx, Nickname, Comment, CommentTime 을 조회한 뒤, 모든 데이터를 json 으로 리턴함
        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [row] = await conn.query(queryString)
        await conn.commit()

        response.code = 200
        response.body = row
    }
    catch(err){
        console.log(err)
        response.code = 404
        response.err = {message:'댓글 테이블 조회중 에러 발생'}
    }
    finally{
        if(conn) { conn.release() }

        res.json(response)
    }

}

async function postComment(req, res) {
    let conn = null
    let nickname
    let comment

    const response = {
        code: null,
        body: null,
        err: null
    }
    try {
        nickname = req.body['nickname']
        comment = req.body['comment']
    }
    catch(err){
        console.log(err)

        response.code = 404
        response.err = { message: '올바르지 않은 데이터 형식' }

        return res.json(response)
    }
    
    try{
        const queryString = `INSERT INTO Comments(Nickname,Comment) VALUES('${nickname}','${comment}')` // Comments 테이블에 Nickname, Comment 를 추가한다.
                                                                                                        // Idx, CommentTime 컬럼은 mysql 에서 자동으로 추가된다.
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
export default Comment