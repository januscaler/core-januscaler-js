import { JanuScalerJsPlugin, JanusScalerPluginIdentifiers } from "../JanuScalerJsPlugin";
import { JanuScalerJsSession } from "../JanuScalerJsSession";
import _ from 'lodash'

export class JanuScalerVideoCallPlugin extends JanuScalerJsPlugin {
    constructor(protected session: JanuScalerJsSession) {
        super(session)
        this.pluginIdentifier = JanusScalerPluginIdentifiers.VIDEO_CALL
    }
    async init(): Promise<void> {
        await super.init()
    }

    register(username: string, realm: string) {
        const message = {
            "request": "register",
            username,
            realm
        }
        return this.sendMessage(message, null, (event) => {
            return _.get(event, 'plugindata.data.result.event') === 'registered'
        })
    }

    call(username: string, offer: RTCSessionDescription) {
        const message = {
            "request": "call",
            username,
        }
        return this.sendMessage(message, offer)
    }

    accept(answer: RTCSessionDescription) {
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