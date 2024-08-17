import { JanuScalerJsPlugin, JanusScalerPluginIdentifiers } from "../JanuScalerJsPlugin";
import { JanuScalerJsSession } from "../JanuScalerJsSession";

export class JanuScalerStreamingPlugin extends JanuScalerJsPlugin{
    constructor(protected session: JanuScalerJsSession) {
        super(session)
        this.pluginIdentifier = JanusScalerPluginIdentifiers.STREAMING
     }   
     async init(): Promise<void> {
        await super.init()
    } 
}