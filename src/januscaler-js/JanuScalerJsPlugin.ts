import { Subject, Subscription } from "rxjs";
import { JanuScalerJsSession } from "./JanuScalerJsSession";

export class JanuScalerJsPlugin {

    constructor(protected session: JanuScalerJsSession) { }

    onMessage = new Subject<{plugin: string,data: any}>()
    public pluginIdentifier: string
    private onPluginMessageSubscription:Subscription
    public handleId?: string
    protected get webSocketClient() {
        return this.session.webSocketClient
    }

    async dispose(){
        this.onPluginMessageSubscription.unsubscribe()
    }

    async init() {
        if (this.handleId) {
            return;
        }
        const { data: { id } } = await this.webSocketClient.sendJsonSync({
            "janus": "attach",
            "plugin": this.pluginIdentifier,
            "session_id": this.session.sessionId
        })
        this.handleId = id
        this.onPluginMessageSubscription=this.webSocketClient.onMessage.subscribe((event: any) => {
            const { janus, session_id, sender, plugindata } = event ?? {}
            if (janus === "event" && session_id === this.session.sessionId && sender === this.handleId) {
                this.onMessage.next(plugindata)
            }
        })
    }


    sendMessage(message: { request: string } & any, jsep?: RTCSessionDescription, predicate?: (data: any) => boolean, replacer?: (this: any, key: string, value: any) => any) {
        const payload: any = {
            "janus": "message",
            "body": message,
            "session_id": this.session.sessionId,
            "handle_id": this.handleId
        }
        if (jsep) {
            payload.jsep = jsep.toJSON()
        }
        return this.webSocketClient.sendJsonSync(payload, predicate, replacer)
    }

}

export abstract class JanusScalerPluginIdentifiers {
    static VIDEO_ROOM = 'janus.plugin.videoroom'
    static VIDEO_CALL = 'janus.plugin.videocall'
    static AUDIO_BRIDGE = 'janus.plugin.audiobridge'
    static SIP = 'janus.plugin.sip'
    static STREAMING = 'janus.plugin.streaming'
    static ECHO_TEST = 'janus.plugin.echotest'
}
