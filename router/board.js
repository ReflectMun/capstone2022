import { Router } from 'express'
import { errorLog, normalLog } from '../private/apis/logger.js'
import Pool from '../private/server/DBConnector.js'

const boardList = Router()
const controllerName = 'fetchBoardList'

boardList.get('/fetch/list', async function(req, res){
    let conn

    try{
        const queryString = `SELECT BoardName, BoardURI, GroupIN FROM BoardLists`

        conn = await Pool.getConnection(conn => conn)

        await conn.beginTransaction()
        const [ list, fields ] = await conn.query(queryString)
        await conn.commit()

        res.json({
            code: 209,
            lists: list
        })
        normalLog(req, controllerName, '게시판 리스트 전달 완료')
    }
    catch(err){
        errorLog(req, controllerName, err.message)
        res.json({ code: 9807, message: '게시판 리스트를 불러오던 중 오류가 발생했습니다' })
    }
    finally{
        if(conn) { conn.release() }
    }
})

export default boardList