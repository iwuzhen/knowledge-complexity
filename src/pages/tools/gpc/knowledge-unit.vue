<script setup lang="ts">
// import { useMessage } from 'naive-ui'

// const message = useMessage()

const pagination = reactive({
  pageSize: 10,
  page: 1,
  onChange: (page: number) => {
    pagination.page = page
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize
    pagination.page = 1
  },
  itemCount: 0,
  prefix({ itemCount }: any) {
    return `Total is ${itemCount}.`
  },
})

// table
const tableColumns: any = ref([
  {
    title: 'rank',
    key: 'rank',
    width: 60,
    render: (_: any, index: any) => {
      return index + 1 + (pagination.page - 1) * pagination.pageSize
    },
  },
  {
    title: 'title',
    key: 'title',
  },
  {
    title: 'd3',
    key: 'distance_d1',
    defaultSortOrder: 'ascend',
    width: 100,
    sorter(rowA: any, rowB: any) {
      return rowA.distance_d1 - rowB.distance_d1
    },
  },
  {
    title: 'd4',
    key: 'distance_d2',
    className: 'dataValue',
    width: 100,
    defaultSortOrder: 'ascend',
    sorter(rowA: any, rowB: any) {
      return rowA.distance_d2 - rowB.distance_d2
    },
  },
])

const tableData = ref([])
const pageTags = ref('ABXY')

watch(tableData, () => {
  pagination.page = 1
  pagination.itemCount = tableData.value.length
})

function rowClassName(row: any) {
  if (row.distance <= 0.3)
    return 'close'

  return 'disclose'
}
</script>

<template>
  <n-grid cols="10" x-gap="12" item-responsive responsive="screen">
    <n-gi span="8 m:4 l:3">
      <n-tabs v-model:value="pageTags" type="segment">
        <n-tab-pane name="ABXY" tab="Knowledge Unit">
          <gpcNearestTokenDistanceFormABXY v-model:links="tableData" />
        </n-tab-pane>
      </n-tabs>
    </n-gi>
    <n-gi span="8 m:6 l:7">
      <n-tabs justify-content="space-evenly" type="line">
        <n-tab-pane name="chap4" tab="Y">
          <n-data-table
            :single-line="false"
            :columns="tableColumns"
            :data="tableData"
            :bordered="true"
            :max-height="500"
            :row-class-name="rowClassName"
            :pagination="pagination"
            virtual-scroll striped
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
:deep(.close .dataValue) {
  color: rgba(255, 0, 0, 0.75) !important;
}
:deep(.disclose .dataValue) {
  color: rgba(34, 30, 30, 0.75) !important;
}
</style>
