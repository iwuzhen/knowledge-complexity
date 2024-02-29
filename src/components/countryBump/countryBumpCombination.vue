<script setup lang="ts">
import { scaleLinear } from 'd3-scale'
import _ from 'lodash'

interface Props {
  data: CountryRemoteDataType
  i18n: boolean
  yearDefault?: [number, number, number]
  valueFixed: number
}

const props = withDefaults(defineProps<Props>(), {
  yearDefault: () => [2000, 2010, 2020],
  valueFixed: () => 1,
})

// 三列的年份选择``
const viewYearSelect = ref(props.yearDefault)

// 每列展示数量
const viewCount = ref(20)

const view_more_button = ref(true)

function expendRank() {
  view_more_button.value = !view_more_button.value
  viewCount.value = Math.min(props.data.data.length, 200)
}
// const colors = computed(() => {
//   return colormap({
//     // colormap: 'rainbow',
//     // colormap: 'rainbow-soft',
//     colormap: 'bluered',
//     nshades: 60,
//     format: 'rgbaString',
//     alpha: 0.5,
//   })
//   // .reverse()
// })

const colorPool = [
  // 'rgba(0, 0, 255, 0.6)', // blue
  'rgba(255, 0, 0, 0.6)', // red
  // 'rgba(255, 206, 86, 0.6)', // yellow
  'rgba(75, 192, 192, 0.6)', // teal
  'rgba(153, 102, 255, 0.6)', // purple
  'rgba(255, 159, 64, 0.6)', // orange
  'rgba(54, 162, 235, 0.6)', // blue
  'rgba(0, 255, 0, 0.6)', // green
  'rgba(255, 99, 132, 0.6)', // red
  'rgba(255, 0, 255, 0.6)', // magenta
  'rgba(0, 255, 255, 0.6)', // cyan
  'rgba(127, 255, 212, 0.6)', // aqua

  'rgba(207, 70, 197, 0.6)', // purple
  'rgba(50, 20, 77, 0.6)', // dark purple
  'rgba(154, 150, 221, 0.6)', // light purple
  'rgba(255, 185, 15, 0.6)', // gold
  'rgba(253, 116, 115, 0.6)', // peach
  'rgba(36, 117, 70, 0.6)', // green
  'rgba(0, 94, 74, 0.6)', // dark teal
  'rgba(31, 178, 170, 0.6)', // aqua
  'rgba(247, 161, 68, 0.6)', // orange
  'rgba(255, 76, 104, 0.6)', // pink
  'rgba(158, 95, 16, 0.6)', // brown
  'rgba(198, 41, 133, 0.6)', // fuchsia
  'rgba(141, 161, 50, 0.6)', // lime
  'rgba(205, 128, 51, 0.6)', // tan
  'rgba(244, 194, 194, 0.6)', // light pink
  'rgba(85, 107, 47, 0.6)', // olive
]
const colors = scaleLinear()
  .domain(_.range(0, 560, 20))
  .range(colorPool as any)

// eslint-disable-next-line max-statements-per-line
const yearOptions = ref(_.range(1990, 2022, 1).map((item) => { return { value: item, label: item.toString() } }))
watchEffect(() => {
// eslint-disable-next-line max-statements-per-line
  yearOptions.value = _.range(props.data.year[0], props.data.year.slice(-1)[0] + 1, 1).map((item) => { return { value: item, label: item.toString() } })
})
// const { t } = useI18n()

// 需要过滤掉 rank 9999 的 gay
const country_array_1 = ref([{ name: 'US', rank: 1, score: 100, color: 'blue' }])
const country_array_2 = ref([{ name: 'US', rank: 1, score: 100, color: 'blue' }])
const country_array_3 = ref([{ name: 'US', rank: 1, score: 100, color: 'blue' }])

const countries = [country_array_1, country_array_2, country_array_3]

const country_line_1 = ref([{ source: 0, target: 1, color: 'blue' }])
const country_line_2 = ref([{ source: 0, target: 1, color: 'blue' }])
const countryLines = [country_line_1, country_line_2]

