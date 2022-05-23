import { Router } from 'express'
import { readFile } from 'fs'
import Pool from '../private/server/DBConnector.js'
import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'
import {putObjectToS3} from '../private/server/s3Connector.js'
AWS.config.loadFromPath('./private/credential/s3.json')

const content = Router()        // export 할 라우터 객체 선언
const s3 = new AWS.S3()         // AWS 객체 선언
const content_func = multer({   // multer upload 함수 설정
    storage: multerS3({
        s3: s3,
        bucket: 'saviorcontent',
        
        key: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    limits: {
        fileSize: 1000 * 1000 * 10
    }
});


// content.get('/', uploadform)
// function uploadform(req, res) {
//     readFile('./public/html/upload/Texttest.html', { encoding: 'utf-8' }, (err, data) => {
//         if (err) { res.send('404 Not Found') }
//         else {
//             res.writeHead(200, {
//                 'Content-Type': 'text/html; encoding=utf-8'
//             })
//             res.write(data)
//             res.end()
//         }
//     })
// }
content.get('/saviorcontent', (req, res) => {           // Texttest.html 렌더링
    readFile('./public/html/upload/Texttest.html', { encoding: 'utf-8' }, (err, data) => {
        if (err) { res.send('404 Not Found') }
        else {
            res.writeHead(200, {
                'Content-Type': 'text/html; encoding=utf-8'
            })
            res.write(data)
            res.end()
        }
    })
})

content.post('/putText',async (req,res)=>{                     // 글 업로드하는 함수
    const {boarduri,title,author,date,content} = req.body       
    let conn=null
    try {
        putObjectToS3('saviorcontent',title+'.txt',content,'text/plain') // content 를 aws s3 에 title + .txt 파일로 저장
        conn = await Pool.getConnection(conn => conn)
        await conn.beginTransaction()
        const queryString1 = `SELECT UID from Users WHERE Account='${author}'` // db 에서 authorUID 가져옴
        const [row] = await conn.query(queryString1)
        if(row[0]){
            const uid=row[0]['UID'] 
            const queryString2 = `INSERT INTO Posts(BoardURI,Title,Author,AuthorUID) VALUES('${boarduri}','${title}','${author}','${uid}')` // Posts 테이블에 boarduri,title,author,authorUID 저장
            await conn.query(queryString2)
            await conn.commit()
            res.status(200)
        }else{
            console.log("no user found") // author 이 Users 테이블에 없을 경우 에러코드 500 반환
            res.status(500)
        }
    }
    catch (err) {    // aws s3 upload 실패 or Posts 테이블에 데이터 저장 실패
        console.log(err) 
        res.status(500)
    }
    finally {
        if (conn) { conn.release() } // db connection 끊기
        res.sendStatus(res.statusCode)  
    }
    
})


content.get('/getS3/:filename', function (req, res, next) {     // filename 을 param 으로 가져온 뒤, s3 bucket 에서 해당 파일을 가져옴
    let { filename } = req.params;
    try {
        console.log(filename)
        let fileToSend = s3.getObject({ Bucket: "capstonestorage", Key: filename }).createReadStream()
        fileToSend.pipe(res)
    } catch (error) {
        res.send({ error: "server error" })
    }
})

export default content