import { Subject } from "rxjs";
import { JanuScalerJsSession } from "./JanuScalerJsSession";

export class JanuScalerJsPlugin {

    constructor(protected session: JanuScalerJsSession) {
        this.onPluginMessage = new Subject()
    }
    public onPluginMessage: Subject<{ plugin: string, data: any, jsep?: RTCSessionDescriptionInit }>
    public pluginIdentifier: string
    public handleId?: string
    protected get webSocketClient() {
        return this.session.webSocketClient
    }


    async dispose() {
    }

    async init() {
        if (this.handleId) {
            console.log('only once super.init')
            return;
        }
        const { data: { id } } = await this.webSocketClient.sendJsonSync({
            "janus": "attach",
            "plugin": this.pluginIdentifier,
            "session_id": this.session.sessionId
        })
        this.handleId = id
        this.webSocketClient.onJson.subscribe((event: any) => {
            const { janus, session_id, sender, plugindata, jsep } = event ?? {}
            if (janus === 'event' && session_id === this.session.sessionId && sender === this.handleId) {
                this.onPluginMessage.next({
                    ...plugindata,
                    jsep
                })
            }
        })
    }

    sendTrickle(candidate?: RTCIceCandidate) {
        const payload = {
            "janus": "trickle",
            "candidate": candidate,
            "session_id": this.session.sessionId,
            "handle_id": this.handleId
        }
        return this.webSocketClient.sendJsonSync(payload)
    }


    sendMessage(message: { request: string } & any, jsep?: RTCSessionDescriptionInit, predicate?: (data: any) => boolean, replacer?: (this: any, key: string, value: any) => any) {
        const payload: any = {
            "janus": "message",
            "body": message,
            "session_id": this.session.sessionId,
            "handle_id": this.handleId
        }
        if (jsep) {
            payload.jsep = jsep
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
