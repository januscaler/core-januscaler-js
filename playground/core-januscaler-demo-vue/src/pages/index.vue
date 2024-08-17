<template>
    <div>
home
    </div>
</template>

<script setup lang="ts">
import {JanuScalerJs, WebSocketClient,JanuScalerVideoCallPlugin} from '@januscaler/core-januscaler-js'
const client=new JanuScalerJs(new WebSocketClient('ws://127.0.0.1:8188',{
    token:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInBlcm1pc3Npb25zIjpbbnVsbF0sImlhdCI6MTcyMzQwMjk4Mn0.WZGpk0uOwYYY7szDo3clb63KhsEk2dzs2qe1HWtwWo8',
    protocols:'januscaler-protocol'
}))
const session=await client.createSession()
const videoCall=await session.attach(JanuScalerVideoCallPlugin)
const registered=await videoCall.register('tebby','zopper')
console.log(registered)


console.log(session.sessionId)
</script>

<style scoped>

</style>