import express from 'express'

const app = express()
const port = 14450

app.listen(port, () => {
    console.log('Server start')
})