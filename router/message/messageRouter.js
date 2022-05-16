import { Router } from 'express'

const messageRouter = Router()

import fetchSendedMessage from './fetchMessage.js'
messageRouter.use('/fetch', fetchSendedMessage)
messageRouter.use('/send')

export default messageRouter