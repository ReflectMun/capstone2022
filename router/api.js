import { Router } from 'express'

////////////////////////////////////
// API Router
import login from './login/login.js'
import signup from './signup/signup.js'
import uploadAPI from './upload/uploadRouter.js'
import logout from './logout/logout.js'
import comment from './comment/comment.js'
import fetchPost from './postAPI/fetchPost.js'
import issuingJwt from './jwt/issuingJwt.js'
import messageRouter from './message/messageRouter.js'
import boardList from './board.js'
import fetchPoint from './point.js'

import apitest from './test/apitest.js'
////////////////////////////////////

const api = Router()

api.use('/login', login) // 로그인 처리 API 컨트롤러
api.use('/comment',comment)  // 댓글 처리 API 컨트롤러
api.use('/signup', signup) // 회원가입 처리 API 컨트롤러
api.use('/logout', logout) // 로그아웃 처리 API 컨트롤러
api.use('/upload', uploadAPI) // 이미지 및 게시글 업로드 API 컨트롤러
api.use('/post', fetchPost) // 게시글 내용 불러오기 API 컨트롤러
api.use('/jwtissue', issuingJwt) // 사용자 인증 JWT 발급
api.use('/message', messageRouter) // 쪽지 수발신 API 컨트롤러
api.use('/board', boardList) // 게시판 리스트 불러오기 API 컨트롤러
api.use('/point', fetchPoint) // 사용자 포인트 불러오기 API 컨트롤러

api.use('/test', apitest)

export default api