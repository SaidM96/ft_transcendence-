import axios from "axios";
import { useRouter } from "next/router";
import Profile from "./Profile";
import Router from "next/router";
import { MyContext } from "@/components/Context";
import { useContext } from "react";
const router = Router;
async function fetchdata(token :string | string[] | undefined){
    const context = useContext(MyContext);
    console.log("the token", token);
    console.log("debug")
    try{
        const res = await axios.get('http://localhost:5000/user/me', {headers:{
            Authorization : `Bearer ${token}`
        }})
        const response = await res.data;
        context?.setName(response.username);
        context?.setImg(response.avatar);
        const userResponse = await axios.post(
            'http://localhost:5000/user/friends',
            { login: 'aer-raou' },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        console.log(userResponse.data)
        router.push('http://localhost:3000/Dashbord');
    }catch(e){
        console.log(e)}
}


export default function Profileid(){
    const router = useRouter();
    const id = router.query.id ?? null;
    if (id)
    var res = fetchdata(id);
}


// {
//     UserId: '65eabf7b-3176-4ac5-a594-8856f68db353',
//     login: 'smia',
//     username: 'said lbatal',
//     email: 'smia@student.1337.ma',
//     avatar: '0',
//     enableTwoFa: true,
//     twoFactorSecret: null,
//     bioGra: ''
//   }
