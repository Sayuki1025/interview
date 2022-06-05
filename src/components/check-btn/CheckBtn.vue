<template>
  <ul class="panel-check-btn">
    <!-- <li >Any</li> -->
    <li v-for="item in props.list" :key="item" :class="{ selected: selectedClass(item) }" @click="select(item)">{{ item
    }}
    </li>
  </ul>
</template>

<script setup lang="ts">

import { toRef, reactive, watch } from 'vue'
interface Props {
  list?: string[],
  multiple?: boolean,
  modelValue?: string | string[],
}
const props = withDefaults(defineProps<Props>(), {
  list: () => ['Any', '0', '1', '2', '3', '4', '5+'],
  multiple: false,
  modelValue: 'Any',
})

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: string | string[]): void
}>()
const modelValue = toRef(props, 'modelValue')
const state = reactive({
  selectMap: new Map()
})
const init = () => {

  if (props.multiple) {
    props.list.forEach((element) => {
      state.selectMap.set(element, false)
    });

    (props.modelValue as string[]).forEach(element => {
      state.selectMap.set(element, true)
    })
  }
}

const selectedClass = (item: string) => {
  if (props.multiple) {
    return modelValue.value.includes(item)
  } else {
    return modelValue.value === item
  }
}

const select = (item: string) => {
  if (!props.multiple) {
    emit('update:modelValue', item)
  } else {
    if (item === 'Any') {
      state.selectMap.forEach((value, key) => {
        state.selectMap.set(key, false)
      })
      state.selectMap.set('Any', true)
    } else {
      state.selectMap.set('Any', false)
      state.selectMap.set(item, !state.selectMap.get(item))
    }
    let selectArray = Array.from(state.selectMap.keys()).filter(key => state.selectMap.get(key))

    if (selectArray.length === props.list.length - 1) {
      selectArray = ['Any']
      state.selectMap.forEach((value, key) => {
        state.selectMap.set(key, false)
      })
    }
    console.log(selectArray)

    emit('update:modelValue', selectArray)
  }
}
init()


watch(() => props.modelValue, () => {
  init()
})

</script>
<style lang="scss" scoped>
.panel-check-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  li {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;

    padding: 0 9px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 16px;
    cursor: pointer;

    &.selected {
      background: $cyan;
      color: #ffffff;
    }

    &+li {
      margin-left: 16px;
    }
  }
}
</style>

