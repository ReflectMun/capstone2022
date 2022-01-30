import { Router } from 'express'
import { readFile } from 'fs'

const loginPage = Router()

loginPage.get('/', (req, res) => {
    readFile('public/html/loginPage.html', (err, data) => {
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