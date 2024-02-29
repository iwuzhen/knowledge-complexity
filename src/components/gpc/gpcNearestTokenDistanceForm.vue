<script setup lang="ts">
import { useRequest, useWatcher } from 'alova'
import { get_last_token, get_suggestion } from '~/api/methods/gpc'

defineProps<{
  links: any[]
}>()

const emit = defineEmits(['update:links'])

const token = ref('')
const selectToken = ref('')
const selectTokenID = ref(0)
const autoComplexOptions = ref([])
const distanceLimit = ref([0, 1])

const { onSuccess } = useWatcher(
  () => get_suggestion(token.value),
  [token],
  // 被监听的状态数组，这些状态变化将会触发一次请求
  {
    // initialData: { legend: [], rank: [], year: [2010, 2015, 2020], data: [] },
    immediate: false,
    debounce: 800,
  },
)
onSuccess((event: any) => {
  // sendArgs的值为[1]
  autoComplexOptions.value = event.data.map((item: any) => {
    return {
      label: item.token,
      value: item.id,
      // value: item.token,
    }
  })
})

const { send: getLastToken } = useRequest(
  (tokenValue, tokenIDValue, distanceStart, distanceEnd) => get_last_token(tokenValue, tokenIDValue, distanceStart, distanceEnd),
  {
    immediate: false,
  },
)

const examplesQuery = ref([
  { token: '知识就是力量', id: 3067655 },
  { token: '我思故我在', id: 7344 },
  { token: 'Cogito, ergo sum', id: 7344 },
  { token: 'René Descartes', id: 25525 },
  { token: 'Bertrand Russell', id: 4163 },
  { token: 'Isaac Newton', id: 14627 },
  { id: 1109042, token: 'NBA Finals Most Valuable Player Award' },
  { token: 'Stephen Curry', id: 5608488 },
  { token: 'Michael Jordan', id: 20455 },
  { token: 'Shaquille O\'Neal', id: 147726 }])

const recordSet = new Set()
examplesQuery.value.forEach((element) => {
  recordSet.add(element.id)
})

const historyQuery: any = ref([])

function complete(value: any) {
  // console.log(value)
  selectTokenID.value = value
  setTimeout(() => {
    getLastToken(token.value, value, ...distanceLimit.value).then((result: any) => {
      const tmpValue = result.map((row: any) => {
        return {
          token_a: row[1].replaceAll('_', ' '),
          token_b: row[3].replaceAll('_', ' '),
          distance: row[4],
        }
      })
      emit('update:links', tmpValue)
      selectToken.value = token.value
      if (!recordSet.has(value)) {
        historyQuery.value.push({ token: token.value, id: value })
        recordSet.add(value)
      }
    })
  }, 100)
  // = emit('update:modelValue', value)
}

function quickSearch(item: any) {
  selectTokenID.value = item.id
  token.value = item.token
  getLastToken(item.token, item.id, ...distanceLimit.value).then((result: any) => {
    const tmpValue = result.map((row: any) => {
      return {
        token_a: row[1].replaceAll('_', ' '),
        token_b: row[3].replaceAll('_', ' '),
        distance: row[4],
      }
    })
    emit('update:links', tmpValue)
    selectToken.value = item.token
  })
}

function distanceChange() {
  getLastToken(token.value, selectTokenID.value, ...distanceLimit.value).then((result: any) => {
    const tmpValue = result.map((row: any) => {
      return {
        token_a: row[1].replaceAll('_', ' '),
        token_b: row[3].replaceAll('_', ' '),
        distance: row[4],
      }
    })
    emit('update:links', tmpValue)
  })
}

onMounted(() => {
  quickSearch(examplesQuery.value[0])
})
</script>

<template>
  <n-alert type="info" :show-icon="false" mb-5>
    寻找相近的实体, distance 越小，相关性越大。
    <br>
    输入中英文引文提示，选择一个实体， 返回有相关性的实体。
  </n-alert>
  <n-gradient-text type="info" :size="24" mb-5 mt-5>
    {{ selectToken }}
  </n-gradient-text>
  <n-form-item
    path="token" label="查询实体:"
    mt-5
  >
    <n-auto-complete
      v-model:value="token"
      :input-props="{
        autocomplete: 'disabled',
      }"
      :options="autoComplexOptions"
      placeholder="please input token ..."
      :on-select="complete"
    />
  </n-form-item>

  <n-form-item
    path="distance" :label="`distance 范围: ${distanceLimit[0]} - ${distanceLimit[1]}`"
    mt-5
  >
    <n-slider v-model:value="distanceLimit" range :step="0.01" :max="1" :min="0" @click="distanceChange" />
  </n-form-item>
  <n-divider dashed>
    example
  </n-divider>
  <n-space>
    <n-button v-for="item in examplesQuery" :key="item.id" quaternary type="primary" @click="quickSearch(item)">
      {{ item.token }}
    </n-button>
  </n-space>

  <n-divider dashed>
    history
  </n-divider>
  <n-space>
    <n-button v-for="item in historyQuery" :key="`a${item.id}`" quaternary type="info" @click="quickSearch(item)">
      {{ item.token }}
    </n-button>
  </n-space>
</template>

<style>

</style>
