import { Router } from 'express'
import { readFile } from 'fs'
import Pool from '../../private/server/DBConnector.js'
import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'
import {putObjectToS3} from '../../private/server/S3Connector.js'
AWS.config.loadFromPath('./private/credential/s3.json')

const upload = Router()
const s3 = new AWS.S3()
const upload_func = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'saviorimg',
        // acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, file.originalname)
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});

upload.get('/', uploadform)
function uploadform(req, res) {
    readFile('./public/html/upload/upload.html', { encoding: 'utf-8' }, (err, data) => {
        if (err) { res.send('404 Not Found') }
        else {
            res.writeHead(200, {
                'Content-Type': 'text/html; encoding=utf-8'
            })
            res.write(data)
            res.end()
        }
    })
}

upload.get('/saviorcontent', (req, res) => {
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

upload.get('/saviorimg', (req, res) => {
    readFile('./public/html/upload/Imgtest.html', { encoding: 'utf-8' }, (err, data) => {
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

upload.post('/putText',async (req,res)=>{
    const {boarduri,title,author,date,content} = req.body
    let conn=null
    try {
        putObjectToS3('saviorcontent',title+'.txt',content,'text/plain')
        conn = await Pool.getConnection(conn => conn)
        await conn.beginTransaction()
        const queryString1 = `SELECT UID from Users WHERE Account='${author}'` // db 에서 authorUID 가져옴
        const [row] = await conn.query(queryString1)
        if(row[0]){
            const uid=row[0]['UID']
            const queryString2 = `INSERT INTO Posts(BoardURI,Title,Author,AuthorUID,Date) VALUES('${boarduri}','${title}','${author}','${uid}','${date}')`
            await conn.query(queryString2)
            await conn.commit()
            res.status(200)
        }else{
            console.log("no user found")
            res.status(500)
        }
    }
    catch (err) {
        console.log(err) 
        res.status(500)
    }
    finally {
        if (conn) { conn.release() } 
        res.sendStatus(res.statusCode)  
    }
    
})

//DB추가
upload.post('/putImg', upload_func.single('files'), PutImg)

async function PutImg (req, res) {
    const {originalname} = req.file

    const url=`https://saviorimg.s3.ap-northeast-2.amazonaws.com/${originalname}`
    res.json(url)
}

upload.get('/getS3/:filename', function (req, res, next) {
    let { filename } = req.params;
    try {
        console.log(filename)
        let fileToSend = s3.getObject({ Bucket: "capstonestorage", Key: filename }).createReadStream()
        fileToSend.pipe(res)
    } catch (error) {
        res.send({ error: "server error" })
    }
})

export default upload
