import { Router } from 'express'

const signin = Router()

signin.post('/', (req, res) => {
    const ID = req.body['ID']
    const password = req.body['password']
    const nickName = req.body['nickName']
    const eMail = req.body['eMail']

    const IDLen = ID
})

export default signin