"use client"
import { useParams } from "next/navigation"
import { Depth } from "@/components/ui/depth/Depth";
import { TradeView } from "@/components/ui/Tradeview";
import Appbar from "@/components/ui/Appbar";
import {SwapUI} from "@/components/ui/SwapUi";
import { MarketBar } from "@/components/ui/MarketBar";

export default function Page() {
    const { market } = useParams();

    return <div className="flex text-white flex-row text-1xl bg-black min-h-screen tracking-widest">

        <div className="flex flex-col  w-full ">
            <Appbar TrueButton={true} ></Appbar>
             <MarketBar market={market as string} /> 
        </div>
      

                    <div className=" flex flex-row  mt-50">
                        <div className="bg-amber-50">
                    <TradeView market={market as string}></TradeView>
                        </div>
                    <div className="max-h-[500px] overflow-scroll border-1 border-blue-900/10 rounded-2xl m-2 space-10 w-[300px]">
                    <Depth market={market as string} /> 
                    </div>
                    <div className=" ">
                    <SwapUI market={market as string} />
                    </div>
                   </div>
    </div>
}