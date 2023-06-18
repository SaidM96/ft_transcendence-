import { faBars, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FiSend } from "react-icons/fi";
import avatar from '../image/avatar.webp'
import Image from "next/image";
import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { MyContext } from "./Context";
// import { Reciever, Sender } from "./ChatHistory";
import { ModalUpdateChannel } from "./Modal";
import { Contrail_One } from "next/font/google";
import History from "./HIstory";
import Router from "next/router";
import { useRouter } from "next/router";
import axios from "axios";

interface recvProps{
  msg : string;
  time : string;
  avatar : string;
  name : string;
}

function GetAvatar ({avatar } : {avatar : string}) {
  if (avatar === '0')
    return (
      <Image src={avatar} alt="ava" />
    );
  else
      return (
        <img src={avatar} alt="ava"/>
      );

}

const Reciever = (props : recvProps) =>{
  return (
    <div className="chat chat-start">
    <div className="chat-image avatar">
      <div className="w-10 rounded-full">
        <GetAvatar avatar={props.avatar} />
      </div>
    </div>
    <div className="chat-header ">
      {props.name}
      <time className="text-xs opacity-50 pl-1">
                  {/* {props.time.slice(11,5)}  */} 12.00 
        </time>
    </div>
    <div className="chat-bubble">{props.msg}</div>
    
  </div>
  );
}

const Sender = (props : recvProps) =>{
  return (
    <div className="chat chat-end">
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
        <GetAvatar avatar={props.avatar} />
        </div>
      </div>
      <div className="chat-header">
      {props.name}
        <time className="text-xs opacity-50 pl-1">
          {/* {props.time.slice(11,5)}  */} 12.00
          </time>
      </div>
      <div className="chat-bubble">{props.msg}</div>
     
    </div>
  );

}


// file when store img
// const [file, setFile] = useState<File | null>(null)




// to change avatar of channel
const click = () => {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const form = new FormData();
      form.append('file', file);
      console.log('upload');
      axios
        .post('https://api.cloudinary.com/v1_1/daczu80rh/upload', form)
        .then((result) => {
          console.log(result.data.secure_url);
        });
    }
  });

  // Hide the file input element
  fileInput.style.display = 'none';

  // Append the file input element to the document
  document.body.appendChild(fileInput);

  // Programmatically trigger the file selection dialog
  fileInput.click();
};


export interface msgChannel{
  MsgChannelId: string;
  avatar : string;
  channelId: string;
  channelName : string;
  content : string;
  login : string;
  sendAt : string;
  username: string;
}


/// to add members to channel
const AddMember = () =>{
    console.log("add members");
    return(
        <div className="dropdown dropdown-bottom dropdown-end">
            <FontAwesomeIcon tabIndex={0} icon={faUserPlus}  className="text-slate-600 w-7 h-6 cursor-pointer hover:text-blue-900" /> 
        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><button className="flex">
                <Image className="w-10 h-10 rounded-full border-4 border-green-600" src={avatar} alt="df" />
                <p>mohamed haddaoui</p>
                </button></li>
                <li><button className="flex">
                <Image className="w-10 h-10 rounded-full border-4 border-red-600" src={avatar} alt="df" />
                <p>mohamed haddaoui</p>
                </button></li>
                <li><button className="flex">
                <Image className="w-10 h-10 rounded-full border-4 border-green-600" src={avatar} alt="df" />
                <p>mohamed haddaoui</p>
                </button></li>
        </ul>
        </div>
    );

}


interface TypeModal{
  isOpenModal : boolean;
  CloseModal : () => void; 
}


