<script setup lang="ts">
import VChart from 'vue-echarts'
import { useMessage } from 'naive-ui'
import { useWatcher } from 'alova'

import type { EChartsCoreOption } from 'echarts/core'
import { format, use } from 'echarts/core'

import {
  TreemapChart,
} from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,

} from 'echarts/components'
import _ from 'lodash'
import { paper_ingredient, paper_subject_ingredient } from '~/api/methods/complexity'

import { getLevelOption } from '~/utils'

// const router = useRouter()
// const formData = router.currentRoute.value.query.form
// console.log('formData', formData)

const { t } = useI18n()
// generate alpha-2 : name

const message = useMessage()
use([
  SVGRenderer,
  TitleComponent,
  TooltipComponent,
  TreemapChart,
  VisualMapComponent,
])

// provide(THEME_KEY, 'dark')

const configForm = reactive({
  mode: 'national_academic_disciplines',
  countryMain: ['US'],
  // countryPartner: [],
  flow: 'export',
  year: 2020,
})

const guidNationText = computed(() => {
  if (configForm.mode === 'national_academic_disciplines' && configForm.flow === 'paper')
    return '在选定时间范围内，目标国家发表的论文按学科分类占比'

  else if (configForm.mode === 'national_academic_disciplines' && configForm.flow === 'export')
    return '在选定时间范围内，其他国家论文（分学科）引用目标国家论文的情况' // '在选定时间范围内，引用目标国家论文的其他国家论文（分学科）引用比例' // '在选定时间范围内，目标国家发表的论文（分学科）被其他国家引用比例'

  else if (configForm.mode === 'national_academic_disciplines' && configForm.flow === 'import')
    return '在选定时间范围内 其他国家论文（分学科）被目标国家论文引用的情况' // '在选定时间范围内，目标国家发表的论文（分学科）引用其他国家论文比例'

  else if (configForm.mode === 'national_between_countries' && configForm.flow === 'export')
    return '在选定时间范围内，目标国家发表的论文被哪些国家引用' // '在选定时间范围内，目标国家发表的论文引用的其他国家'

  else if (configForm.mode === 'national_between_countries' && configForm.flow === 'import')
    return '在选定时间范围内，目标国家发表的论文引用的其他国家' // '在选定时间范围内，引用目标国家发表论文的其他国家'
})

const configSubjectForm = reactive({
  mode: 'national_academic_disciplines',
  subjectMain: ['Chip'],
  // countryPartner: [],
  flow: 'export',
  year: 2020,
})

const pageTags = ref('country')

