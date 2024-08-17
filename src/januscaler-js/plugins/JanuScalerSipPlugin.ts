import { JanuScalerJsPlugin, JanusScalerPluginIdentifiers } from "../JanuScalerJsPlugin";
import { JanuScalerJsSession } from "../JanuScalerJsSession";

export class JanuScalerSipPlugin extends JanuScalerJsPlugin{
    constructor(protected session: JanuScalerJsSession) {
        super(session)
        this.pluginIdentifier = JanusScalerPluginIdentifiers.SIP
     }
     async init(): Promise<void> {
        await super.init()
    } 
}