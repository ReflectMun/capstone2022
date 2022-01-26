import { Router } from 'express'
import { createPool } from 'mysql2/promise'

const login = Router()

login.get('/', (req, res) => {
    res.send('로그인 화면')
})

export default login