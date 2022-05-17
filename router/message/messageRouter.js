import { Router } from 'express'

const messageRouter = Router()

import fetchMessage from './fetchMessage.js'
messageRouter.use('/fetch', fetchMessage)
// messageRouter.use('/send')

export default messageRouter