import { JanuScalerJsPlugin, JanusScalerPluginIdentifiers } from "../JanuScalerJsPlugin";
import { JanuScalerJsSession } from "../JanuScalerJsSession";
import _ from 'lodash'
import { Subject } from "rxjs";

export class JanuScalerVideoCallPlugin extends JanuScalerJsPlugin {
    constructor(protected session: JanuScalerJsSession) {
        super(session)
        this.onAccepted = new Subject()
        this.onRegistered = new Subject()
        this.onHangup = new Subject()
        this.onIncomingCall = new Subject()
        this.onCalling = new Subject()
        this.pluginIdentifier = JanusScalerPluginIdentifiers.VIDEO_CALL
    }

    public onRegistered: Subject<{ event: 'registered', username: string }>
    public onIncomingCall: Subject<{ event: 'incomingcall', username: string, jsep: RTCSessionDescriptionInit }>
    public onAccepted: Subject<{ event: 'accepted', username: string, jsep: RTCSessionDescriptionInit }>
    public onHangup: Subject<{ event: 'hangup', username: string, reason: string }>
    public onCalling: Subject<{ event: 'calling' }>
    async init(): Promise<void> {
        await super.init()
        this.onPluginMessage.subscribe(({ data, jsep }) => {
            const { result, } = data
            const { event } = result
            if (event === 'registered') {
                this.onRegistered.next(result)
            }
            else if (event === 'incomingcall') {
                this.onIncomingCall.next({
                    ...result,
                    jsep
                })
            }
            else if (event === 'accepted') {
                this.onAccepted.next({
                    ...result,
                    jsep
                })
            }
            else if (event === 'hangup') {
                this.onHangup.next(result)
            }
            else if (event === 'calling') {
                this.onCalling.next(result)
            }
        })
    }

    register(username: string) {
        const message = {
            "request": "register",
            username
        }
        return this.sendMessage(message)
    }

    call(username: string, offer: RTCSessionDescriptionInit) {
        const message = {
            "request": "call",
            username,
        }
        return this.sendMessage(message, offer)
    }

    accept(answer: RTCSessionDescriptionInit) {
        const message = {
            "request": "accept",
        }
        return this.sendMessage(message, answer)
    }

    list() {
        const message = {
            "request": "list"
        }
        return this.sendMessage(message)
    }

    hangup() {
        const message = {
            "request": "hangup"
        }
        return this.sendMessage(message)
    }

}