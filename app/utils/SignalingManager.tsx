import { Ticker } from "./types";

export const BASE_URL = "wss://ws.backpack.exchange/"

export interface MessageType {
    method?: string;
    params?: string[];
    [key: string]: unknown;
}

export interface CallbackInfo {
    callback: (data: unknown) => void;
    id: string;
}

export class SignalingManager {
    private ws: WebSocket;
    private static instance: SignalingManager;
    private bufferedMessages: MessageType[] = [];
    private callbacks: { [type: string]: CallbackInfo[] } = {};
    private id: number;
    private initialized: boolean = false;

    private constructor() {
        this.ws = new WebSocket(BASE_URL);
        this.bufferedMessages = [];
        this.id = 1;
        this.init();
    }

    public static getInstance() {
        if (!this.instance)  {
            this.instance = new SignalingManager();
        }
        
        return this.instance;
    }
        
    init() {
        this.ws.onopen = () => {
            this.initialized = true;
            this.bufferedMessages.forEach(message => {
                this.ws.send(JSON.stringify(message));
            });
            this.bufferedMessages = [];
        }
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            const type = message.data.e;
            if (this.callbacks[type]) {
                this.callbacks[type].forEach(({ callback }) => {
                    if (type === "ticker") {
                        const newTicker: Partial<Ticker> = {
                            lastPrice: message.data.c,
                            high: message.data.h,
                            low: message.data.l,
                            volume: message.data.v,
                            quoteVolume: message.data.V,
                            symbol: message.data.s,
                        }

                        callback(newTicker);
                   }
                   if (type === "depth") {
                        // const newTicker: Partial<Ticker> = {
                        //     lastPrice: message.data.c,
                        //     high: message.data.h,
                        //     low: message.data.l,
                        //     volume: message.data.v,
                        //     quoteVolume: message.data.V,
                        //     symbol: message.data.s,
                        // }
                        // console.log(newTicker);
                        // callback(newTicker);
                        const updatedBids = message.data.b;
                        const updatedAsks = message.data.a;
                        callback({ bids: updatedBids, asks: updatedAsks });
                    }
                });
            }
        }
    }

    sendMessage(message: MessageType) {
        const messageToSend = {
            ...message,
            id: this.id++
        }
        if (!this.initialized) {
            this.bufferedMessages.push(messageToSend);
            return;
        }
        this.ws.send(JSON.stringify(messageToSend));
    }

    async registerCallback(type: string, callback: (data: unknown) => void, id: string) {
        this.callbacks[type] = this.callbacks[type] || [];
        this.callbacks[type].push({ callback, id });
       
        // "ticker" => callback
    }

    async deRegisterCallback(type: string, id: string) {
        if (this.callbacks[type]) {
            const index = this.callbacks[type].findIndex(callback  => callback.id === id);
            
            if (index !== -1) {
                this.callbacks[type].splice(index, 1);
            }
        }
    }
}

// one class one instaance ,one ws soket ,buffered message ,instance