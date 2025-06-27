import { getinfo } from "@/app/utils/httpClient";
import { marketData } from "@/app/utils/types"
import { useEffect, useState } from "react"


export default function Newtable(){

    const [Newtable,setnewtable]= useState<marketData[]>();

    useEffect(()=>{

        getinfo().then((data:marketData[])=>{
                 const size=data.length;

                const selected_Data:marketData[] = data.slice(size - 10, size);
               
                setnewtable(selected_Data);
        })
        
    },[])
   
    return <div>
        
    </div>
}