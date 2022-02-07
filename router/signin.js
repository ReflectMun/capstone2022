import { Router } from 'express'
import { readFile } from 'fs'
import Pool from '../public/js/server/DBConnector.js'

const signin = Router()

signin.get('/', (req, res) => {
    readFile('public/html/signinPage.html', { encoding: 'utf-8' }, (err, data) => {
        if(err) { res.send('Not Found') }
        else{
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })
            .write(data)
            res.end()
        }
    })
})

signin.post('/', (req, res) => {
    const response = {
        code: null,
        body: null,
        err: null
    }

    let ID
    let password
    let passwordCheck

    try{
        ID = req.body['ID']
        password = req.body['password']
        passwordCheck = req.body['passwordCheck']
    }
    catch(err){
        console.log(err.message)

        response.code = 703
        response.err = { message: '올바르지 않은 데이터 형식입니다' }
        res.json(response)

        return
    }
})

export default signin // tlqkf 이걸 main 브랜치에서 작업하고 있었네;;;