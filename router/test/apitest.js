import { Router } from 'express'

const apitest = Router()

apitest.get('/', function(req, res){
    res.redirect('/red')
})

export default apitest