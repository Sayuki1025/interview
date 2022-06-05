<template>
  <div class="slider-button" @touchstart="onButtonDown" @mousedown="onButtonDown" :style="wrapperStyle"></div>
</template>
<script setup lang="ts">
import { reactive, nextTick, computed, watch } from 'vue'
interface Props {
  sliderSize?: number,
  min?: number,
  max?: number,
  step?: number,
  precision?: number,
  value?: number,
}
const props = withDefaults(defineProps<Props>(), {
  sliderSize: 0,
  min: 0,
  max: 100,
  step: 1,
  precision: 1,
  value: 0,
})
const emit = defineEmits<{
  (e: 'changeValue', value: number): void
}>()

const state = reactive({
  dragging: false,
  isClick: false,
  value: props.value,

  startPosition: 0,
  newPosition: 0,
  startX: 0,
  currentX: 0,

  oldValue: 0,
  modelValue: 0,
})


const onButtonDown = (event: MouseEvent | TouchEvent) => {
  event.preventDefault()
  onDragStart(event)
  window.addEventListener('mousemove', onDragging)
  window.addEventListener('touchmove', onDragging)
  window.addEventListener('mouseup', onDragEnd)
  window.addEventListener('touchend', onDragEnd)
  window.addEventListener('contextmenu', onDragEnd)
}
const onDragStart = (event: MouseEvent | TouchEvent) => {
  state.dragging = true
  state.isClick = true

  const clientX =
    (event as TouchEvent).touches?.item(0)?.clientX ??
    (event as MouseEvent).clientX
  state.startX = clientX
  state.startPosition = parseFloat(currentPosition.value)
  state.newPosition = state.startPosition
}


const onDragging = (event: MouseEvent | TouchEvent) => {
  if (state.dragging) {
    state.isClick = false

    // resetSize()
    let diff = 0
    const clientX =
      (event as TouchEvent).touches?.item(0)?.clientX ??
      (event as MouseEvent).clientX
    state.currentX = clientX
    diff = (state.currentX - state.startX) / props.sliderSize * 100
    state.newPosition = state.startPosition + diff
    setPosition(state.newPosition)
  }
}

const onDragEnd = () => {
  if (state.dragging) {

    setTimeout(() => {
      state.dragging = false

      if (!state.isClick) {
        setPosition(state.newPosition)

      }
    }, 0)
    window.removeEventListener('mousemove', onDragging)
    window.removeEventListener('touchmove', onDragging)
    window.removeEventListener('mouseup', onDragEnd)
    window.removeEventListener('touchend', onDragEnd)
    window.removeEventListener('contextmenu', onDragEnd)
  }
}
const setPosition = async (newPosition: number) => {
  if (newPosition === null || Number.isNaN(+newPosition)) return
  if (newPosition < 0) {
    newPosition = 0
  } else if (newPosition > 100) {
    newPosition = 100
  }
  const lengthPerStep = 100 / ((props.max - props.min) / props.step)
  const steps = Math.round(newPosition / lengthPerStep)
  let value =
    steps * lengthPerStep * (props.max - props.min) * 0.01 + props.min
  value = Number.parseFloat(value.toFixed(props.precision))
  state.value = value

  if (!state.dragging && state.modelValue !== state.oldValue) {
    state.oldValue = state.modelValue
  }

  await nextTick()
  emit('changeValue', value)
}

const currentPosition = computed(() => {
  return `${(state.value - props.min) / (props.max - props.min) * 100}%`
})
const wrapperStyle = computed(() => {
  return (
    { left: currentPosition.value }
  )
})

watch(() => props.value, () => {
  state.value = props.value
})

</script>
<style lang="scss" scoped>
.slider-button {
  position: absolute;
  z-index: 10;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #FFFFFF;
  transform: translate(-50%);
  box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.25);
  cursor: grab;
}
</style>

