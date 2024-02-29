<script lang="ts" setup>
import type { SelectInst, SelectRenderLabel } from 'naive-ui'

const props = defineProps<{
  modelValue: string[]
  placeholder: string
}>()

const emit = defineEmits(['update:modelValue'])

const subjectNames = ['Biological engineering', 'Chip']
const options = ref(subjectNames.map((value) => {
  return {
    label: value,
    value,
  }
}))
watchEffect(() => {
  options.value = subjectNames.map((value) => {
    return {
      label: value,
      value,
    }
  })
})

const renderLabel: SelectRenderLabel = (option) => {
  return h(
    'div',
    {
      class: 'flex',
    },
    [
      // h('div', { i: `flag-${(option.value as string).toLowerCase()}-4x3`, class: 'mt-1 mb-1 mr-1' }),
      h('div', {}, { default: () => option.label }),
    ],
  )
}
const selectInstRef = ref<SelectInst | null>(null)
// const selectValue = ref(null)
function updateValue(value: string[]) {
  emit('update:modelValue', value)
  selectInstRef.value?.blur()
}
</script>

<template>
  <n-select
    ref="selectInstRef"
    :default-value="props.modelValue"
    :render-label="renderLabel"
    :options="options"
    filterable multiple
    :placeholder="placeholder"
    @update:value="updateValue"
  />
</template>
