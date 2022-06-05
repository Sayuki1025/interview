<template>
  <div class="slider">
    <div class="slider-bar" ref="slider">
      <div class="color-bar" :style="wrapperStyle"></div>
      <SliderButton :sliderSize='sliderSize' :min='min' :max='max' :step='step' :precision='precision' :value='value[0]'
        @changeValue="changeValue($event, 0)" />
      <SliderButton :sliderSize='sliderSize' :min='min' :max='max' :step='step' :precision='precision' :value='value[1]'
        @changeValue="changeValue($event, 1)" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, toRef, toRefs, computed, watch, onBeforeUnmount } from 'vue'
import SliderButton from "./SliderButton.vue"

interface Props {
  min?: number,
  max?: number,
  step?: number,
  precision?: number,
  value?: number[],
}
const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 100,
  step: 1,
  precision: 1,
  value: () => [0, 100],
})

const emit = defineEmits<{
  (e: 'changeValue', value: number[]): void
}>()


const state = reactive({
  sliderSize: 0,
  value: toRef(props, 'value'),

  // min: 0,
  // max: 100,
  // step: 1,
  precision: 1,
})

const { sliderSize } = toRefs(state)

const slider = ref<HTMLElement | null>(null)

const changeValue = (value: number, index: number) => {
  state.value[index] = value
}
const resetSize = () => {
  if (slider.value) {
    state.sliderSize = slider.value?.clientWidth
  }
}
const wrapperStyle = computed(() => {
  return (
    {
      left: `${(state.value[0] - props.min) / (props.max - props.min) * 100}%`,
      width: `${Math.abs((state.value[1] - state.value[0]) / props.max * 100)}%`
    }
  )
})
watch(() => state.value[0], () => {
  if (state.value[0] > state.value[1]) {
    state.value[1] = state.value[0]
  }
  emit('changeValue', state.value)
})

watch(() => state.value[1], () => {
  if (state.value[0] > state.value[1]) {
    state.value[0] = state.value[1]
  }
  emit('changeValue', state.value)
})

onMounted(() => {
  resetSize()
  window.addEventListener('resize', resetSize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resetSize)
})



</script>
<style lang="scss" scoped>
.slider {
  position: relative;
  height: 4px;
  margin: 20px 10px;

  .slider-bar {
    position: relative;
    display: flex;
    align-items: center;
    height: 2px;
    // margin-left: 9px;
    background: #B3B3B3;

    .color-bar {
      position: absolute;
      z-index: 5;
      width: 100%;
      height: 2px;
      background: $cyan;
      pointer-events: none;
    }

    .thumb {
      position: absolute;
      z-index: 10;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #FFFFFF;
      box-shadow: 0px 1px 7px rgba(0, 0, 0, 0.25);
      cursor: grab;
    }
  }
}
</style>

