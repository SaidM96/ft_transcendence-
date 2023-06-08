import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import React, { useEffect, useState } from "react";
const { log } = console;
import { matterJsModules } from "../utils/matterTools"

const inter = Inter({ subsets: ['latin'] })

export default function Game() {
  const [joinRoom, setJoinRoom] = useState<string>("hidden")
  const [roomName, setRoomName] = useState<string>("")
  const [height, setHeight] = useState<string>("75vh")
  const handleRoomName = (e: any) => {
    setRoomName(e.target.value)
  }
  useEffect(() => {
  }, []);
  const runMatterJs = () => {
    setJoinRoom("go")
    const MatterNode = new matterJsModules(roomName)
    MatterNode.createModules()
    MatterNode.createBodies()
    MatterNode.events()
    MatterNode.run()
    MatterNode.socketStuff()
    function handleResize() {
      var oldscreen = { w : MatterNode.objects.render.canvas.width, h : MatterNode.objects.render.canvas.height}
      var newScreen = { w: MatterNode.matterContainer.clientWidth, h : MatterNode.matterContainer.clientHeight}
      console.log(oldscreen, newScreen)
      MatterNode.responsivity(oldscreen, newScreen, setHeight)
     }
     window.addEventListener('resize', handleResize);
     return () => window.removeEventListener('resize', handleResize);
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
      {
joinRoom == "hidden" &&
        <div className="relative flex h-screen w-screen flex-col bg-black md:items-center
        md:justify-center md:bg-transparent">
            <label className="text-lg">Room ID</label>
            <div className="border ">
              <input className="pl-1" onChange={handleRoomName} value={roomName} type="text" />
              <button className="bg-green-700 px-1" onClick={runMatterJs}> Join</button>
            </div>
          </div>
        }
        {
      <div id="matter-Container" className={`h-[667px] w-[375px]  ${!joinRoom && "hidden"}`}>  </div>}
        
     

      </main>
    </>
  )
}
