import { defineStore } from 'pinia'


interface filterData {
  price: number[],
  description: string,
  badroomNum: string[],
  bathroomNum: string,
  garageNum: string,
}
const useStore = defineStore('main', {
  state: () => ({
    filterData: {
      price: [200, 475] as number[],
      description: '',
      badroomNum: ['Any'] as string[],
      bathroomNum: 'Any',
      garageNum: 'Any',
    }
  }),

  actions: {
    getFilterData() {
      try {
        let localData = localStorage.getItem('filterData')
        if (localData !== null) {
          this.filterData = JSON.parse(localData)
        }
      } catch (error) {
        localStorage.removeItem('filterData')
      }

      return this.filterData
    },
    setFilterData(filterData: filterData) {
      this.filterData = filterData
      localStorage.setItem('filterData', JSON.stringify(filterData))
    }
  }
})

export default useStore

