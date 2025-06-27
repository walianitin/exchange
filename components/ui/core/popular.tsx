import { getinfo } from "@/app/utils/httpClient";
import { useEffect, useState } from "react"
import { symbol } from "zod";
import { marketData } from "@/app/utils/types";


export default function PopularTable(){
        const [popular, setPopular] = useState<marketData[]>([]);

        useEffect(() => {
            getinfo()
                .then((data: marketData[]) => {
                    const selected_data = data
                        .sort((a, b) => Number(b.lastPrice) - Number(a.lastPrice))
                        .slice(0, 10);
                     
                    setPopular(selected_data);
                })
                .catch((error: any) => {
                    console.error("Failed to fetch popular data:", error);
                });
        }, []);
        
        
        return <div>
        <div>
        
        </div>
    </div>
}