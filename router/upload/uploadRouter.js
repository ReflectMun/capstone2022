import { Router } from 'express'

const uploadAPI = Router ()

import imageUpload from './imageUpload.js'
import contentUpload from './contentUpload.js'
import answerUploader from './answerUpload.js'

uploadAPI.use('/image', imageUpload)
uploadAPI.use('/content', contentUpload)
uploadAPI.use('/answer', answerUploader)

export default uploadAPI