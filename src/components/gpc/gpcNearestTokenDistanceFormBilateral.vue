<script setup lang="ts">
import { useRequest, useWatcher } from 'alova'
import { get_suggestion, get_two_token } from '~/api/methods/gpc'

defineProps<{
  links: any[]
}>()
const emit = defineEmits(['update:links'])

const token_a = ref('China')
const token_b = ref('Nanjing')
const token_a_id = ref(5405)
const token_b_id = ref(21791)

const autoComplexOptions_a = ref([])
const autoComplexOptions_b = ref([])

const { onSuccess: onSuccess_a } = useWatcher(
  () => get_suggestion(token_a.value),
  [token_a],
  {
    immediate: false,
    debounce: 200,
  },
)
onSuccess_a((event: any) => {
  autoComplexOptions_a.value = event.data.map((item: any) => {
    return {
      label: item.token,
      value: item.id,
    }
  })
})

const { onSuccess: onSuccess_b } = useWatcher(
  () => get_suggestion(token_b.value),
  [token_b],
  {
    immediate: false,
    debounce: 200,
  },
)
onSuccess_b((event: any) => {
  autoComplexOptions_b.value = event.data.map((item: any) => {
    return {
      label: item.token,
      value: item.id,
      // value: item.token,
    }
  })
})

const { send: getTwoToken } = useRequest(
  (tokenValue_a, tokenValue_b) => get_two_token(tokenValue_a, tokenValue_b),
  {
    immediate: false,
  },
)

function result_handle() {
  if (token_a_id.value !== 0 && token_b_id.value !== 0) {
    getTwoToken(token_a_id.value, token_b_id.value).then((result: any) => {
      let tmpValue = result.map((row: any) => {
        return {
          token_a,
          token_b,
          distance: row[4],
        }
      })
      if (tmpValue.length === 0) {
        tmpValue = [{
          token_a,
          token_b,
          distance: NaN,
        }]
      }
      emit('update:links', tmpValue)
    })
  }
}

function complete_a(value: any) {
  token_a_id.value = value
  result_handle()
}

function complete_b(value: any) {
  token_b_id.value = value
  result_handle()
}

onMounted(() => {
  result_handle()
})
</script>

<template>
  <n-alert type="info" :show-icon="false" mb-5>
    两个实体之间的 distance。
  </n-alert>
  <n-form-item
    path="token" label="查询实体 a:"
    mt-5
  >
    <n-auto-complete
      v-model:value="token_a"
      :input-props="{
        autocomplete: 'disabled',
      }"
      :options="autoComplexOptions_a"
      placeholder="please input entity a..."
      :on-select="complete_a"
    />
  </n-form-item>
  <n-form-item
    path="token" label="查询实体 b:"
    mt-5
  >
    <n-auto-complete
      v-model:value="token_b"
      :input-props="{
        autocomplete: 'disabled',
      }"
      :options="autoComplexOptions_b"
      placeholder="please input entity b..."
      :on-select="complete_b"
    />
  </n-form-item>
</template>
