import { Router } from 'express'
import { readFile } from 'fs'

const loginPage = Router()

loginPage.get('/', (req, res) => {
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : ${req.ip} : 로그인 페이지 접속`)

    readFile('public/html/loginPage.html', { encoding: 'utf-8' }, (err, data) => {
        if(err) { res.send('NotFound') }
        else{
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })
            .write(data)
            res.end()
        }
    })
})

export default loginPage