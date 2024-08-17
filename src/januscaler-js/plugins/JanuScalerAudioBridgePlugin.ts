import { JanuScalerJsPlugin, JanusScalerPluginIdentifiers } from "../JanuScalerJsPlugin";
import { JanuScalerJsSession } from "../JanuScalerJsSession";

export class JanuScalerAudioBridgePlugin extends JanuScalerJsPlugin {
    constructor(protected session: JanuScalerJsSession) {
        super(session)
        this.pluginIdentifier = JanusScalerPluginIdentifiers.AUDIO_BRIDGE
    }
    async init(): Promise<void> {
        await super.init()
    } 


}