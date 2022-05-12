import { Router } from 'express'
import { readFile } from 'fs'
import Pool from '../../private/server/DBConnector.js'

import multer from 'multer'
import multerS3 from 'multer-s3'
import AWS from 'aws-sdk'

AWS.config.loadFromPath('./private/credential/s3.json')

const upload = Router()
const s3 = new AWS.S3()
const upload_func = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'capstonestorage',
        // acl: 'public-read',
        key: function (req, file, cb) {
            console.log(file.originalname)
            cb(null, file.originalname)
        }
    }),
    limits: {
        fileSize: 1000 * 1000 * 10
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
upload.get('/Textest', (req, res) => {
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
upload.get('/Imgtest', (req, res) => {
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
//DB추가
upload.post('/putImg',upload_func.array('img',25),PutImg)
async function PutImg (req, res) {
    let conn=null
    const {boarduri,title,author,time,date,content} = req.body
    const filenums = req.files.length   // 파일 갯수 구함
    try {
        conn = await Pool.getConnection(conn => conn)
        await conn.beginTransaction()
        const queryString1 = `SELECT UID from Users WHERE Account='${author}'` // db 에서 authorUID 가져옴
        const [row, fields] = await conn.query(queryString1)
        
        const uid=row[0]['UID']
        const queryString2 = `INSERT INTO Posts(BoardURI,Title,Author,AuthorUID,Time,Date,ContentTexts,NumberOfFiles) VALUES('${boarduri}','${title}','${author}','${uid}','${time}','${date}','${content}',${filenums})`
        await conn.query(queryString2)

        await conn.commit()
    }
    catch (err) {
        console.log(err) 
        res.sendStatus(500)
    }
    finally {
        if (conn) { conn.release() } 
        res.sendStatus(200)
    }
}
upload.post('/putS3', upload_func.single('img'), (req, res) => {
    console.log('여기까지 넘어오긴 하나')
    let imgFile = req.file
})

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