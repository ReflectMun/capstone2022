import { Router } from 'express'

const logout = Router()

logout.get('/', requestLogLogoutService, processLogout)

function requestLogLogoutService(req, res, next){
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : ${req.ip} : 로그아웃 요청`)
    next()
}

function processLogout(req, res, next){
    if(req.session.user){
        const LoggedOutID = req.session.ID
        req.session.destroy((err) => {
            if(err) { 
                console.log('삭제시 에러 일으킴')
                return
            }
            console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : ${req.ip} : ${LoggedOutID} 로그아웃 함`)

            res.json({ code: 2001, message: '로그아웃 완료' })
        })
    }
    else{
        console.log(
        `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : ${req.ip} : 로그인 되어있지 않은 유저`
        )

        res.json({ code: 2003, message: '로그인 되어있지 않은 유저' })
    }
}

export default logout