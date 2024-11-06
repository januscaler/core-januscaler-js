<template>
	<div>
		<div v-if="state === 'initial'">
			<input v-model="myUserName" type="text" placeholder="username to register">
			<button @click="registerUser">Register</button>
		</div>
		<div>
			<video ref="localVideo" autoplay></video>
			<video ref="remoteVideoElement" autoplay></video>
			<audio ref="remoteAudioElement" autoplay style="display:none;"></audio>
		</div>
		<div v-if="state === 'registered'">
			<input v-model="usernameToCall" type="text" placeholder="username to call">
			<button @click="callUser">call</button>
		</div>
		<div v-if="state === 'incall'">
			ongoing call
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { JanuScalerJs, WebSocketClient, JanuScalerVideoCallPlugin } from '@januscaler/core-januscaler-js';
const state = ref('initial')
const myUserName = ref()
const usernameToCall = ref()
const wsClient = new WebSocketClient('ws://127.0.0.1:8188', {
	token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBlcm1pc3Npb25zIjpbbnVsbCxudWxsLG51bGwsbnVsbF0sImlhdCI6MTcyNTE4ODAyMX0.UksqWLftxm5U1otuebm90LGOIHt5wabRrJkJMbKl-p4',
	protocols: 'januscaler-protocol'
});
const client = new JanuScalerJs(wsClient);
const localVideo = ref()
const remoteVideoElement = ref()
const remoteAudioElement = ref()
const remoteVideoMediaStream = new MediaStream()
const remoteAudioMediaStream = new MediaStream()
const session = await client.createSession();
const videoCall = await session.attach(JanuScalerVideoCallPlugin);
const peerConnection = new RTCPeerConnection()
onMounted(() => {
	remoteVideoElement.value.srcObject = remoteVideoMediaStream
	remoteAudioElement.value.srcObject = remoteAudioMediaStream
})
peerConnection.ontrack = (trackEvent) => {
	if (trackEvent.track.kind === 'video') {
		remoteVideoMediaStream.addTrack(trackEvent.track)
	}
	if (trackEvent.track.kind === 'audio') {
		remoteAudioMediaStream.addTrack(trackEvent.track)
	}
}
videoCall.onAccepted.subscribe(async (ev) => {
	if (ev.jsep) {
		console.log(ev, 'accepted');
		await peerConnection.setRemoteDescription(ev.jsep);
		state.value = 'incall'
	}
});
videoCall.onIncomingCall.subscribe(async (event) => {
	if (event.jsep) {
		const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
		mediaStream.getTracks().forEach((track) => {
			peerConnection.addTrack(track, mediaStream)
		})
		localVideo.value.srcObject = mediaStream
		await peerConnection.setRemoteDescription(event.jsep);
		const answer = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription(answer);
		await videoCall.accept(answer);
		state.value = 'incall'
	}

});
async function registerUser() {
	await videoCall.register(myUserName.value)
	state.value = 'registered'
}
async function callUser() {
	const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
	mediaStream.getTracks().forEach((track) => {
		peerConnection.addTrack(track, mediaStream)
	})
	localVideo.value.srcObject = mediaStream
	const offer = await peerConnection.createOffer();
	await peerConnection.setLocalDescription(offer);
	await videoCall.call(usernameToCall.value, offer)
}

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
