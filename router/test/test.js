import { Router } from 'express'

const test = Router()

test.get('/', (req, res) => {
    res.send('Hello, Test!')
})

export default test