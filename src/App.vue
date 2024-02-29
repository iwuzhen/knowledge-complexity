<script setup lang="ts">
// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the html results with vite-ssg
import { darkTheme } from 'naive-ui'
import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui'

useHead({
  title: 'Knowledge Complexity',
  meta: [
    { name: 'description', content: 'Exploring the Interconnections of Academia and Innovation.' },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

const { locale } = useI18n()
const langMap = {
  'en': [enUS, dateEnUS],
  'zh-CN': [zhCN, dateZhCN],
}

const nLocal = ref(enUS)
const dataLocal = ref(dateEnUS)

watchEffect(() => {
  nLocal.value = (langMap as any)[locale.value][0]
  dataLocal.value = (langMap as any)[locale.value][1]
})
</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :locale="nLocal" :date-locale="dataLocal">
    <RouterView />
  </n-config-provider>
</template>
