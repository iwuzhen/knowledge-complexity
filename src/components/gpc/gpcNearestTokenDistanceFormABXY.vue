<script setup lang="ts">
import { useRequest, useWatcher } from 'alova'
import { get_abxy_token, get_suggestion } from '~/api/methods/gpc'

defineProps<{
  links: any
}>()
const emit = defineEmits(['update:links'])

const token_a = ref({ title: 'China', id: 5405 })
const token_b = ref({ title: 'Nanjing', id: 21791 })
const token_x = ref({ title: 'Shanghai', id: 27643 })

const token_a_title = ref(token_a.value.title)
const token_b_title = ref(token_b.value.title)
const token_x_title = ref(token_x.value.title)

const tolerance = ref(0.05)
// const token_b = ref('Nanjing')
// const token_a_id = ref(5405)
// const token_b_id = ref(21791)

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
    <knowledgeUnitSquare :token-a="token_a.title" :token-b="token_b.title" :token-x="token_x.title" :token-y-set-size="XSize" :distance1="D1" :distance2="D2" :tolerance="tolerance" />
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
  </n-spin>
</template>
