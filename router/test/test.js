import express, { Router } from 'express'
import { readFile } from 'fs'

const test = Router()

test.get(
    '/',
    sendCat
)

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function sendCat(req, res){
    readFile('public/html/test/cat.html', { encoding: 'utf-8' }, (err, data) => {
        if(err) { res.send('No Such File of Directory') }
        else { res.send(data) }
    })
}

/**
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function sendPenguin(req, res){
    readFile('public/html/test/penguin.html', { encoding: 'utf-8' }, (err, data) => {
        if(err) { res.send('No Such File of Directory') }
        else { res.send(data) }
    })
}

export default test