watchEffect(() => {
  const countryColor: Record<string, string> = {}
  // rank label
  viewYearSelect.value.forEach((value: number, column_index: number) => {
    // value: 2000 , column_index: 0
    // year_index: 10
    const year_index = props.data.year.indexOf(value)
    // 找出改 index 下的 top 20
    const countryRanks = props.data.rank.map((row) => {
      return row[year_index]
    })
    // 找到top 的index
    const CountryRankIndex = [...countryRanks.keys()]
      .sort((a, b) => {
        if (countryRanks[a] === null)
          return 1
        else if (countryRanks[b] === null)
          return -1
        else
          return (countryRanks[a] as number) - (countryRanks[b] as number)
      })
    // .slice(0, viewCount.value)
    const countryArrayCache: any = []

    CountryRankIndex.forEach((itemIndex, rankIndex) => {
      if (props.data.rank[itemIndex][year_index] === null)
        return
      if (column_index === 0)
        countryColor[props.data.legend[itemIndex]] = (colors(rankIndex) as any)
      if (props.data.rank[itemIndex][year_index] === 9999)
        return

      countryArrayCache.push({
        name: props.data.legend[itemIndex],
        // rank: rankIndex + 1,
        rank: props.data.rank[itemIndex][year_index],
        color: countryColor[props.data.legend[itemIndex]] || 'red',
        score: props.data.data[itemIndex][year_index]?.toFixed(props.valueFixed),
      })
    })
    countryArrayCache.sort((a: any, b: any) => a.rank - b.rank)
    countries[column_index].value = countryArrayCache.slice(0, viewCount.value)
  })

  // rank line
  for (const i of [0, 1]) {
    const rank_1 = new Map<string, Number>()
    const rank_2 = new Map<string, Number>()
    countries[i].value.forEach((row, index) => {
      // rank_1[countries[i].value[index].name] = index
      rank_1.set(countries[i].value[index].name, index)
    })
    countries[i + 1].value.forEach((row, index) => {
      rank_2.set(countries[i + 1].value[index].name, index)
      // rank_2[countries[i + 1].value[index].name] = index
    })

    const lineCache: any = []

    rank_1.forEach((value, key) => {
      const target = rank_2.get(key)
      if (target !== undefined)
        lineCache.push({ source: value, target, color: countryColor[key] })
      else
        lineCache.push({ source: value, target: -1, color: countryColor[key] })
    })

    rank_2.forEach((value, key) => {
      const target = rank_1.get(key)
      if (target === undefined)
        lineCache.push({ source: -1, target: value, color: countryColor[key] })
    })

    countryLines[i].value = lineCache
  }
})
</script>

<template>
  <n-grid cols="18" item-responsive responsive="screen" class="bump" mb-5 mt-5>
    <n-gi span="4">
      <n-select v-model:value="viewYearSelect[0]" :options="yearOptions" />
    </n-gi>

    <n-gi span="3" />
    <n-gi span="4">
      <n-select v-model:value="viewYearSelect[1]" :options="yearOptions" />
    </n-gi>

    <n-gi span="3" />
    <n-gi span="4">
      <n-select v-model:value="viewYearSelect[2]" :options="yearOptions" />
    </n-gi>
  </n-grid>
  <n-grid cols="18" item-responsive responsive="screen" class="bump">
    <n-gi span="4">
      <countryBumpItem v-for="{ name, rank, score, color } in country_array_1" :key="name" :name="name" :rank="rank" :value="score" :color="color" :i18n="props.i18n" />
    </n-gi>
    <n-gi span="3">
      <countryBumpLine :value="country_line_1" :length="viewCount" />
    </n-gi>
    <n-gi span="4">
      <countryBumpItem v-for="{ name, rank, score, color } in country_array_2" :key="name" :name="name" :rank="rank" :value="score" :color="color" :i18n="props.i18n" />
    </n-gi>
    <n-gi span="3">
      <countryBumpLine :value="country_line_2" :length="viewCount" />
    </n-gi>
    <n-gi span="4">
      <countryBumpItem v-for="{ name, rank, score, color } in country_array_3" :key="name" :name="name" :rank="rank" :value="score" :color="color" :i18n="props.i18n" />
    </n-gi>
  </n-grid>

  <n-space vertical>
    <n-button :show="view_more_button" type="warning" round @click="expendRank">
      view more
    </n-button>
  </n-space>
</template>

<style>
.bump {
  width: 550px;
}
</style>
