const serverURL = 'http://ec2-15-164-170-224.ap-northeast-2.compute.amazonaws.com:14450'
//const serverURL = 'http://localhost:14450'

window.onload = function(){
    const uploadSummitButton = document.getElementById('uploadButton')
    
    uploadSummitButton.onclick = async function (){
        const filesForUpload = document.getElementById('fileUploader').files
        console.log(filesForUpload)

        const result = await connect2FileUploadAPI(filesForUpload)
    }

    function connect2FileUploadAPI(files){
        return new Promise((resolve, reject) => {
            const fileSendForm = new FormData()
            fileSendForm.enctype = 'multipart/form-data';

            for(const file of files){
                fileSendForm.append('file', file)
            }

            fetch(serverURL + '/test/putS3', {
                method: 'post',
                body: fileSendForm,
            })
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                console.log('에러 발생')
                console.log(err)
            })
        })
    }
}