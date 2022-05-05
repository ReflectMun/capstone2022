import jwt from 'jsonwebtoken'
const { verify } = jwt

export function jwtVerify(req, res, next){
    const token = req.headers.token
    try{
        verify(token, process.env.JWT_SECRET)
        next()
    }
    catch(err){
        console.log('')
        res.json({ code: 908, error: '손상되거나 유효하지 않은 JWT토큰' })
    }
}

export function jwtVerifyForSignin(req, res, next){
    const token = req.headers.token
    try{
        verify(token, process.env.JWT_SECRET)
        res.json({ code: 222, error: 'Sign in existed' })
    }
    catch(err){
        next()
    }
}