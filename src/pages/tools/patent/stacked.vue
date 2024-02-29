<script setup lang="ts">
import VChart from 'vue-echarts'
import { useMessage } from 'naive-ui'
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

import { patent_ingredient_trend } from '~/api/methods/complexity'

const { t } = useI18n()
// generate alpha-2 : name

const message = useMessage()
use([
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  DatasetComponent,
  GridComponent,
  LineChart,
  LegendComponent,
])

// provide(THEME_KEY, 'dark')

const configForm = reactive({
  tags: 'country',
  mode: 'national_ipc',
  countryMain: ['US'],
  // countryPartner: [],
  flow: 'export',
})

const guidText = computed(() => {
  if (configForm.mode === 'national_ipc' && configForm.flow === 'patent')
    return '在1990-2020年范围内，目标国家公开专利的按 IPC 分类占比趋势' // '选中国家公布的专利，其IPC主分类中的构成情况'

  else if (configForm.mode === 'national_ipc' && configForm.flow === 'export')
    return '在1990-2020年范围内，目标国家公开专利（按 IPC 分类）被其他国家引用比例趋势' // '引用选中国家专利的其他国家专利，这部分其他国家专利的 IPC 主分类构成情况'

  else if (configForm.mode === 'national_ipc' && configForm.flow === 'import')
    return '在1990-2020年范围内，目标国家公开专利（按 IPC 分类）引用其他国家专利比例趋势' // '选中国家专利引用的其他国家专利，这部分其他国家专利的 IPC 主分类构成情况'

  else if (configForm.mode === 'national_between_countries' && configForm.flow === 'export')
    return '在1990-2020年范围内，其他国家引用目标国家公开专利的国家分布情况趋势' // '引用选中国家专利的其他国家专利，这部分其他国家分布情况'

  else if (configForm.mode === 'national_between_countries' && configForm.flow === 'import')
    return '在1990-2020年范围内，其他国家被目标国家公开专利引用的国家分布情况趋势' // '选中国家专利引用的其他国家专利，这部分其他国家分布情况'
})

const flowOption = ref([{ label: t('button.patent_count_switch_name'), value: 'patent' }, { label: t('button.reference_export_switch_name'), value: 'export' }, { label: t('button.reference_import_switch_name'), value: 'import' }])
watchEffect(() => {
  if (configForm.mode === 'national_ipc') {
    flowOption.value = [{ label: t('button.patent_count_switch_name'), value: 'patent' }, { label: t('button.reference_export_switch_name'), value: 'export' }, { label: t('button.reference_import_switch_name'), value: 'import' }]
  }
  else if (configForm.mode === 'national_between_countries') {
    flowOption.value = [{ label: t('button.reference_export_switch_name'), value: 'export' }, { label: t('button.reference_import_switch_name'), value: 'import' }]
    if (configForm.flow === 'patent')
      configForm.flow = 'export'
  }
})

const { loading, data: paperIngredientData } = useWatcher(
  () => patent_ingredient_trend(configForm.mode, configForm.flow, configForm.countryMain),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  [configForm],
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
watchEffect(() => {
  if (configForm.mode === 'national_between_countries' && configForm.flow === 'paper') {
    message.warning('Data not supported', { duration: 5000 })
    return
  }
  // title
  let title = ''
  if (configForm.mode === 'national_ipc') {
    const countries = configForm.countryMain.map(value => t(`country.${value}`)).join(',')

    if (configForm.flow === 'patent')
      title = t('chart.patent_stacked_ipc_reference_combine', { countries })
    else if (configForm.flow === 'export')
      title = t('chart.patent_stacked_ipc_export_combine', { countries })
    else if (configForm.flow === 'import')
      title = t('chart.patent_stacked_ipc_import_combine', { countries })
  }
  else if (configForm.mode === 'national_between_countries') {
    const countries = configForm.countryMain.map(value => t(`country.${value}`)).join(',')

    if (configForm.flow === 'export')
      title = t('chart.patent_stacked_country_export_combine', { countries })
    else if (configForm.flow === 'import')
      title = t('chart.patent_stacked_country_import_combine', { countries })
  }

  if (configForm.mode === 'national_between_countries') {
    // data = paperIngredientData.value.map((row) => {
    //   row.name = t(`country.${row.name}`)
    //   return row
    // })
  }

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
      data: paperIngredientData.value.legend,
    },
    dataset: {
      source: paperIngredientData.value.data,
    },
    series: paperIngredientData.value.legend.map((name, index) => {
      return {
        name,
        type: 'line',
        stack: 'Total',
        smooth: true,
        seriesLayoutBy: 'row',
        showSymbol: false,
        emphasis: {
          focus: 'series',
        },
        triggerLineEvent: true,
        areaStyle: {},
        encode: {
          x: 0,
          y: index + 1,
        },
      }
    }),
  }
})
</script>

<template>
  <n-grid cols="10" x-gap="12" item-responsive responsive="screen">
    <n-gi span="8 m:4 l:3">
      <n-tabs type="segment" :default-value="configForm.tags">
        <n-tab-pane name="country" tab="国家">
          <n-alert type="info" :show-icon="false" mb-5>
            {{ guidText }}
          </n-alert>
          <n-form-item path="country" label="国家:">
            <TheCountrySelect v-model="configForm.countryMain" placeholder="select a country..." />
          </n-form-item>
          <!-- <n-form-item path="partner" label="Partner:">
            <TheCountrySelect v-model="configForm.countryPartner" placeholder="select a partner..." />
          </n-form-item> -->
          <n-form-item path="mode" label="对象:">
            <n-select
              v-model:value="configForm.mode"
              :options="[{ label: 'IPC 主分类', value: 'national_ipc' }, { label: '国家', value: 'national_between_countries' }]"
            />
          </n-form-item>
          <n-form-item path="flow" label="关系:">
            <n-select
              v-model:value="configForm.flow"
              :options="flowOption"
            />
          </n-form-item>

          <n-popover trigger="hover">
            <template #trigger>
              <n-button>IPC 主分类说明</n-button>
            </template>

            <n-alert :show-icon="false" mb-5>
              IPC 主分类的简要说明：
              <br> A类：人类生活的必需品，例如食品、纺织品、家具、化妆品等。
              <br> B类：人类生活的日常活动，例如运输、卫生、娱乐、体育等。
              <br> C类：化学和冶金领域，例如化学制剂、颜料、金属合金等。
              <br> D类：纺织和造纸领域，例如纺织品、纺织机械、纸张制品等。
              <br> E类：建筑和固定结构领域，例如建筑物、道路、桥梁、管道等。
              <br> F类：机械工程领域，例如发动机、机床、制冷设备、工具等。
              <br> G类：物理领域，例如光学、声学、测量仪器、电子设备等。
              <br> H类：电气领域，例如电路、电器、通信技术、计算机技术等。
            </n-alert>
          </n-popover>
        </n-tab-pane>
        <n-tab-pane name="ipc" tab="IPC" :disabled="true">
          placeholder
        </n-tab-pane>
      </n-tabs>
    </n-gi>
    <n-gi span="8 m:6 l:7">
      <n-tabs justify-content="space-evenly" type="line">
        <n-tab-pane name="chap2" tab="随时间变化的构成比例图">
          <VChart
            :option="option" autoresize h-xl :loading="loading"
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
