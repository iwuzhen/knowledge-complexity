<script setup lang="ts">
import VChart from 'vue-echarts'

import type { EChartsCoreOption } from 'echarts/core'
import { use } from 'echarts/core'
import {
  LineChart,
} from 'echarts/charts'
import { SVGRenderer } from 'echarts/renderers'
import {
  DatasetComponent,
  GeoComponent,
  GridComponent,
  LegendComponent,
  TimelineComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,

} from 'echarts/components'

// generate alpha-2 : name

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
])

const edgeCounteDx = {
  x: [
    '1900',
    '1901',
    '1902',
    '1903',
    '1904',
    '1905',
    '1906',
    '1907',
    '1908',
    '1909',
    '1910',
    '1911',
    '1912',
    '1913',
    '1914',
    '1915',
    '1916',
    '1917',
    '1918',
    '1919',
    '1920',
    '1921',
    '1922',
    '1923',
    '1924',
    '1925',
    '1926',
    '1927',
    '1928',
    '1929',
    '1930',
    '1931',
    '1932',
    '1933',
    '1934',
    '1935',
    '1936',
    '1937',
    '1938',
    '1939',
    '1940',
    '1941',
    '1942',
    '1943',
    '1944',
    '1945',
    '1946',
    '1947',
    '1948',
    '1949',
    '1950',
    '1951',
    '1952',
    '1953',
    '1954',
    '1955',
    '1956',
    '1957',
    '1958',
    '1959',
    '1960',
    '1961',
    '1962',
    '1963',
    '1964',
    '1965',
    '1966',
    '1967',
    '1968',
    '1969',
    '1970',
    '1971',
    '1972',
    '1973',
    '1974',
    '1975',
    '1976',
    '1977',
    '1978',
    '1979',
    '1980',
    '1981',
    '1982',
    '1983',
    '1984',
    '1985',
    '1986',
    '1987',
    '1988',
    '1989',
    '1990',
    '1991',
    '1992',
    '1993',
    '1994',
    '1995',
    '1996',
    '1997',
    '1998',
    '1999',
    '2000',
    '2001',
    '2002',
    '2003',
    '2004',
    '2005',
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
  ],
  y: [
    0.0,
    6304.0,
    9573.0,
    9020.0,
    8814.0,
    8967.0,
    9665.0,
    10456.0,
    11178.0,
    10838.0,
    13396.0,
    12970.0,
    14093.0,
    14282.0,
    14531.0,
    9253.0,
    11436.0,
    10338.0,
    10322.0,
    13423.0,
    16569.0,
    19311.0,
    22491.0,
    28018.0,
    29420.0,
    35955.0,
    41935.0,
    43962.0,
    50763.0,
    55985.0,
    64918.0,
    71930.0,
    78684.0,
    81927.0,
    79271.0,
    87729.0,
    98122.0,
    105178.0,
    109561.0,
    116829.0,
    110405.0,
    108629.0,
    97825.0,
    86043.0,
    79216.0,
    71437.0,
    84071.0,
    108647.0,
    134940.0,
    165049.0,
    196224.0,
    219484.0,
    240368.0,
    278263.0,
    295408.0,
    328029.0,
    348816.0,
    381617.0,
    427036.0,
    471237.0,
    516960.0,
    558865.0,
    628024.0,
    700900.0,
    774748.0,
    1029487.0,
    1000911.0,
    1131235.0,
    1249039.0,
    1361292.0,
    1539960.0,
    1688912.0,
    1873199.0,
    2059208.0,
    2151480.0,
    2326724.0,
    2490965.0,
    2710560.0,
    2897012.0,
    3187170.0,
    3378979.0,
    3674221.0,
    3914815.0,
    4211372.0,
    4526182.0,
    4836087.0,
    5205816.0,
    5592978.0,
    6121557.0,
    6629244.0,
    7150419.0,
    7735358.0,
    8352794.0,
    8132264.0,
    8821006.0,
    9580701.0,
    1.0209506e7,
    1.092491e7,
    1.1999891e7,
    1.3623747e7,
    1.5755826e7,
    1.7171198e7,
    1.8725638e7,
    2.0686693e7,
    2.3030014e7,
    2.6053519e7,
    2.5146756e7,
    2.727764e7,
    3.4207829e7,
    4.0365902e7,
    4.352806e7,
    4.8062839e7,
    5.2397489e7,
    5.7968743e7,
    6.2576814e7,
    6.7885369e7,
    6.9913193e7,
    7.4927327e7,
    7.425633e7,
    8.5805471e7,
    9.6650083e7,
    1.23518489e8,
  ],
}
const articleCounteDx = {
  x: [
    '1900',
    '1901',
    '1902',
    '1903',
    '1904',
    '1905',
    '1906',
    '1907',
    '1908',
    '1909',
    '1910',
    '1911',
    '1912',
    '1913',
    '1914',
    '1915',
    '1916',
    '1917',
    '1918',
    '1919',
    '1920',
    '1921',
    '1922',
    '1923',
    '1924',
    '1925',
    '1926',
    '1927',
    '1928',
    '1929',
    '1930',
    '1931',
    '1932',
    '1933',
    '1934',
    '1935',
    '1936',
    '1937',
    '1938',
    '1939',
    '1940',
    '1941',
    '1942',
    '1943',
    '1944',
    '1945',
    '1946',
    '1947',
    '1948',
    '1949',
    '1950',
    '1951',
    '1952',
    '1953',
    '1954',
    '1955',
    '1956',
    '1957',
    '1958',
    '1959',
    '1960',
    '1961',
    '1962',
    '1963',
    '1964',
    '1965',
    '1966',
    '1967',
    '1968',
    '1969',
    '1970',
    '1971',
    '1972',
    '1973',
    '1974',
    '1975',
    '1976',
    '1977',
    '1978',
    '1979',
    '1980',
    '1981',
    '1982',
    '1983',
    '1984',
    '1985',
    '1986',
    '1987',
    '1988',
    '1989',
    '1990',
    '1991',
    '1992',
    '1993',
    '1994',
    '1995',
    '1996',
    '1997',
    '1998',
    '1999',
    '2000',
    '2001',
    '2002',
    '2003',
    '2004',
    '2005',
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
  ],
  y: [
    0.0,
    51385.0,
    53017.0,
    54250.0,
    54654.0,
    55113.0,
    57051.0,
    59224.0,
    61137.0,
    63372.0,
    63883.0,
    64910.0,
    65608.0,
    66775.0,
    65634.0,
    63669.0,
    61261.0,
    57711.0,
    55234.0,
    57661.0,
    66379.0,
    73033.0,
    78460.0,
    80432.0,
    85396.0,
    88988.0,
    95475.0,
    99490.0,
    103282.0,
    107250.0,
    112881.0,
    113116.0,
    115375.0,
    114041.0,
    114919.0,
    118474.0,
    122351.0,
    121701.0,
    124923.0,
    121924.0,
    118141.0,
    110101.0,
    104663.0,
    96442.0,
    92048.0,
    94162.0,
    119989.0,
    140293.0,
    159345.0,
    171820.0,
    214324.0,
    236226.0,
    242355.0,
    251692.0,
    260562.0,
    270086.0,
    279701.0,
    294005.0,
    302973.0,
    317444.0,
    340249.0,
    350778.0,
    366160.0,
    403472.0,
    421853.0,
    455470.0,
    477555.0,
    506883.0,
    533652.0,
    572633.0,
    635276.0,
    613837.0,
    638877.0,
    656425.0,
    672173.0,
    702547.0,
    722591.0,
    752061.0,
    783198.0,
    811866.0,
    849202.0,
    865508.0,
    891764.0,
    935264.0,
    981912.0,
    1018779.0,
    1066608.0,
    1131171.0,
    1188846.0,
    1257186.0,
    1334349.0,
    1362341.0,
    1407421.0,
    1462569.0,
    1514056.0,
    1591636.0,
    1692125.0,
    1744869.0,
    1815890.0,
    1875029.0,
    2207625.0,
    2176452.0,
    2343503.0,
    2641499.0,
    2888948.0,
    3029794.0,
    3356526.0,
    3717547.0,
    3858141.0,
    4139938.0,
    4343095.0,
    4683685.0,
    4842062.0,
    5087573.0,
    5332195.0,
    5472371.0,
    5691910.0,
    6020872.0,
    5988908.0,
    6424990.0,
    7026769.0,
    7332160.0,
  ],
}

