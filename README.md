# core-januscaler-js

A core js library implementing only core apis of januscaler without webrtc

## Consumer Level Architecture

1. VideoCall Operations Example

```ts
import { JanuScaler } from '@januscaler/browser-sdk';

const client = new JanuScaler({
	token: `secure access token from backend-sdk or trusted source`
});  

await client.init({ debug: false });  

const videoCallHandle = await client.videoCall.createServiceHandle();  

videoCallHandle.eventStream.subscribe((event) => {});
videoCallHandle.events.onRegistered = (registeredEvent) => {};
videoCallHandle.events.onIncomingCall = (callerEvent) => {};
function registerUser(userNameToRegister) {
	return await videoCallHandle.register(userNameToRegister);
}
function callUser(userNameToCall) {
	return await videoCallHandle.call(userNameToCall)
}
```

## LICENSE

MIT
