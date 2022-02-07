import AWS from 'aws-sdk'

export function getS3Object(parameter){
    const S3 = new AWS.S3({
        accessKeyId: 'AKIAY6X2UAVIUFOCEBEJ',
        secretAccessKey: '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',
        region: 'us-east-1'
    })

    return new Promise((resolve, reject) => {
        
    })
}

export function putS3Object(parameter){
    const S3 = new AWS.S3({
        accessKeyId: 'AKIAY6X2UAVIUFOCEBEJ',
        secretAccessKey: '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',
        region: 'us-east-1'
    })
}