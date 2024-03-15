<script setup lang="ts">
import { useRequest, useWatcher } from 'alova'
import _ from 'lodash'
import { get_abxy_token, get_suggestion } from '~/api/methods/gpc'
import { all_info_store, put_info_store, rm_info_store } from '~/api/methods/info'

defineProps<{
  links: any
}>()
const emit = defineEmits(['update:links'])

const token_a = ref({ title: 'China', id: 5405 })
const token_b = ref({ title: 'Nanjing', id: 21791 })
const token_x = ref({ title: 'Shanghai', id: 27643 })
const tolerance = ref(0.05)

const token_a_title = ref(token_a.value.title)
const token_b_title = ref(token_b.value.title)
const token_x_title = ref(token_x.value.title)
const favoriteFlag = ref(false)

const favoritesQuery_base = [
  { token_a: { title: 'Microsoft', id: 19001 }, token_b: { title: 'Apple Inc.', id: 856 }, token_x: { title: 'Google', id: 1092923 }, tolerance: 0.1 },
  { token_a: { title: 'Integrated circuit', id: 15150 }, token_b: { title: 'Graphics processing unit', id: 390214 }, token_x: { title: 'Central processing unit', id: 5218 }, tolerance: 0.1 },
  { token_a: { title: 'Television', id: 14617 }, token_b: { title: 'Magazine', id: 21001 }, token_x: { title: 'Book', id: 3778 }, tolerance: 0.1 },
]

const { data: favoritesQuery } = useWatcher(
  () => all_info_store('ku-favorite'),
  [token_a_title],
  {
    immediate: true,
    debounce: 200,
    initialData: favoritesQuery_base,
  },
)

const { send: rm_favorite } = useRequest(data => rm_info_store('ku-favorite', data), { immediate: false })
const { send: add_favorite } = useRequest(data => put_info_store('ku-favorite', data), { immediate: false })

function handleSwitchChange(value: boolean) {
  const currentData = _.cloneDeep({ token_a: token_a.value, token_b: token_b.value, token_x: token_x.value, tolerance: tolerance.value })
  if (value === false) {
    // remove favorite
    const tmp = _.cloneDeep(favoritesQuery.value)
    favoritesQuery.value = (tmp as any).filter((item: any) => !_.isEqual(item, currentData))
    rm_favorite(currentData)
  }
  else {
    // add favorite
    (favoritesQuery.value as any).push(currentData)
    add_favorite(currentData)
  }
}

watchEffect(() => {
  const currentData = { token_a: token_a.value, token_b: token_b.value, token_x: token_x.value, tolerance: tolerance.value }
  let flag = false
  for (const obj of (favoritesQuery.value as any)) {
    if (_.isEqual(obj, currentData))
      flag = true
  }
  favoriteFlag.value = flag
})

function quickSearch(item: any) {
  token_a.value = { ...item.token_a }
  token_b.value = { ...item.token_b }
  token_x.value = { ...item.token_x }
  tolerance.value = item.tolerance
  token_a_title.value = item.token_a.title
  token_b_title.value = item.token_b.title
  token_x_title.value = item.token_x.title
  favoriteFlag.value = true
  result_handle()
}

const autoComplexOptions_a = ref([])
const autoComplexOptions_b = ref([])
const autoComplexOptions_x = ref([])

const D1 = ref(0)
const D2 = ref(0)
const XSize = ref(0)

const tokenMap = new Map()

const { onSuccess: onSuccess_a } = useWatcher(
  () => get_suggestion(token_a_title.value),
  [token_a_title],
  {
    immediate: false,
    debounce: 200,
  },
)
onSuccess_a((event: any) => {
  autoComplexOptions_a.value = event.data.map((item: any) => {
    tokenMap.set(item.id, item.token)
    return {
      label: item.token,
      value: item.id,
    }
  })
})

const { onSuccess: onSuccess_b } = useWatcher(
  () => get_suggestion(token_b_title.value),
  [token_b_title],
  {
    immediate: false,
    debounce: 200,
  },
)
onSuccess_b((event: any) => {
  autoComplexOptions_b.value = event.data.map((item: any) => {
    tokenMap.set(item.id, item.token)
    return {
      label: item.token,
      value: item.id,
      // value: item.token,
    }
  })
})

