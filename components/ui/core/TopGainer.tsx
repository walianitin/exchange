import { getinfo } from "@/app/utils/httpClient";
import { marketData } from "@/app/utils/types";
import { useEffect, useState } from "react";


export function TopGainer(){
    const [data,setData]=useState<marketData[]>();

    useEffect(()=>{
        getinfo().then((data:marketData[])=>{
            const selectedData=data.sort((a:any,b:any)=> b.priceChangePercent- a.priceChangePercent).slice(10)

            setData(selectedData);
         
        })
    },[])
    return <div>
        TopGainer
    </div>
}