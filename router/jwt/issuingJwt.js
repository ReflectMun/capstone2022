import jwt from 'jsonwebtoken'
import { Router } from 'express'

const issuingJwt = Router()
const { sign } = jwt

issuingJwt.get('/', function(req, res){
    const token = sign()
})

export default issuingJwt