import { Router } from 'express'
import Pool from '../private/server/DBConnector/js'

const fetchContent = Router()

fetchContent.get('/:board/:postNum')

/////////////////////////////////////////////////////////
// Middle ware
function extractQueryString(req, res, next){
    const { board, postNum } = req.params

    req.paramBox = {
        boardName: board,
        postNum: postNum
    }

    next()
}

function checkBoard(req, res, next){
    const queryString = `SELECT COUNT(BoardsID) FROM Boards WHERE BoardName = '${req.paramBox.boardName}'`
    let a
}
/////////////////////////////////////////////////////////

export default fetchContent