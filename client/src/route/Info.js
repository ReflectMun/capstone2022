import { useEffect, useState } from "react";
import ShowInfo from '../components/ShowInfo.js';

function Info(){
    // const [loading,setLoading] = useState(true);
    // const [infos,setInfos]=useState([]);
    // const getInfos = async()=>{
    //     const json = await (
    //         await (await fetch (
    //             "주소")
    //         )
    //     ).json();
    //         setInfos(json.뭐시기);
    //         setLoading(false);
    // };
    // useEffect(()=>{
    //     getInfos()
    // },[]);
    return(
        // <div>
        //     {loading? (
        //         <h1>로딩중</h1>
        //     ):(
        //         <div>
        //         {infos.map((info)=>(
        //             <ShowInfo
        //             key={info.id}
        //             id={info.id}
        //             question={info.question}
        //             answer={info.answer}
        //             />
        //         ))}
        //         </div>
        //     )
        // }
        // </div>

        <div>
            <ShowInfo />
        </div>
        //console.log("a")
    );
}
export default Info;
