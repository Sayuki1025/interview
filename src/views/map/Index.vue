<template>
  <div class="map-page">
    <div class="search-bar">
      <div class="back-icon">
        <img src="@/assets/image/back.svg" />
      </div>
      <div class="search-input">
        <img src="@/assets/image/search.svg" class="search-icon" />
        <input type="text" placeholder="Search" v-model="keyWord" />
        <div class="clear-btn" v-if="keyWord !== ''" @click="keyWord = ''">
          <img src="@/assets/image/cross.svg" class="" />
        </div>
      </div>
      <div class="watch-btn">
        <img src="@/assets/image/watch.svg" />
        <span>Watch</span>
      </div>
    </div>
    <div class="dropdown-bar">
      <div class="dropdown-item"><span>All Property Types</span></div>
      <div class="dropdown-item">
        <span class="marker sale-color"></span>
        <span>3d</span>
        <span class="marker sold-color"></span>
        <span>3d</span>
      </div>
      <div class="dropdown-item" :class="{ 'select-drop': panelVis }" @click="panelVis = true"><span>Filters</span>
      </div>
    </div>
    <main class="map-box">
      <div class="map-container" id="google-map"></div>
      <article class="map-widget">
        <div class="map-widget-item sale-color">For Sale</div>
        <div class="map-widget-item sold-color">Sold</div>
        <div class="map-widget-item">De-listed</div>
      </article>
      <article class="location-btn">
        <img src="@/assets/image/location.svg" />
      </article>
    </main>
    <div class="mask" v-if="panelVis" @click="closePanel"></div>
    <FilterPanel v-if="panelVis" @applyPanel="applyPanel" />

    <div class="alert" v-if="alertVis" @click="alertVis = false">
      <span>{{ alert }}</span>
      <span>点击以关闭</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, onMounted, onBeforeUnmount } from 'vue'
import FilterPanel from './components/FilterPanel.vue'

import { Loader } from '@googlemaps/js-api-loader'

import mapData from '@/assets/json/map-data.json'
import markerIcon from '@/assets/image/marker.png'


const state = reactive({
  panelVis: false,
  keyWord: '',
  google: {},
  map: {} as google.maps.Map,
  bounds: {} as google.maps.LatLngBounds,
  alert: '',
  alertVis: false,
})

const { panelVis, keyWord, alert, alertVis } = toRefs(state)

const initMap = async () => {
  const loader = new Loader({
    apiKey: import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY,
    version: 'weekly',
    libraries: ['places'],
  })

  state.google = await loader.load()
  state.map = new google.maps.Map(
    document.getElementById('google-map') as HTMLElement,
    {
      center: { lat: 48.998634, lng: -123.024824 },
      disableDefaultUI: true,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
      zoom: 11,
    }
  )
}
const handleLoadMarkers = async () => {
  state.bounds = new google.maps.LatLngBounds()
  mapData.forEach(point => {
    let latLng = new google.maps.LatLng(point.location.lat, point.location.lon)
    new google.maps.Marker({
      position: latLng,
      map: state.map,
      icon: {
        url: markerIcon,
      },
      label: {
        text: point.label,
        className: 'marker-label',
        color: '#fff',
        fontFamily: 'Poppins',
        fontSize: '14px',
        fontWeight: '600',
      },
    })
    state.bounds.extend(latLng)
  })
  state.map.fitBounds(state.bounds)
}
const onResize = () => {
  state.map.fitBounds(state.bounds)
}

const closePanel = () => {
  state.panelVis = false
}
const applyPanel = (alert: string) => {
  state.alertVis = true
  state.alert = alert
  closePanel()
}

onMounted(async () => {
  await initMap()
  handleLoadMarkers()
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})
</script>
<style lang="scss" scoped>
.map-page {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  font-family: $font;

  .search-bar {
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    background-color: $cyan;

    .back-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 44px;
      cursor: pointer;
    }

    .search-input {
      flex: 1;
      display: flex;
      align-items: center;
      height: 40px;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
      padding: 0 10px 0 16px;
      overflow: hidden;
      font-family: $font;
      font-style: normal;
      font-weight: 500;

      input {
        flex: 1;
        width: 100%;
        margin: 0 10px;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #ffffff;
        background: transparent;
        outline: none;

        &::placeholder {
          color: #ffffff;
        }
      }

      .clear-btn {
        flex: 0 0 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
      }
    }

    .watch-btn {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 16px;
      cursor: pointer;

      span {
        margin-left: 10px;

        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 21px;
        color: #ffffff;
      }
    }
  }

  .dropdown-bar {
    display: flex;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 16px;
    background-color: $cyan;

    .dropdown-item {
      position: relative;
      display: flex;
      align-items: center;
      height: 30px;
      padding: 0 25px 0 10px;
      border: 1px solid #ffffff;
      border-radius: 33px;
      cursor: pointer;

      span {
        font-weight: 600;
        font-size: 14px;
        line-height: 21px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #ffffff;
      }

      &::after {
        content: '';
        position: absolute;
        right: 10px;
        display: block;
        width: 7px;
        height: 4px;
        background: url('@/assets/image/dropdown.svg') no-repeat;
      }

      &:first-child {
        flex: 1;
        width: 36%;
      }

      &+.dropdown-item {
        margin-left: 10px;
      }

      &.select-drop {
        background: #ffffff;

        &::after {
          background: url('@/assets/image/dropdown-s.svg') no-repeat;
        }

        span {
          color: $cyan;
        }

      }
    }

    .marker {
      width: 11px;
      height: 11px;
      margin-right: 5px;
      border: 1.5px solid #ffffff;
      box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
      border-radius: 50%;

      &.sale-color {
        background: $cyan;
      }

      &.sold-color {
        margin-left: 10px;
        background: $sold-color;
      }
    }
  }

  .map-box {
    flex: 1 1 100%;
    position: relative;
    width: 100%;

    .map-widget {
      position: absolute;
      z-index: 10;
      top: 16px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      justify-content: center;
      width: fit-content;
      margin: 0 auto;
      border-radius: 6px;
      box-shadow: 0px 5px 25px rgba(55, 58, 64, 0.144475);

      .map-widget-item {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        height: 38px;
        padding: 0 16px;
        background: #ffffff;
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        color: #808080;
        cursor: pointer;

        &:first-child {
          border-radius: 6px 0 0 6px;
        }

        &:last-child {
          border-radius: 0 6px 6px 0;
        }

        &.sale-color {
          color: #ffffff;
          background: $cyan;
        }

        &.sold-color {
          color: #ffffff;
          background: $sold-color;
        }
      }
    }

    .location-btn {
      position: absolute;
      right: 17px;
      bottom: 35px;
      z-index: 10;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 47px;
      height: 47px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 50%;
      font-weight: 500;
      font-size: 22px;
      background: white;
      cursor: pointer;
    }
  }

  .map-container {
    width: 100%;
    height: 100%;
  }

  .alert {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 20;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 200px;
    height: 100px;
    background: #fff;
    box-shadow: 0px 5px 25px rgba(55, 58, 64, 0.144475);
  }
}

.mask {
  position: absolute;
  z-index: 10;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  transition: background 0.2s ease;
}
</style>
<style lang="scss">
.marker-label {
  line-height: 21px;
  position: relative;
  bottom: 5px;
}
</style>
