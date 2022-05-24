import { Router } from 'express'

////////////////////////////////////
// API Router
import login from './login/login.js'
import signin from './signin/signin.js'
import uploadAPI from './upload/uploadRouter.js'
import logout from './logout/logout.js'
import comment from './comment/comment.js'
import fetchPost from './postAPI/fetchPost.js'
import issuingJwt from './jwt/issuingJwt.js'
import messageRouter from './message/messageRouter.js'

import apitest from './test/apitest.js'
////////////////////////////////////

const api = Router()

api.use('/login', login) // 로그인 처리 API 컨트롤러
api.use('/comment',comment)  // 댓글 처리 API 컨트롤러
api.use('/signin', signin) // 회원가입 처리 API 컨트롤러
api.use('/logout', logout) // 로그아웃 처리 API 컨트롤러
api.use('/upload', uploadAPI) // 파일 업로드 API 컨트롤러
api.use('/post', fetchPost) // 게시글 내용 불러오기 API 컨트롤러
api.use('/jwtissue', issuingJwt) // 사용자 인증 JWT 발급
api.use('/message', messageRouter)

api.use('/test', apitest)

export default api