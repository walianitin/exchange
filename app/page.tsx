"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import  Appbar  from "../components/ui/Appbar";

export default function Home() {
const router=useRouter();
const [loader ,setloader]=useState(true);

    // useEffect(()=>{
    //     const timer= setTimeout(() => {
    //            router.push("/market")
    //     }, 5*1000); 
            
    // return ()=>clearTimeout(timer)
    // })
  
            return <div className=" bg-black min-h-screen p-4 tracking-widest ">    

                <div className=" mb-10"></div>
                <Appbar TrueButton={false}></Appbar>
            </div>
}
