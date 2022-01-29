import { Router } from 'express'

const signin = Router()

signin.get('/', (req, res) => {
    const ID = req.body['ID']
    const password = req.body['password']
    const nickName = req.body['nickName']
    const eMail = req.body['eMail']

    
})

export default signin