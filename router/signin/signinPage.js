import { Router } from 'express'
import { readFile } from 'fs'

const signinPage = Router()

signinPage.get('/', (req, res) => {
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

export default signinPage