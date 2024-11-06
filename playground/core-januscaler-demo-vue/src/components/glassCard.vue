<script setup lang="ts">
import { ref } from 'vue'
import VPFeaturePattern from '../components/pattern.vue'

defineProps<{
  title?: string
  details?: string
  link?: string
  linkText?: string
  rel?: string
  target?: string
}>()

const mouseX = ref(0)
const mouseY = ref(0)
const x = ref(0)
const y = ref(0)
const verticalX = ref(0)
const verticalY = ref(0)

function onMouseMove(event: MouseEvent) {
  const { clientX, clientY } = event
  const { left, top } = (event.currentTarget as HTMLDivElement).getBoundingClientRect()
  mouseX.value = clientX - left
  mouseY.value = clientY - top

  const middleX = window.innerWidth / 2
  const middleY = window.innerHeight / 2

  const offsetX = ((clientX - middleX) / middleX)
  const offsetY = ((clientY - middleY) / middleY)

  y.value = mouseX.value > mouseY.value ? -1 * offsetY : offsetY
  x.value = mouseY.value > mouseX.value ? -1 * offsetX : offsetX

  // Calculate vertical movement
  const verticalOffsetX = ((clientX - middleX) / middleX)
  const verticalOffsetY = ((clientY - middleY) / middleY)

  verticalY.value = mouseX.value > mouseY.value ? -1 * verticalOffsetX * 4 : verticalOffsetX * 4
  verticalX.value = mouseY.value > mouseX.value ? -1 * verticalOffsetY * 4 : verticalOffsetY * 4
}

function onMouseLeave() {
  y.value = 0
  x.value = 0
  verticalY.value = 0
  verticalX.value = 0
}

</script>

<template>
  <div
    class="VPFeature"
    @mousemove="onMouseMove"
    @mouseout="onMouseLeave"
    >
    <VPFeaturePattern :mouse-x="mouseX" :mouse-y="mouseY" class="VPFeaturePN" />
    <div
      class="vp-link"
    >
      <div class="header-box">
        <h2 class="title" >hello</h2>
      </div>
      <article class="box">
        <p >hello2</p>
      </article>
    </div>
  </div>
</template>

<style scoped>
.VPFeature {
  position: relative;
  display: block;
  border: 1px solid var(--vp-c-border);
  border-radius: 6px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  padding: 24px;
  transition: border-color 0.25s, background-color 0.25s, transform 50ms;
  font-weight: 600;
}

.VPFeature:hover .VPFeaturePN {
  opacity: 1;
}

</style>