// udate channle or delete it
const clickInfo = () =>{}
const ChannelHistor = ({history, id} : {history : msgChannel[], id : string}) =>{
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
    const openMd = () =>{
      setOpenModal(true);
    }
    const closeMd = () =>{
      setOpenModal(false);
    }
  const [msg, setMsg]= useState<msgChannel[]>(history);
  const context = useContext(MyContext);
  const [inputValue, setInputValue] = useState('');
  
  const [isOpenModal, setIsopenModal] = useState(false);

    useEffect(() =>{
      if (context?.socket){
        context?.socket.on('message', (pay) =>{
          if (pay)
            console.log(pay);
        })
        context.socket.on('errorMessage' , (pay) =>{
          if (pay)
            console.log(pay);
        })
      }
    },[context?.socket])

    const removeChannelByName = (channelName: string) => {
      context?.setChannels(prevChannels =>
        prevChannels.filter(channel => channel.channelName !== channelName)
      );
    };
    

  const leaveChannel = () =>{
    context?.socket?.emit('leaveChannel', {
      channelName : context.channelInfo?.channelName,
    })
    if (context?.channelInfo)
    removeChannelByName(context?.channelInfo?.channelName);
    console.log(context?.Channels)
    router.reload();

  }

  // for check when use delete  or leave channel 
  const [valueCheck, setValueCheck] = useState(false);
  //delete Channel
  const deleteChannel = () =>{
    context?.socket?.emit('deleteChannel', {
      channelName : context.channelInfo?.channelName
    })
    if (context?.channelInfo)
    removeChannelByName(context?.channelInfo?.channelName)
    router.reload();
    // router.push(useRouter.pathname());

  }
  
  //info
  const Info = () =>{

      return (
          <div className="dropdown dropdown-bottom dropdown-end">
              <FontAwesomeIcon tabIndex={0} className="w-7 h-6 text-slate-700 hover:text-blue-900 cursor-pointer" onClick={clickInfo} icon={faBars} flip />
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><button onClick={openMd}>Update Channel</button></li>
              <li><button>Members Channel</button></li>
              <li><button onClick={leaveChannel}>Leave Channel</button></li>
              <li><button onClick={deleteChannel}>Delete Channel</button></li>
          </ul>
          </div>
      );
  }
    const CloseModal = () =>{
        setIsopenModal(false);
    }
    const OpenModal = () =>{
        setIsopenModal(true);
    }

    //send message channel

    const send= () =>{
      if (inputValue != ''){
        context?.socket?.emit('msgChannel', {
          channelName: context.channelInfo?.channelName, 
          content : inputValue,
        })
        setInputValue('');
      }
    }
    useEffect(() => {
      if (context?.socket) {
        context.socket.on(`${context.channelInfo?.channelName}`, (payload: any) => {
          if (payload) {
            setMsg((prevMsgs) => [...prevMsgs, payload]);
          }
        });
      }
    
      return () => {
        if (context?.socket) {
          context.socket.off(`${context.channelInfo?.channelName}`);
        }
      };
    }, [context?.socket]);
    
    //  handle submit 

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>{
      event.preventDefault();
      send();
    }

    // handle any changes events
    const handleInputChange = (e : React.ChangeEvent<HTMLInputElement>) =>{
      setInputValue(e.target.value);
      console.log(inputValue);

    }
    

    return (
        
       <div className={`${valueCheck === true ? 'hidden' : 'flex'}flex-col h-full overflow-y-auto relative scrollbar scrollbar-thumb-green-400 scrollbar-w-1
        scrollbar-track-slate-100 scrollbar- gap-1 bg-gray-300 rounded-2xl `}>
        {
          openModal && <ModalUpdateChannel isOpen={openModal} closeModal={closeMd}/>
        }
      <div className={`w-full h-[7%]  flex chat chat-start  border-b-2 border-slate-500 items-center justify-between px-4  `}>
        <div>
        <div >
            
            <Image  className="w-12 h-12 rounded-full border-4 border-slate-400 cursor-pointer hover:border-slate-900" onClick={click}  src={avatar} alt="avatar" />
        </div>

        </div>
        <div className="flex items-center gap-10" >
        <AddMember />   
        <Info />
        </div>
       
      </div>
      <div className="w-full h-[93%] flex flex-col p-2 " >
      {msg.map((msg : msgChannel) =>{
        if (msg.login === context?.login)
          return <Sender msg={msg.content} time={msg.sendAt} avatar={msg.avatar} name={context.name} />
        else
          return <Reciever msg={msg.content} time={msg.sendAt} avatar={msg.avatar} name="mohamed haddaoui" />
      })}
      

  
        <div className={`mt-auto pb-1 pl-1 `}>
          <form 
          onSubmit={handleSubmit}
          >
            <div className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-grow p-2 rounded-lg mr-2 bg-bginp w-2 sm:w-full h-full focus:outline-none focus:border-2 focus:border-slate-500"
              />
              <button onClick={send} type="submit" ><FiSend className="text-white w-5 h-5 mr-2" /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
    );
}


export default ChannelHistor;