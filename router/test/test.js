import { Router } from 'express'
import { readFile } from 'fs'

const test = Router()

test.get('/', show)

function show(req, res, next){
    res.send('Hello, World!')
}

test.get('/param/:num', param)

function param(req, res, next){
    const { num: uid } = req.params
    console.log(req.params)

    const doc = 
    `
    <!DOCTYPE html>
    <html>
        <body>
            <h1>Your Parameters</h1>
            <h2>${uid}</h2>
        </body>
    </html>
    `

    res.send(doc)
}

export default test