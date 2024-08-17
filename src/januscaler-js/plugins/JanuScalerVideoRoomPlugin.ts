import { JanuScalerJsPlugin, JanusScalerPluginIdentifiers } from "../JanuScalerJsPlugin";
import { JanuScalerJsSession } from "../JanuScalerJsSession";

export class JanuScalerVideoRoomPlugin extends JanuScalerJsPlugin{
    constructor(protected session: JanuScalerJsSession) {
        super(session)
        this.pluginIdentifier = JanusScalerPluginIdentifiers.VIDEO_ROOM
     }
     async init(): Promise<void> {
        await super.init()
    } 
}