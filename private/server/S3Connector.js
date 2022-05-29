import AWS from 'aws-sdk'

AWS.config.loadFromPath('./private/credential/s3.json')
const S3 = new AWS.S3()

/**
 * AWS S3 버킷에서 파일 객체를 꺼내와 알맹이 데이터만 꺼내주는 함수.
 * 에러 발생시 에러 객체를 throw 하므로 try 블록 등으로 감쌀 필요 있음.
 * 에러 내용은 에러 객체의 message 프로퍼티에 담겨있으니 console.log 등으로
 * 확인하면 됨
 * 
 * @param {string} bucket - 연결할 S3 버킷 이름 
 * @param {string} objectName - 버킷에서 꺼내올 파일의 이름
 * @return {Promise<AWS.S3.GetObjectOutput.Body>} S3로부터 fetch한 컨텐츠
 */
export function getObjectFromS3(bucket, objectName){
    return new Promise(function(resolve, reject){
        S3.getObject({
            Bucket: bucket,
            Key: objectName
        }, function(err, data){
            if(err){
                reject(new ErrorOnS3Fetching(err))
            }
            else{
                resolve(data.Body)
            }
        })
    })
}

/**
 * AWS S3 버킷에 파일 객체를 집어넣는 함수. objectName 파라미터에 들어간 이름이 그대로 버킷에 저장 될 파일의 이름이 되니 주의.
 * 에러 발생시 에러 객체를 throw 하므로 try 블록으로 감쌀 필요 있음
 * 
 * @param {string} bucket - 연결할 S3 버킷 이름
 * @param {string} objectName - 버킷에 담길 파일 객체의 이름
 * @param {string} file - 버킷에 담길 파일의 데이터
 * @return {Promise<AWS.S3.PutObjectOutput>}
 */
export function putObjectToS3(bucket, objectName, file){
    return new Promise(function(resolve, reject){
        S3.putObject({
            Bucket: bucket,
            Key: objectName,
            Body: file,
            ContentType: 'text/html'
        }, function(err, data){
            if(err){
                err.message += '-S3'
                reject(new ErrorOnS3Inserting(err))
            }
            else{
                resolve(data)
            }
        })
    }) 
}

export class ErrorOnS3Fetching extends Error{ constructor(err){ super(err.message) } }
export class ErrorOnS3Inserting extends Error{ constructor(err){ super(err.message) } }