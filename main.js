import express from 'express'

const app = express()
const port = 14450

import login from './router/login.js'

app.use('/login', login)

app.get('/', (req, res) => {
    const response = {
        code: 200,
        body: 'Hello, World!'
    }
    
    res.json(response)
})

app.listen(port, () => {
    console.log('Server start')
})