const chartType = ref('article')
const chartTypeOption = ref([
  {
    value: 'article',
    label: '论文数',
    chartTitle: 'OpenAlex 论文数年度变化量 (dx)',
  },
  {
    value: 'links',
    label: '引用数',
    chartTitle: 'OpenAlex 论文年度引用变化量 (dx)',
  },
])

const guidNationText = computed(() => {
  if (chartType.value === 'article')
    return 'OpenAlex 论文数年度变化量'

  else if (chartType.value === 'links')
    return 'OpenAlex 论文年度引用变化量 (dx)'
})

const chatData = computed(() => {
  if (chartType.value === 'article')
    return articleCounteDx

  // if (chartType.value === 'links')
  return edgeCounteDx
})

const chartTitleMap = chartTypeOption.value.reduce((acc, item) => {
  // acc[item.value] = item
  acc.set(item.value, item.chartTitle)
  return acc
}, new Map<string, string>())

// provide(THEME_KEY, 'dark')
const option = ref<EChartsCoreOption>({
  title: {
    text: 'OpenAlex 变化趋势',
    left: 'center',
  },
})
watchEffect(() => {
  option.value = {
    title: {
      text: chartTitleMap.get(chartType.value),
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
      title: 'monthYear',
    },
    yAxis: {
      type: 'value',
      title: 'count',
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      data: [[...chatData.value.x], [...chatData.value.y]],
    },
    dataset: {
      source: [[...chatData.value.x], [...chatData.value.y]],
    },
    series: [
      {
        datasetIndex: 0,
        type: 'line',
        name: '',
        seriesLayoutBy: 'row',
        encode: {
          x: 0,
          y: 1,
        },
      },

    ],
  }
})

// table
const tableColumns: any = ref([
  {
    title: '时间',
    key: 'datetime',
    width: 150,
  },
  {
    title: '数量',
    key: 'value',
  },
])

const tableData = ref([{ code: 'US', country: 'US', 2022: 100 }])
watchEffect(() => {
  tableData.value = []
  chatData.value.y.forEach((value, index) => {
    const dataRow: any = { value, datetime: chatData.value.x[index] }
    tableData.value.push(dataRow)
  })
})
</script>

<template>
  <n-grid cols="10" x-gap="12" item-responsive responsive="screen">
    <n-gi span="8 m:4 l:3">
      <div class="light-green" h-xs>
        {{ guidNationText }} <br>
      </div>

      <n-radio-group v-model:value="chartType" name="radiobuttongroup2" size="small">
        <n-radio-button
          v-for="item in chartTypeOption"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </n-radio-button>
      </n-radio-group>
    </n-gi>
    <n-gi span="8 m:6 l:7">
      <n-tabs justify-content="space-evenly" type="line">
        <n-tab-pane name="chap2" tab="趋势图">
          <div class="green">
            <VChart
              :option="option" autoresize h-xl
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
