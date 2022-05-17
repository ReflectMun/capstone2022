const c1_arr= new Array('국어국문학전공','한국어교육전공','독일유럽학과','중국어중국학과','일본어일본학과','러시아중앙아시아학과','스페인어중남미학과','사학과','기독교학과','철학과','문예창작학과');
const c2_arr= new Array('교육학과','한문교육학과','유아교육과','영어교육과','국어교육과');
const c3_arr= new Array('경영학과전공','관광경영학과전공','회계학전공','세무학전공','경영정보학전공','경엉빅데이터전공');
const c4_arr= new Array('경제금융학전공','국제통상학전공','행정학전공','정치외교학전공','언론영상학전공','광고홍보학전공','사회학과','심리학과','문헌정보학과','사회복지학과','법학과','경찰행정학과');
const c5_arr= new Array('수학전공','통계학전공','화학전공','생명과학전공','공중보건학전공','식품가공학전공','식품영양학전공','환경과학전공','지구환경학전공');
const c6_arr= new Array('약학과','제약학과');
const c7_arr= new Array('토목공학전공','건축학전공','건축공학전공','전자공학전공','전기에너지공학전공','컴퓨터공학전공','게임모바일공학전공','디지펜게임공학전공','교통공학전공','도시계획학전공','생태조경학전공','기계공학전공','자동차시스템공학전공','로봇공학전공','화학공학전공','신소재공학전공','산업공학과');
const c8_arr= new Array('의예과','의학과','의용공학과');
const c9_arr= new Array('간호학과');
const c10_arr= new Array('관현악전공','성악전공','작곡전공','피아노전공','연극뮤지컬전공','무용전공','뮤직프로덕션전공');
const c11_arr= new Array('체육학전공','사회체육학전공','태권도학과','스포츠마케팅학과');
const c12_arr= new Array('회화전공','공예디자인전공','산업디자인전공','패션디자인전공','텍스타일디자인전공','패션마케팅학전공','사진미디어전공','영상애니메이션전공','시각디자인전공');


let c_string = ""; 

function aaaaa(){
    for(let i =0; i<c_string.length; i++){
        const li = document.createElement('li');
        //span.setAttribute('class','menu-link');
       // span.setAttribute('class','menu-link');

        const textNode = document.createTextNode(c_string[i]);
        li.appendChild(textNode);

        const a = document.createElement('a');
       // li.setAttribute('id','menu_component');
        //li.setAttribute('class','toggle accordion-toggle');

        a.appendChild(li);
        document.getElementById('menu').appendChild(a);        
    }
}

window.addEventListener('load',()=>{
    const college_Name = document.getElementById('college').innerText;
    switch(college_Name){
        case '인문국제대학':
            c_string = c1_arr;
            break;
         case '사범대학':
            c_string = c2_arr;
            break;
        case '경영대학':
            c_string = c3_arr;
            break;
        case '사회과학대학':
            c_string = c4_arr;
            break;
        case '자연과학대학':
            c_string = c5_arr;
            break;
        case '약학대학':
            c_string = c6_arr;
            break;
        case '공과대학':
            c_string = c7_arr;
            break;
        case '의과대학':
            c_string = c8_arr;
            break;
        case '간호대학':
            c_string = c9_arr;
            break;
        case '음악공연예술대학':
            c_string = c10_arr;
            break;
        case '체육대학':
            c_string = c11_arr;
            break;
        case '미술대학':
            c_string = c12_arr;
            break;
            }
    aaaaa();      
})

// function readExcel() {

//     let input = event.target;
//     let reader = new FileReader();
//     reader.onload = function () {
//         let data = reader.result;
//         let workBook = XLSX.read(data, { type: 'binary' });
//         workBook.SheetNames.forEach(function (sheetName) {
//             console.log('SheetName: ' + sheetName);
//             let rows = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
//             console.log(JSON.stringify(rows));
//         })
//     };
//     reader.readAsBinaryString(input.files[0]);
// }
