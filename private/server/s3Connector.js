import AWS from 'aws-sdk'

export function getS3Object(parameter){
    const S3 = new AWS.S3({
        accessKeyId: 'AKIAY6X2UAVITBIQ7V4B',
        secretAccessKey: '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',
        region: 'us-east-1'
    })

    return new Promise((resolve, reject) => {
        
    })
}

export function putS3Object(parameter){
    const S3 = new AWS.S3({
        accessKeyId: 'AKIAY6X2UAVITBIQ7V4B',
        secretAccessKey: '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',
        region: 'us-east-1'
    })
}