import { Subject } from "rxjs"
import { v4 } from 'uuid'

export class WebSocketClient {
    private webSocket: WebSocket
    public onMessage: Subject<string> = new Subject()
    public onJson: Subject<any> = new Subject()
    private timer: any
    private timeout: number
    private protocols?: string | string[]
    private token?: string
    private apiSecret?: string
    public initialized = false

    constructor(public url: string, { protocols, token, apiSecret, timeout }: {
        token?: string
        apiSecret?: string
        protocols?: string | string[], timeout?: number,
    }

    ) {
        this.protocols = protocols ?? 'januscaler-protocol'
        this.timeout = timeout ?? 8000
        this.token = token
        this.apiSecret = apiSecret
    }

    dispose() {
        this.webSocket.close()
        this.onJson.unsubscribe()
        this.onMessage.unsubscribe()
    }

    async send(data: string) {
        // await this.init()
        this.webSocket.send(data)
    }

    sendJson(data: any, replacer?: (this: any, key: string, value: any) => any) {
        if (this.apiSecret) {
            data.apiSecret = this.apiSecret
        }
        if (this.token) {
            data.token = this.token
        }
        const json = JSON.stringify(data, replacer)
        return this.send(json)
    }

    sendJsonSync(data: any, predicate?: (data: any) => boolean, replacer?: (this: any, key: string, value: any) => any) {
        data.transaction = data.transaction ? data.transaction : v4()
        predicate = predicate ? predicate : (response) => data?.transaction === response?.transaction
        return new Promise<any>(async (resolve, reject) => {
            await this.sendJson(data, replacer)
            this.onJson.subscribe((data) => {
                if (predicate(data)) {
                    resolve(data)
                }
            })
        })
    }

    async init() {
        if (this.initialized) {
            return;
        }
        return new Promise<any>((resolve, reject) => {
            this.webSocket = new WebSocket(this.url, this.protocols)
            this.timer = setTimeout(() => {
                reject({ code: 500, reason: "Timeout" })
            }, this.timeout)
            if (this.webSocket.readyState == this.webSocket.OPEN) {
                resolve(true)
            }
            this.webSocket.onopen = (event) => {
                this.initialized = true;
                clearTimeout(this.timer)
                resolve(true)
            }
            this.webSocket.onclose = (event) => {
                clearTimeout(this.timer)
                resolve({ code: event.code, reason: event.reason })
            }
            this.webSocket.onmessage = (event) => {
                this.onMessage.next(event.data)
                try {
                    this.onJson.next(JSON.parse(event.data))
                } catch (error) {
                }
            }
            this.webSocket.onerror = (error) => {
                clearTimeout(this.timer)
                reject(error)
            }
        })
    }
}