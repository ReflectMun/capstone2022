import { Router } from 'express'

const messageRouter = Router()

import fetchMessage from './fetchMessage.js'
import sendMessage from './sendMessage.js'

messageRouter.use('/fetch', fetchMessage)
messageRouter.use('/send', sendMessage)

export default messageRouter