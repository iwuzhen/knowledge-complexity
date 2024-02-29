<script setup lang="ts">
import VChart from 'vue-echarts'
import { useWatcher } from 'alova'

import type { EChartsCoreOption } from 'echarts/core'
import { use } from 'echarts/core'

import {
  LineChart,
} from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'

import { getMAGSubjectDistance } from '~/api/methods/wikinikepai'

// const { t } = useI18n()
// generate alpha-2 : name

// const message = useMessage()
use([
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  DatasetComponent,
  GridComponent,
  LineChart,
  LegendComponent,
])

const SELECT_MAG_DATA = ['Biology', 'Chemistry', 'Computer science',
  'Economics', 'Engineering disciplines', 'History', 'Environmental science', 'Political science',
  'Mathematics', 'Medicine', 'Philosophy', 'Physics', 'Sociology', 'Psychology', 'Materials science', 'Geology', 'Geography']

const subjectOption = SELECT_MAG_DATA.map((item) => {
  return {
    label: item,
    value: item,
  }
})

const subjectSelected = ref('Physics')

const guidNationText = computed(() => {
  return '使用 Google 距离计算论文中的各个学科的距离，值越接近0，学科越相关'
})

const pageTags = ref('subject')

const { loading: paperLoading, onSuccess } = useWatcher(
  () => getMAGSubjectDistance(subjectSelected.value),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  [subjectSelected],
  {
    // 设置500ms防抖，如果keyword频繁变化，只有在停止变化后500ms才发送请求
    debounce: 500,
    initialData: { legend: [], data: [[]] },
    immediate: true,
  },
)

const option = ref<EChartsCoreOption>({
  title: {
    text: '论文变化趋势',
    left: 'center',
  },
})

function roundTo2(num: number) {
  if (num % 1 === 0)
    return num // integer
  return Math.round(num * 100) / 100
}

onSuccess((event: any) => {
  const data = event.data.data

  option.value = {
    title: {
      text: data.title,
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
          const _data = roundTo2(params[i].value[params[i].encode.y[0]])
          const _marker = params[i].marker
          showHtm += `<span style='font-size:12px; float:left'>${_marker}${_text}：</span><span style='font-size:12px; float:right'>${_data}</span><br>`
        }
        return showHtm
      },
      textStyle: {
        align: 'left',
      },
      order: 'valueDesc',
      // extraCssText: 'width: 170px',
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      data: data.legend,
    },
    dataset: {
      source: [data.x, ...data.y],
    },
    series: data.legend.map((name: string, index: number) => {
      return {
        name,
        type: 'line',
        // stack: 'Total',
        seriesLayoutBy: 'row',
        showSymbol: false,
        emphasis: {
          focus: 'series',
        },
        triggerLineEvent: true,
        // areaStyle: {},
        encode: {
          x: 0,
          y: index + 1,
        },
      }
    }),
  }

  // console.log('请求成功，响应数据为:', event.data)
  // console.log('本次请求的method实例为:', event.method)
  // console.log('响应数据是否来自缓存:', event.fromCache)
})
</script>

<template>
  <n-grid cols="10" x-gap="12" item-responsive responsive="screen">
    <n-gi span="8 m:4 l:3">
      <n-tabs v-model:value="pageTags" type="segment">
        <n-tab-pane name="subject" tab="论文学科">
          <n-alert type="info" :show-icon="false" mb-5>
            {{ guidNationText }}
          </n-alert>
          <n-form-item path="subject" label="目标学科:">
            <n-select v-model:value="subjectSelected" :options="subjectOption" />
          </n-form-item>
        </n-tab-pane>
      </n-tabs>
    </n-gi>
    <n-gi span="8 m:6 l:7">
      <n-tabs justify-content="space-evenly" type="line">
        <n-tab-pane name="chap2" tab="论文学科距离">
          <VChart
            :option="option" autoresize h-xl :loading="paperLoading "
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