const flowOption = ref([{ label: t('button.reference_count_switch_name'), value: 'paper' }, { label: t('button.reference_export_switch_name'), value: 'export' }, { label: t('button.reference_import_switch_name'), value: 'import' }])
watch(() => configForm.mode, () => {
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
  () => paper_ingredient(configForm.mode, configForm.flow, configForm.countryMain, [configForm.year]),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  [configForm],
  {
    // 设置500ms防抖，如果keyword频繁变化，只有在停止变化后500ms才发送请求
    debounce: 500,
    initialData: [],
    immediate: true,
  },
)

const { loading: subjectLoading, data: paperSubjectIngredientData } = useWatcher(
  () => paper_subject_ingredient(configSubjectForm.mode, configSubjectForm.flow, configSubjectForm.subjectMain, [configSubjectForm.year]),
  // 被监听的状态数组，这些状态变化将会触发一次请求
  [configSubjectForm],
  {
    // 设置500ms防抖，如果keyword频繁变化，只有在停止变化后500ms才发送请求
    debounce: 500,
    initialData: [],
    immediate: true,
  },
)

const option = ref<EChartsCoreOption>({
  title: {
    text: '论文变化趋势',
    left: 'center',
  },
})
const percent = (num: number) => `${(num * 100).toFixed(1)}%`

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
    const years = configForm.year
    if (configForm.flow === 'paper')
      title = t('chart.academic_reference_combine', { countries, years })
    else if (configForm.flow === 'export')
      title = t('chart.academic_export_combine', { countries, years })
    else if (configForm.flow === 'import')
      title = t('chart.academic_import_combine', { countries, years })
  }
  else if (configForm.mode === 'national_between_countries') {
    const countries = configForm.countryMain.map(value => t(`country.${value}`)).join(',')
    const years = configForm.year
    if (configForm.flow === 'export')
      title = t('chart.country_export_combine', { countries, years })
    else if (configForm.flow === 'import')
      title = t('chart.country_import_combine', { countries, years })
  }

  let data = paperIngredientData.value
  if (configForm.mode === 'national_between_countries') {
    data = paperIngredientData.value.map((row) => {
      row.name = t(`country.${row.name}`)
      return row
    })
  }
  // 计算 value sum
  let dataSum = 0
  data.forEach((row) => {
    dataSum += row.value
  })
  option.value = {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      formatter(info: any) {
        const value = info.value
        const treePathInfo = info.treePathInfo
        const treePath = []

        for (let i = 1; i < treePathInfo.length; i++)
          treePath.push(treePathInfo[i].name)

        return [
          `<div class="tooltip-title">${
               format.encodeHTML(treePath.join('/'))
               } ${percent(value / dataSum)}</div>`,
          `<div> Count: ${format.addCommas(value)} </div> `,
        ].join('')
      },
    },
    series: {
      type: 'treemap',
      leafDepth: 1,
      data,
      levels: getLevelOption(),
      label: {
        show: true,
        formatter: (params: any) => {
          return `${params.data.name} : ${percent(params.data.value / dataSum)}`
        },
      },
    },
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
    const years = configSubjectForm.year
    if (configSubjectForm.flow === 'paper')
      title = t('chart.tree_map_paper_subject_country_reference_combine', { subjects, years })
    else if (configSubjectForm.flow === 'export')
      title = t('chart.tree_map_paper_subject_country_import_combine', { subjects, years })
    else if (configSubjectForm.flow === 'import')
      title = t('chart.tree_map_paper_subject_country_import_combine', { subjects, years })
  }
  else if (configSubjectForm.mode === 'national_between_countries') {
    const subjects = configSubjectForm.subjectMain.join(',')
    const years = configSubjectForm.year
    if (configSubjectForm.flow === 'export')
      title = t('chart.country_export_combine', { subjects, years })
    else if (configSubjectForm.flow === 'import')
      title = t('chart.country_import_combine', { subjects, years })
  }

  let data = paperSubjectIngredientData.value
  if (configSubjectForm.mode === 'national_academic_disciplines') {
    data = paperSubjectIngredientData.value.map((row) => {
      row.name = t(`country.${row.name}`)
      return row
    })
  }
  // 计算 value sum
  let dataSum = 0
  data.forEach((row) => {
    dataSum += row.value
  })
  option.value = {
    title: {
      text: title,
      left: 'center',
    },
    tooltip: {
      formatter(info: any) {
        const value = info.value
        const treePathInfo = info.treePathInfo
        const treePath = []

        for (let i = 1; i < treePathInfo.length; i++)
          treePath.push(treePathInfo[i].name)

        return [
          `<div class="tooltip-title">${
               format.encodeHTML(treePath.join('/'))
               } ${percent(value / dataSum)}</div>`,
          `<div> Count: ${format.addCommas(value)} </div> `,
        ].join('')
      },
    },
    series: {
      type: 'treemap',
      leafDepth: 1,
      data,
      levels: getLevelOption(),
      label: {
        show: true,
        formatter: (params: any) => {
          return `${params.data.name} : ${percent(params.data.value / dataSum)}`
        },
      },
    },
  }
}

watch(paperIngredientData, () => {
  PaperTagChange()
})

watch(paperSubjectIngredientData, () => {
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
        <!-- <n-tab-pane :tab="t('tools.paper_tree_map_country')" name="country"> -->
        <n-tab-pane tab="国家" name="country">
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
          <n-form-item path="year" label="年份:">
            <n-select
              v-model:value="configForm.year"
              :options="_.range(1980, 2023, 1).map((value:number) => { return { label: value.toString(), value } })"
            />
          </n-form-item>
          <!-- <n-button type="primary" @click="console.log(configForm.flow)">
            build tree
          </n-button> -->
        </n-tab-pane>
        <!-- <n-tab-pane :tab="t('tools.paper_tree_map_subject')" name="subject" disabled> -->
        <n-tab-pane tab="学科" name="subject" disabled>
          <n-alert type="info" :show-icon="false" mb-5>
            subject tree map
          </n-alert>
          <n-form-item path="subject" label="Subject:">
            <ThePaperSubjectSelect v-model="configSubjectForm.subjectMain" placeholder="select a subject..." />
          </n-form-item>
          <!-- <n-form-item path="partner" label="Partner:">
            <TheCountrySelect v-model="configForm.countryPartner" placeholder="select a partner..." />
          </n-form-item> -->
          <n-form-item path="mode" label="对象:">
            <n-select
              v-model:value="configSubjectForm.mode"
              :options="[{ label: 'academic', value: 'national_academic_disciplines' }]"
            />
          </n-form-item>
          <n-form-item path="flow" label="关系:">
            <n-select
              v-model:value="configSubjectForm.flow"
              :options="flowOption"
            />
          </n-form-item>
          <n-form-item path="year" label="Year:">
            <n-select
              v-model:value="configSubjectForm.year"
              :options="_.range(1980, 2023, 1).map((value:number) => { return { label: value.toString(), value } })"
            />
          </n-form-item>
          <!-- <n-button type="primary" @click="console.log(configForm.flow)">
            build tree
          </n-button> -->
        </n-tab-pane>
      </n-tabs>
    </n-gi>
    <n-gi span="8 m:6 l:7">
      <n-tabs justify-content="space-evenly" type="line">
        <n-tab-pane name="chap2" tab="构成比例图">
          <VChart
            :option="option" autoresize h-xl :loading="subjectLoading || paperLoading"
          />
        </n-tab-pane>
      </n-tabs>
    </n-gi>
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
