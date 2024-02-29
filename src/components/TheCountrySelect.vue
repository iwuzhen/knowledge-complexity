<script lang="ts" setup>
import type { SelectInst, SelectRenderLabel, SelectRenderTag } from 'naive-ui'
import { NTag } from 'naive-ui'

const props = defineProps<{
  modelValue: string[]
  placeholder: string
}>()

const emit = defineEmits(['update:modelValue'])

const { t } = useI18n()

const countryCodes = ['AD', 'AE', 'AF', 'AG', 'AL', 'AM', 'AO', 'AR', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BW', 'BY', 'BZ', 'CA', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GT', 'GW', 'GY', 'HK', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IQ', 'IR', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KP', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TG', 'TH', 'TJ', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WS', 'XK', 'YE', 'ZA', 'ZM', 'ZW']
const options = ref(countryCodes.map((value) => {
  return {
    label: t(`country.${value}`),
    value,
  }
}))
watchEffect(() => {
  options.value = countryCodes.map((value) => {
    return {
      label: t(`country.${value}`),
      value,
    }
  })
})

const renderTag: SelectRenderTag = ({ option, handleClose }) => {
  return h(
    NTag,
    {
      type: option.type as 'success' | 'warning' | 'error',
      closable: true,
      onMousedown: (e: FocusEvent) => {
        e.preventDefault()
      },
      onClose: (e: MouseEvent) => {
        e.stopPropagation()
        handleClose()
      },
    },
    { default: () => option.label, avatar: () => h('div', { i: `flag-${(option.value as string).toLowerCase()}-4x3`, class: 'mt-1 mb-1' }) },
  )
}

const renderLabel: SelectRenderLabel = (option) => {
  return h(
    'div',
    {
      class: 'flex',
    },
    [
      h('div', { i: `flag-${(option.value as string).toLowerCase()}-4x3`, class: 'mt-1 mb-1 mr-1' }),
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
    :render-tag="renderTag"
    filterable multiple
    :placeholder="placeholder"
    @update:value="updateValue"
  />
</template>