const { onSuccess: onSuccess_c } = useWatcher(
  () => get_suggestion(token_x_title.value),
  [token_x_title],
  {
    immediate: false,
    debounce: 200,
  },
)
onSuccess_c((event: any) => {
  autoComplexOptions_x.value = event.data.map((item: any) => {
    tokenMap.set(item.id, item.token)
    return {
      label: item.token,
      value: item.id,
    }
  })
})

const { loading, send: getABXYToken } = useRequest(
  (tokenValue_a, tokenValue_b, tokenValue_x, tolerance) => get_abxy_token(tokenValue_a, tokenValue_b, tokenValue_x, tolerance),
  {
    immediate: false,
  },
)

function result_handle() {
  if (token_a.value.id !== 0 && token_b.value.id !== 0) {
    getABXYToken(token_a.value.id, token_b.value.id, token_x.value.id, tolerance.value).then((result: any) => {
      let tmpValue = result.data.map((row: any) => {
        return {
          title: row.title.replaceAll('_', ' '),
          distance_d1: row.weight_1,
          distance_d2: row.weight_2,
        }
      })
      if (tmpValue.length === 0) {
        tmpValue = [{
          title: NaN,
          distance_d1: NaN,
          distance_d2: NaN,
        }]
      }
      D1.value = result.d1
      D2.value = result.d2
      XSize.value = tmpValue.length
      emit('update:links', tmpValue)
    })
  }
}

function complete_a(value: any) {
  token_a.value.id = value
  token_a.value.title = tokenMap.get(value)
}

function complete_b(value: any) {
  token_b.value.id = value
  token_b.value.title = tokenMap.get(value)
}

function complete_x(value: any) {
  token_x.value.id = value
  token_x.value.title = tokenMap.get(value)
}

onMounted(() => {
  result_handle()
})
</script>

<template>
  <n-spin :show="loading">
    <n-alert type="info" :show-icon="false" mb-1>
      Knowledge Unit, 四边形法则, 由 A, B, X 推理出 Y 集合。
    </n-alert>
    <div text-right>
      <n-switch v-model:value="favoriteFlag" @update:value="handleSwitchChange">
        <template #checked>
          favorite
        </template>
        <template #unchecked>
          favorite
        </template>
      </n-switch>
    </div>
    <knowledgeUnitSquare :token-a="token_a.title" :token-b="token_b.title" :token-x="token_x.title" :token-y-set-size="XSize" :distance1="D1" :distance2="D2" :tolerance="tolerance" />

    <n-divider dashed />
    <n-form label-placement="left">
      <n-form-item path="token a" label="实体 A:" mt-3>
        <n-auto-complete
          v-model:value="token_a_title" :input-props="{
            autocomplete: 'disabled',
          }" :options="autoComplexOptions_a" blur-after-select
          placeholder="please input entity a..." :on-select="complete_a"
        />
      </n-form-item>
      <n-form-item path="token b" label="实体 B:" mt-3>
        <n-auto-complete
          v-model:value="token_b_title" :input-props="{
            autocomplete: 'disabled',
          }" :options="autoComplexOptions_b" placeholder="please input entity b..." :on-select="complete_b"
        />
      </n-form-item>
      <n-form-item path="token x" label="实体 X:" mt-3>
        <n-auto-complete
          v-model:value="token_x_title" :input-props="{
            autocomplete: 'disabled',
          }" :options="autoComplexOptions_x" placeholder="please input entity x..." :on-select="complete_x"
        />
      </n-form-item>
      <n-form-item path="float range" label="宽容范围:" mt-3>
        <n-slider v-model:value="tolerance" :step="0.01" :max="0.2" :min="0" />
        <n-input-number v-model:value="tolerance" size="small" :step="0.01" :max="0.2" :min="0" ml-1 />
      </n-form-item>
      <n-button type="primary" @click="result_handle">
        计算
      </n-button>
    </n-form>
    <n-divider dashed>
      favorite
    </n-divider>
    <n-space>
      <n-button v-for="item in (favoritesQuery as any)" :key="`${item.token_a.id}-${item.token_b.id}-${item.token_x.id}`" quaternary type="primary" @click="quickSearch(item)">
        {{ item.token_a.title }},{{ item.token_b.title }},{{ item.token_x.title }}
      </n-button>
    </n-space>
  </n-spin>
</template>
