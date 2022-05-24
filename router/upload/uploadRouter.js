import { Router } from 'express'

const uploadAPI = Router ()

import imageUpload from './imageUpload.js'
import contentUpload from './contentUpload.js'

uploadAPI.use('/image', imageUpload)
uploadAPI.use('/content', contentUpload)

export default uploadAPI