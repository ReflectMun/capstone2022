const serverURL = 'http://ec2-52-207-214-20.compute-1.amazonaws.com:14450'
//const serverURL = 'http://localhost:14450'

// vanilla ajax 사용해서 서버와 통신
window.onload = function(){
    const summitButton = document.getElementById('signinSummit')

    summitButton.onclick = async function(){
        const ID = document.getElementById('IDInput').value
        const Password = document.getElementById('PasswordInput').value
        const PasswordCheck = document.getElementById('PasswordCheck').value

        const text = `${ID} ${Password} ${PasswordCheck}`
        alert(text)
    }
}