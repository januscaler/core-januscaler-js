import Aigle from "aigle";
import { JanuScalerJsPlugin } from "./JanuScalerJsPlugin";
import { WebSocketClient } from "./WebSocketClient";

export class JanuScalerJsSession {
    constructor(public webSocketClient: WebSocketClient) { }
    public sessionId?: string;
    private plugins: JanuScalerJsPlugin[] = []

    async init() {
        if (this.sessionId) {
            return;
        }
        const { data: { id } } = await this.webSocketClient.sendJsonSync({
            "janus": "create"
        })
        this.sessionId = id
    }

    async dispose() {
        await Aigle.each(this.plugins, async (plugin) => {
            await plugin.dispose()
        })
        this.plugins=[]
    }

    async attach<T extends JanuScalerJsPlugin>(
        classToCreate: new (...args: any) => T
    ): Promise<T> {
        const pluginInstance = new classToCreate(this)
        await pluginInstance.init()
        this.plugins.push(pluginInstance)
        return pluginInstance
    }
}