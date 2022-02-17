//const serverURL = 'http://ec2-52-207-214-20.compute-1.amazonaws.com:14450'
const serverURL = 'http://localhost:14450'

window.onload = function(){
    const loginButton = document.getElementById('loginButton')
    
    loginButton.onclick = async function(){
        const ID = document.getElementById('IDTextBox').value
        const Password = document.getElementById('PasswordTextBox').value
    
        const result = await connect2LoginAPI(ID, Password)
    
        if(result['code'] == 200){
            alert(result['message'])
        }
        else{
            const text = `로그인 실패\n\n메시지: ${result['message']}\n코드: ${result['code']}`
            alert(text)
        }
    }
    
    function connect2LoginAPI(ID, Password){
        const reqBody = {
            ID: ID,
            password: Password
        }

        return new Promise((resolve, reject) => {
            fetch(serverURL + '/api/login', {
                method: 'post',
                body: JSON.stringify(reqBody),
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(data => {
                if(data.code == 200){
                    if(data.body['COUNT(UID)'] == 1){
                        resolve({ code: 200, message: '로그인 성공'})
                    }
                    else{
                        resolve({ code: 305, message: 'ID 혹은 비밀번호가 틀림' })
                    }
                }
                else{
                    resolve({ code: 404, message: data.err.message })
                }
            })
            .catch(err => {
                resolve({ code: 999, message: '서버 연결 실패'})
            })
        })
    }
}