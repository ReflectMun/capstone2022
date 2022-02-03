import { Router } from 'express'
import { readFile } from 'fs'

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
    const ID = req.body['ID']
    const password = req.body['password']
    const nickName = req.body['nickName']
    const eMail = req.body['eMail']

    const IDLen = ID
})

export default signin