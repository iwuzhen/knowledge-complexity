<script setup lang="ts">
import VChart from 'vue-echarts'
import _ from 'lodash'

import { useRequest } from 'alova'

import type { EChartsCoreOption } from 'echarts/core'
import { registerMap, use } from 'echarts/core'
import {
  LineChart,
  MapChart,
} from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import {
  DatasetComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,

} from 'echarts/components'
import { get_subject_pci } from '~/api/methods/complexity'

import worldMap from '~/asset/world.json'
import countryName from '~/asset/countryName.json'

// generate alpha-2 : name
const countryNameMap = new Map<string, string>()
countryName.forEach((row) => {
  countryNameMap.set(row['alpha-2'], row.name)
})

use([
  SVGRenderer,
  LineChart,
  TitleComponent,
  GridComponent,
  DatasetComponent,
  TooltipComponent,
  LegendComponent,
  GeoComponent,
  VisualMapComponent,
  MapChart,
])

registerMap('world', (worldMap as any))

const { loading, data: chartData } = useRequest(
  () => get_subject_pci(),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  {
    initialData: { legend: [], rank: [], year: [], data: [] },
    immediate: true,
  },
)

// provide(THEME_KEY, 'dark')

const option = ref<EChartsCoreOption>({
  title: {
    text: '学科变化趋势',
    left: 'center',
  },
})
watchEffect(() => {
  option.value = {
    title: {
      text: '学科的复杂度逐年复杂度',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      position(pos: any, params: any, el: any, elRect: any, size: any) {
        const obj: any = { top: 30 }
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 130
        return obj
      },
      // extraCssText: 'width: 170px',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      type: 'value',
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      data: chartData.value.legend.slice(0, 20),
    },
    dataset: {
      source: [['year', ...chartData.value.year], ...chartData.value.legend.slice(0, 20).map((value, index) => { return [value, ...chartData.value.data[index]] })],
    },
    series: [
      ...chartData.value.legend.slice(0, 20).map((value, index) => {
        return {
          datasetIndex: 0,
          type: 'line',
          name: value,
          seriesLayoutBy: 'row',
          encode: {
            x: 0,
            y: index + 1,
          },
        }
      }),
    ],
  }
})

// eslint-disable-next-line max-statements-per-line
const yearOptions = ref(_.range(1990, 2022, 1).map((item) => { return { value: item, label: item.toString() } }))
watchEffect(() => {
// eslint-disable-next-line max-statements-per-line
  yearOptions.value = _.range(chartData.value.year[0], chartData.value.year.slice(-1)[0], 1).map((item) => { return { value: item, label: item.toString() } })
})

// table
const tableColumns: any = ref([
  {
    title: 'Country',
    key: 'country',
  },
  {
    title: 'Title',
    key: 'title',
  },
])

const tableData = ref([{ code: 'US', country: 'US', 2022: 100 }])
watchEffect(() => {
  tableColumns.value = [
    {
      title: 'Country',
      key: 'country',
      width: 150,
      render(row: any) {
        return h('div', { class: 'flex' }, [h('div', { class: 'mt-1 mb-1' }), h('div', { class: 'ml-1' }, row.country)])
      },
    },
    ..._.range(chartData.value.year.slice(-1)[0], chartData.value.year[0] - 1, -1).map((item) => { return { title: item.toString(), key: item.toString() } }),
  ]
  tableData.value = []
  chartData.value.legend.forEach((name, index) => {
    const dataRow: any = { code: name, country: name }
    chartData.value.year.forEach((year, yearIndex) => {
      dataRow[year] = chartData.value.data[index][yearIndex]
    })
    tableData.value.push(dataRow)
  })
})
</script>

<template>
  <n-grid cols="10" x-gap="12" item-responsive responsive="screen">
    <n-gi span="8 m:4 l:3">
      <div class="light-green" h-xs>
        学科稀缺度排名（论文）<br>
        （由于三级学科数量过多，此处只选取了排名较高的学科进行展示）<br>
      </div>
    </n-gi>
    <n-gi span="8 m:6 l:7">
      <n-tabs justify-content="space-evenly" type="line">
        <n-tab-pane name="chap1" tab="排名图">
          <countryBumpCombination :data="chartData" :i18n="false" :year-default="[2018, 2019, 2020]" />
        </n-tab-pane>
        <n-tab-pane name="chap2" tab="趋势图">
          <div class="green">
            <VChart
              :option="option" autoresize h-xl :loading="loading"
            />
          </div>
        </n-tab-pane>

        <n-tab-pane name="chap4" tab="数据表格">
          <n-data-table
            :columns="tableColumns"
            :data="tableData"
            :pagination="false"
            :bordered="true"
            :max-height="500"
            :scroll-x="3000"
            virtual-scroll
          />
        </n-tab-pane>
      </n-tabs>
    </n-gi>
    <n-gi span="8" />
  </n-grid>
</template>

<style scoped>
.light-green {
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 200px; */
  /* background-color: rgba(0, 128, 0, 0.12); */
}
.green {
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 200px; */
  /* background-color: rgba(0, 128, 0, 0.24); */
}
</style>
