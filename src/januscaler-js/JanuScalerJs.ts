import { JanuScalerJsSession } from './JanuScalerJsSession';
import {WebSocketClient} from './WebSocketClient'
export class JanuScalerJs{

    constructor(private webSocketClient:WebSocketClient){}

    async createSession():Promise<JanuScalerJsSession>{
        await this.webSocketClient.init()
        const session=new JanuScalerJsSession(this.webSocketClient)
        await session.init()
        return session
    }
}