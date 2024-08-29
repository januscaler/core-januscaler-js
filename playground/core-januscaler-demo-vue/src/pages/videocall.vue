<template>
	<div>videocall</div>
</template>

<script setup lang="ts">
import { JanuScalerJs, WebSocketClient, JanuScalerVideoCallPlugin } from '@januscaler/core-januscaler-js';
const wsClient = new WebSocketClient('ws://127.0.0.1:8188', {
	token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBlcm1pc3Npb25zIjpbbnVsbF0sImlhdCI6MTcyMzQwMjk4Mn0.WZGpk0uOwYYY7szDo3clb63KhsEk2dzs2qe1HWtwWo8',
	protocols: 'januscaler-protocol'
});
const client = new JanuScalerJs(wsClient);
await dummy('cj');
await dummy('mj', 'cj');
// const { plugin: p2, session: s2, pc: pc2 } = await dummyCaller();
// pc2.onicecandidate = async (event) => {
// 	await p2.sendTrickle(event.candidate ?? undefined);
// };
// p2.onIncomingCall.subscribe(async (event) => {
// 	console.log(event);
// 	await pc2.setRemoteDescription(event.jsep);
// 	const answer = await pc2.createAnswer();
// 	await pc2.setLocalDescription(answer);
// 	await p2.accept(answer);
// });
// p2.onAccepted.subscribe((ev) => {
// 	console.log(ev, 'accepted');
// });
// p2.onRegistered.subscribe(async (event) => {});
// await p2.register('cj');

// const { plugin: p1, session: s1, pc: pc1 } = await dummyCaller();
// pc1.onicecandidate = async (event) => {
// 	await p1.sendTrickle(event.candidate ?? undefined);
// };
// p1.onAccepted.subscribe(async (ev) => {
// 	console.log(ev, 'accepted');
// 	await pc1.setRemoteDescription(ev.jsep);
// });
// p1.onRegistered.subscribe(async (event) => {
// 	console.log('boom', event);
// 	const offer = await pc1.createOffer({});
// 	await pc1.setLocalDescription(offer);
// 	await p1.call('cj', offer);
// });
// await p1.register('mj');

// async function dummyCaller() {
// 	const session2 = await client.createSession();
// 	const pc = new RTCPeerConnection();
// 	const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
// 	stream.getTracks().forEach((track) => {
// 		pc.addTrack(track);
// 	});
// 	const videoCall2 = await session2.attach(JanuScalerVideoCallPlugin);
// 	return { session: session2, plugin: videoCall2, pc };
// }
async function dummy(username: string, usernameToCall?: string) {
	const session = await client.createSession();
	const pc = new RTCPeerConnection();
	const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
	stream.getTracks().forEach((track) => {
		pc.addTrack(track);
	});
	const videoCall = await session.attach(JanuScalerVideoCallPlugin);
	pc.onicecandidate = async (event) => {
		await videoCall.sendTrickle(event.candidate ?? undefined);
	};
	videoCall.onIncomingCall.subscribe(async (event) => {
		console.log(event);
		await pc.setRemoteDescription(event.jsep);
		const answer = await pc.createAnswer();
		await pc.setLocalDescription(answer);
		await videoCall.accept(answer);
	});
	videoCall.onAccepted.subscribe(async (ev) => {
		console.log(ev, 'accepted');
		await pc.setRemoteDescription(ev.jsep);
	});
	videoCall.onRegistered.subscribe(async (event) => {
		if (usernameToCall) {
			const offer = await pc.createOffer({});
			await pc.setLocalDescription(offer);
			await videoCall.call(usernameToCall, offer);
		}
	});
	await videoCall.register(username);
}
</script>

<style scoped></style>
