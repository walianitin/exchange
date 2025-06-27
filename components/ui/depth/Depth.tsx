import { useEffect, useState } from "react";
import {getDepth,getTicker} from '@/app/utils/httpClient'
import {AskTable} from "./AsksTable"
import Bidstable from './Bidstable'
import { SignalingManager } from "@/app/utils/SignalingManager";
import { sign } from "crypto";

export function Depth({market }:{market:string}){
    const [asks,setasks]=useState<[string,string][]>();
    const [bids,setbids]=useState<[string,string][]>();
    const [price,setprice]=useState<string>();


    useEffect(() => {
        
       
        SignalingManager.getInstance().registerCallback("depth",(data:any)=>{

            setbids((originalbids) => {
               
               
                const bidsAfterUpdate = [...(originalbids || [])];

                for (let i = 0; i < bidsAfterUpdate.length; i++) {
                    for (let j = 0; j < data.bids.length; j++) {
                        if (bidsAfterUpdate[i][0] === data.bids[j][0]) {
                            bidsAfterUpdate[i][1] = data.bids[j][1];
                            break;
                        }
                    }
                }
                return bidsAfterUpdate;
            });

            setasks((originalAsk) => {
                const AskAfterUpdate = [ ...(originalAsk || []) ];
                        for (let i=0;i<AskAfterUpdate.length;i++)
                        {
                            for(let j=0;j<data.asks.length ;j++){
                                if(AskAfterUpdate[i][0]===data.asks[j][0]){
                                    AskAfterUpdate[i][1]=data.asks[j][1];
                                    break;
                                }
                            }
                        }
                return AskAfterUpdate;
            });


        },`DEPTH-${market}`);
   SignalingManager.getInstance().sendMessage({"method":"SUBSCRIBE","params":[`depth.${market}`]});

        getDepth(market).then(d => {
            setbids(d.bids.reverse());
            setasks(d.asks);
        })
            getTicker(market).then(t=>{
                setprice(t.lastPrice)
            })

            return ()=>{
                 SignalingManager.getInstance().sendMessage({"method":"UNSUBSCRIBE" ,"params":[`depth.200ms.${market}`]});
                 SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
            }
        },[]);
    

        return <div className="bg-black-300 ">
              <TableHeader />
            {asks  && <AskTable asks={asks} ></AskTable>}
             {price && <div>{price}</div>}
            { bids && <Bidstable bids={bids} ></Bidstable>}

        </div>
}

function TableHeader(){
    return <div className="flex  font-mono  flex-row flex-1 justify-around text -">
        <div className="text-slate-500">Price</div>
        <div className="text-slate-500">Size</div>
        <div className="text-slate-500">Total</div>
    </div>
}