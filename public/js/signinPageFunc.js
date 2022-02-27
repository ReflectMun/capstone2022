// const serverURL = 'http://ec2-15-164-170-224.ap-northeast-2.compute.amazonaws.com:14450'
const serverURL = 'http://localhost:14450'

// vanilla ajax 사용해서 서버와 통신
window.onload = function(){
    const summitButton = document.getElementById('signinSummit')

    summitButton.onclick = async function(){
        const ID = document.getElementById('IDInput').value
        const Password = document.getElementById('PasswordInput').value
        const PasswordCheck = document.getElementById('PasswordCheck').value
        const eMail = document.getElementById('EMail').value

        if(ID.length == 0){
            alert('ID를 입력해주세요')
            return
        }
        if(Password.length == 0){
            alert('비밀번호를 입력해주세요')
            return
        }
        if(PasswordCheck.length == 0){
            alert('비밀번호 확인을 입력해주세요')
            return
        }
        if(eMail.length == 0){
            alert('메일주소를 입력해주세요')
            return
        }

        if(Password != PasswordCheck){
            alert('비밀번호와 비밀번호 확인이 일치하지 않습니다')
            return
        }

        const result = await sendSignin(ID, Password, eMail)

        console.log(result)
        
        if(result.code == 207){
            alert('회원가입 성공')
        }
        else{
            alert(`회원가입 실패\n\n메시지: ${result.message}\n코드: ${result.code}`)
        }
    }
}

async function sendSignin(ID, Password, eMail){
    const reqBody = {
        ID: ID,
        Password: Password,
        email: eMail
    }

    return new Promise((resolve, reject) => {
        fetch(serverURL + '/signin', {
            method: 'post',
            body: JSON.stringify(reqBody),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            const responseCode = data.code
            
            if(responseCode == 207){
                resolve({ code: responseCode, message: data.body.message })
            }
            else if(responseCode == 705){
                resolve({ code: responseCode, message: data.body.message })
            }
            else{
                resolve({ code: responseCode, message: data.err.message })
            }
        })
        .catch(err => {
            resolve({ code: 1099, message: err.message} )
        })
    })
}