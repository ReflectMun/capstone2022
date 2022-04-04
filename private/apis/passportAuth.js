import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as LocalStrategy } from 'passport-local'
import passport from 'passport'
import './env.js'

export default function passportConfig(){
    passport.use(
        'login',
        new LocalStrategy(async function(account, password, done){
            account
        })
    )
    
    passport.use(
        'createToken', 
        new JWTStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        }, async function(payload, done){
            done(null, payload['account'])
        })
    )
}