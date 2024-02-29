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

import { paper_ingredient_trend, subject_ingredient_trend } from '~/api/methods/complexity'

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
  mode: 'national_academic_disciplines',
  countryMain: ['US'],
  // countryPartner: [],
  flow: 'export',
})

const configSubjectForm = reactive({
  mode: 'national_academic_disciplines',
  subjectMain: ['Chip'],
  flow: 'export',
})

const guidNationText = computed(() => {
  if (configForm.mode === 'national_academic_disciplines' && configForm.flow === 'paper')
    return '在1980-2022年范围内，目标国家发表的论文按学科分类占比趋势'

  else if (configForm.mode === 'national_academic_disciplines' && configForm.flow === 'export')
    return '在1980-2022年范围内，其他国家论文（分学科）引用目标国家论文的情况趋势' // '在1980-2022年范围内，目标国家发表的论文（分学科）被其他国家引用比例趋势'

  else if (configForm.mode === 'national_academic_disciplines' && configForm.flow === 'import')
    return '在1980-2022年范围内 其他国家论文（分学科）被目标国家论文引用的情况趋势' // '在1980-2022年范围内，目标国家发表的论文（分学科）引用其他国家论文比例趋势'

  else if (configForm.mode === 'national_between_countries' && configForm.flow === 'export')
    return '在1980-2022年范围内，目标国家发表的论文被哪些国家引用趋势' // '在1980-2022年范围内，目标国家发表的论文引用的其他国家趋势'

  else if (configForm.mode === 'national_between_countries' && configForm.flow === 'import')
    return '在1980-2022年范围内，目标国家发表的论文引用的其他国家趋势' // '在1980-2022年范围内，引用目标国家发表论文的其他国家趋势'
})

const pageTags = ref('country')

const flowOption = ref([{ label: t('button.reference_count_switch_name'), value: 'paper' }, { label: t('button.reference_export_switch_name'), value: 'export' }, { label: t('button.reference_import_switch_name'), value: 'import' }])
watchEffect(() => {
  if (configForm.mode === 'national_academic_disciplines') {
    flowOption.value = [{ label: t('button.reference_count_switch_name'), value: 'paper' }, { label: t('button.reference_export_switch_name'), value: 'export' }, { label: t('button.reference_import_switch_name'), value: 'import' }]
  }
  else if (configForm.mode === 'national_between_countries') {
    flowOption.value = [{ label: t('button.reference_export_switch_name'), value: 'export' }, { label: t('button.reference_import_switch_name'), value: 'import' }]
    if (configForm.flow === 'paper')
      configForm.flow = 'export'
  }
})

const { loading: paperLoading, data: paperIngredientData } = useWatcher(
  () => paper_ingredient_trend(configForm.mode, configForm.flow, configForm.countryMain),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  [configForm],
  {
    // 设置500ms防抖，如果keyword频繁变化，只有在停止变化后500ms才发送请求
    debounce: 500,
    initialData: { legend: [], data: [[]] },
    immediate: true,
  },
)

