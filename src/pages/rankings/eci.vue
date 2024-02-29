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
  TimelineComponent,
  TitleComponent, TooltipComponent,
  VisualMapComponent,

} from 'echarts/components'
import { get_country_eci } from '~/api/methods/complexity'

import worldMap from '~/asset/world.json'
import countryName from '~/asset/countryName.json'

const { t } = useI18n()
// generate alpha-2 : name
const countryNameMap = new Map<string, string>()
countryName.forEach((row) => {
  countryNameMap.set(row['alpha-2'], row.name)
})

use([
  SVGRenderer,
  LineChart,
  TitleComponent,
  TimelineComponent,
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
  () => get_country_eci(),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  {
    initialData: { legend: [], rank: [], year: [], data: [] },
    immediate: true,
  },
)

// provide(THEME_KEY, 'dark')

const option = ref<EChartsCoreOption>({
  title: {
    text: '论文变化趋势',
    left: 'center',
  },
})
watchEffect(() => {
  const title = '不同国家知识复杂度逐年迭代值'

  option.value = {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      position(pos: any, params: any, el: any, elRect: any, size: any) {
        const obj: any = { top: 30 }
        obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 130
        return obj
      },
      formatter(params: any) {
        params.sort((x: any, y: any) => {
          const xv = x.value[x.encode.y[0]]
          const yv = y.value[y.encode.y[0]]
          if (xv === undefined)
            return -1
          return yv - xv
        })
        let showHtm = ` ${params[0].name}<br>`
        for (let i = 0; i < params.length; i++) {
          if (params[i].data === undefined)
            continue

          const _text = params[i].seriesName
          const _data = params[i].value[params[i].encode.y[0]]
          const _marker = params[i].marker
          showHtm += `<span style='font-size:12px; float:left'>${_marker}${_text}：</span><span style='font-size:12px; float:right'>${_data}</span><br>`
        }
        return showHtm
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

const mapOption = ref<any>({
  baseOption: {

    timeline: {
      axisType: 'category',
      orient: 'vertical',
      autoPlay: true,
      inverse: true,
      playInterval: 1000,
      left: null,
      right: 0,
      top: 20,
      bottom: 20,
      width: 55,
      height: null,
      symbol: 'none',
      checkpointStyle: {
        borderWidth: 2,
      },
      controlStyle: {
        showNextBtn: false,
        showPrevBtn: false,
      },
      data: [],
    },
    title: {
      text: '专利知识复杂度变化趋势',
      left: 'center',
    },
  },
  options: [],
})

watchEffect(() => {
  const yearIndex = chartData.value.year.indexOf(2015)

  // 当年的 范围，需要调整为所有时间的范围
  const countryValues = chartData.value.data.filter(x => x !== null).map((row) => {
    return row[yearIndex] as number
  })

  mapOption.value.baseOption.title = {
    text: '知识复杂度在世界上的分布',
    left: 'center',
  }

  const matrix = chartData.value.data
  let max = -Infinity
  let min = Infinity

  for (let i = 0; i < matrix.length; i++) {
    max = Math.max(max, ...matrix[i].filter(x => x !== null).map(item => item as number))
    min = Math.min(min, ...matrix[i].filter(x => x !== null).map(item => item as number))
  }

  mapOption.value.baseOption.visualMap = {
    left: 'center',
    top: 'bottom',
    itemHeight: 680,
    orient: 'horizontal',
    precision: 4,
    min,
    max,
    inRange: {
      color: [
        '#313695',
        '#4575b4',
        '#74add1',
        '#abd9e9',
        '#e0f3f8',
        '#ffffff',
        '#ffffbf',
        '#fee090',
        '#fdae61',
        '#f46d43',
        '#d73027',
        '#a50026',
      ],
    },
    text: ['High', 'Low'],
    calculable: true,
  }
  mapOption.value.baseOption.series = [
    {
      name: 'World',
      type: 'map',
      roam: true,
      map: 'world',
      projection: {
        project: (point: number[]) => [point[0] / 180 * Math.PI, -Math.log(Math.tan((Math.PI / 2 + point[1] / 180 * Math.PI) / 2))],
        unproject: (point: number[]) => [point[0] * 180 / Math.PI, 2 * 180 / Math.PI * Math.atan(Math.exp(point[1])) - 90],
      },
      data: chartData.value.legend.map((name, index) => {
        return {
          name: countryNameMap.get(name),
          value: countryValues[index],
        }
      }),
    }]

  chartData.value.year.forEach((year, index) => {
    mapOption.value.baseOption.timeline.data.push(year)
    const countryValues = chartData.value.data.filter(x => x !== null).map((row) => {
      return row[index] as number
    })
    mapOption.value.options.push({
      title: {

        text: `${year} 年知识复杂度(论文)在世界上的变化`,
        left: 'center',
      },
      series: [
        {
          name: 'World',
          type: 'map',
          roam: true,
          map: 'world',
          projection: {
            project: (point: number[]) => [point[0] / 180 * Math.PI, -Math.log(Math.tan((Math.PI / 2 + point[1] / 180 * Math.PI) / 2))],
            unproject: (point: number[]) => [point[0] * 180 / Math.PI, 2 * 180 / Math.PI * Math.atan(Math.exp(point[1])) - 90],
          },
          data: chartData.value.legend.map((name, index) => {
            return {
              name: countryNameMap.get(name),
              value: countryValues[index],
            }
          }),
        }],
    })
  })
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
        return h('div', { class: 'flex' }, [h('div', { i: `flag-${row.code.toLowerCase()}-4x3`, class: 'mt-1 mb-1' }), h('div', { class: 'ml-1' }, row.country)])
      },
    },
    ..._.range(chartData.value.year.slice(-1)[0], chartData.value.year[0] - 1, -1).map((item) => { return { title: item.toString(), key: item.toString() } }),
  ]
  tableData.value = []
  chartData.value.legend.forEach((name, index) => {
    const dataRow: any = { code: name, country: t(`country.${name}`) }
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
        知识复杂度（论文）排名 <br>
        <!-- rank <br> -->
      </div>
    </n-gi>
    <n-gi span="8 m:6 l:7">
      <n-tabs justify-content="space-evenly" type="line">
        <n-tab-pane name="chap1" tab="排名图">
          <countryBumpCombination :data="chartData" :i18n="true" :value-fixed="3" />
        </n-tab-pane>
        <n-tab-pane name="chap2" tab="趋势图">
          <div class="green">
            <VChart
              :option="option" autoresize h-xl :loading="loading"
            />
          </div>
        </n-tab-pane>
        <n-tab-pane name="chap3" tab="全球变化">
          <VChart
            :option="mapOption" autoresize h-xl :loading="loading"
          />
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
