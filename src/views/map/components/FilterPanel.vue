<template>
  <article class="filter-panel">
    <p class="panel-title">Filters</p>
    <div class="scroll-wrapper">
      <section class="panel-item">
        <p class="panel-item-title">Price range</p>
        <p class="price-text">${{ price[0] === 600 ? 'Max' : (price[0] * 10000).toLocaleString()
        }} - ${{ price[1] === 600 ? 'Max' : (price[1] * 10000).toLocaleString() }}
        </p>
        <Slider :min='0' :max='600' :step="25" :value='price' @changeValue="changePrice" />
      </section>
      <section class="panel-item">
        <p class="panel-item-title">Description Contains Keywords</p>
        <input type="text" placeholder="Waterfront, Pool, Fireplace..." v-model="description" />
      </section>
      <section class="panel-item">
        <p class="panel-item-title">Bedrooms</p>
        <CheckBtn :list="['Any', '0', '1', '2', '3', '4', '5+']" :multiple="true" v-model="badroomNum" />
      </section>
      <section class=" panel-item">
        <p class="panel-item-title">Bathroom</p>
        <CheckBtn :list="['Any', '1+', '2+', '3+', '4+', '5+']" v-model="bathroomNum" />
      </section>
      <section class="panel-item">
        <p class="panel-item-title">Garage/Parking</p>
        <CheckBtn :list="['Any', '1+', '2+', '3+', '4+', '5+']" v-model="garageNum" />
      </section>
    </div>
    <div class="buttons">
      <button @click="clearPanel">Clear</button>
      <button @click="applyPanel">Apply</button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { reactive, toRefs } from 'vue'
import Slider from "@/components/slider/Slider.vue"
import CheckBtn from '@/components/check-btn/CheckBtn.vue'
import useStore from '@/store'

const store = useStore()

const emit = defineEmits<{
  (e: 'applyPanel', alert: string): void
}>()

const state = reactive({

  price: [200, 475],
  description: '',
  badroomNum: ['Any'],
  bathroomNum: 'Any',
  garageNum: 'Any',
})
const { price, description, badroomNum, bathroomNum, garageNum } = toRefs(state)



const changePrice = (value: number[]) => {
  state.price = value
}

const clearPanel = () => {
  state.price = [200, 475]
  state.description = ''
  state.badroomNum = ['Any']
  state.bathroomNum = 'Any'
  state.garageNum = 'Any'

  store.$reset()
  store.setFilterData({
    price: state.price,
    description: state.description,
    badroomNum: state.badroomNum,
    bathroomNum: state.bathroomNum,
    garageNum: state.garageNum,
  })
}
const applyPanel = () => {
  store.setFilterData({
    price: state.price,
    description: state.description,
    badroomNum: state.badroomNum,
    bathroomNum: state.bathroomNum,
    garageNum: state.garageNum,
  })
  emit('applyPanel', '已完成过滤')
}

const init = () => {
  let filterData = store.getFilterData()
  state.price = filterData.price
  state.description = filterData.description
  state.badroomNum = filterData.badroomNum
  state.bathroomNum = filterData.bathroomNum
  state.garageNum = filterData.garageNum
}
init()

</script>
<style lang="scss" scoped>
.filter-panel {
  position: absolute;
  z-index: 20;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80vh;
  padding: 30px 9px 0;
  background: #ffffff;
  box-shadow: 0px -1px 15px rgba(0, 0, 0, 0.08);
  border-radius: 27px 27px 0 0;

  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: $cyan;
    border-radius: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: #eee;
    border-radius: 8px;
  }

  .panel-title {
    margin-bottom: 20px;
    text-align: center;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
  }

  .scroll-wrapper {
    height: calc(100% - 95px);
    overflow: auto;
    padding: 0 7px 20px 0;
  }

  .panel-item {
    padding: 16px 7px;
    border-bottom: 1px solid #e2e2e2;

    &:first-child {
      padding-top: 0;
    }

    .panel-item-title {
      margin-bottom: 17px;
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      color: $dark-color;
    }

    .price-text {
      font-weight: 500;
      font-size: 16px;
      color: $dark-color;
    }

    input[type="text"] {
      width: 100%;
      height: 47px;
      padding: 0 10px;
      border: 1px solid #eee;
      border-radius: 5px;
      font-style: normal;
      font-weight: 400;
      font-size: 16px;

      &::placeholder {
        color: #808080;
      }

      &:focus {
        border: 1px solid $cyan;
      }
    }

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
  }

  .buttons {
    position: absolute;
    z-index: 10;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    padding: 20px;

    button {
      margin-left: 60px;
      background: transparent;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      color: $cyan;
      cursor: pointer;
    }

    &::before {
      content: '';
      position: absolute;
      bottom: 90%;
      left: 0;
      width: 100%;
      height: 40px;
      background: linear-gradient(180deg,
          rgba(255, 255, 255, 0.0001) 0%,
          #ffffff 50%);
      pointer-events: none;
    }
  }
}
</style>