const { loading: subjectLoading, data: subjectIngredientData } = useWatcher(
  () => subject_ingredient_trend(configSubjectForm.mode, configSubjectForm.flow, configSubjectForm.subjectMain),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  [configSubjectForm],
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

function PaperTagChange() {
  if (pageTags.value !== 'country')
    return
  if (configForm.mode === 'national_between_countries' && configForm.flow === 'paper') {
    message.warning('Data not supported', { duration: 5000 })
    return
  }
  // title
  let title = ''
  if (configForm.mode === 'national_academic_disciplines') {
    const countries = configForm.countryMain.map(value => t(`country.${value}`)).join(',')

    if (configForm.flow === 'paper')
      title = t('chart.paper_stacked_academic_reference_combine', { countries })
    else if (configForm.flow === 'export')
      title = t('chart.paper_stacked_academic_export_combine', { countries })
    else if (configForm.flow === 'import')
      title = t('chart.paper_stacked_academic_import_combine', { countries })
  }
  else if (configForm.mode === 'national_between_countries') {
    const countries = configForm.countryMain.map(value => t(`country.${value}`)).join(',')

    if (configForm.flow === 'export')
      title = t('chart.paper_stacked_country_export_combine', { countries })
    else if (configForm.flow === 'import')
      title = t('chart.paper_stacked_country_import_combine', { countries })
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
}

function SubjectTagChange() {
  if (pageTags.value !== 'subject')
    return
  if (configSubjectForm.mode === 'national_between_countries' && configSubjectForm.flow === 'paper') {
    message.warning('Data not supported', { duration: 5000 })
    return
  }
  // title
  let title = ''
  if (configSubjectForm.mode === 'national_academic_disciplines') {
    const subjects = configSubjectForm.subjectMain.join(',')

    if (configSubjectForm.flow === 'paper')
      title = t('chart.tree_map_paper_subject_country_reference_combine', { subjects, years: '1990-2022' })
    else if (configSubjectForm.flow === 'export')
      title = t('chart.tree_map_paper_subject_country_export_combine', { subjects, years: '1990-2022' })
    else if (configSubjectForm.flow === 'import')
      title = t('chart.tree_map_paper_subject_country_import_combine', { subjects, years: '1990-2022' })
  }
  else if (configSubjectForm.mode === 'national_between_countries') {
    const subjects = configSubjectForm.subjectMain.join(',')

    if (configSubjectForm.flow === 'export')
      title = t('chart.paper_stacked_country_export_combine', { subjects })
    else if (configSubjectForm.flow === 'import')
      title = t('chart.paper_stacked_country_import_combine', { subjects })
  }

  let legend = subjectIngredientData.value.legend
  if (configSubjectForm.mode === 'national_academic_disciplines') {
    legend = subjectIngredientData.value.legend.map((row) => {
      return t(`country.${row}`)
    })
  }

  option.value = {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      renderMode: 'html',
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
      textStyle: {
        align: 'left',
      },
      extraCssText: 'width: 320px',
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
      data: legend,
    },
    dataset: {
      source: subjectIngredientData.value.data,
    },
    series: legend.map((name, index) => {
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
}

watch(paperIngredientData, () => {
  PaperTagChange()
})

watch(subjectIngredientData, () => {
  SubjectTagChange()
})

watch(pageTags, () => {
  SubjectTagChange()
  PaperTagChange()
})
</script>

<template>
  <n-grid cols="10" x-gap="12" item-responsive responsive="screen">
    <n-gi span="8 m:4 l:3">
      <n-tabs v-model:value="pageTags" type="segment">
        <n-tab-pane name="country" tab="国家">
          <n-alert type="info" :show-icon="false" mb-5>
            {{ guidNationText }}
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
              :options="[{ label: '学科', value: 'national_academic_disciplines' }, { label: '国家', value: 'national_between_countries' }]"
            />
          </n-form-item>
          <n-form-item path="flow" label="关系:">
            <n-select
              v-model:value="configForm.flow"
              :options="flowOption"
            />
          </n-form-item>
        </n-tab-pane>
        <n-tab-pane name="subject" tab="学科" disabled>
          <n-alert type="info" :show-icon="false" mb-5>
            subject stacked
          </n-alert>
          <n-form-item path="subject" label="Subject:">
            <ThePaperSubjectSelect v-model="configSubjectForm.subjectMain" placeholder="select a subject..." />
          </n-form-item>
          <!-- <n-form-item path="partner" label="Partner:">
            <TheCountrySelect v-model="configForm.countryPartner" placeholder="select a partner..." />
          </n-form-item> -->
          <n-form-item path="mode" label="Mode:">
            <n-select
              v-model:value="configSubjectForm.mode"
              :options="[{ label: '学科', value: 'national_academic_disciplines' }]"
            />
          </n-form-item>
          <n-form-item path="flow" label="Flow:">
            <n-select
              v-model:value="configSubjectForm.flow"
              :options="flowOption"
            />
          </n-form-item>
        </n-tab-pane>
      </n-tabs>
    </n-gi>
    <n-gi span="8 m:6 l:7">
      <n-tabs justify-content="space-evenly" type="line">
        <n-tab-pane name="chap2" tab="随时间变化的构成比例图">
          <VChart
            :option="option" autoresize h-xl :loading="paperLoading || subjectLoading"
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
