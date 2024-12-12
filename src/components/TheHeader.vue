<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { RouterLink } from 'vue-router'
import { availableLocales, loadLanguageAsync } from '~/modules/i18n'

const { t, locale } = useI18n()

async function toggleLocales() {
  // change to some real logic
  const locales = availableLocales
  const newLocale = locales[(locales.indexOf(locale.value) + 1) % locales.length]
  await loadLanguageAsync(newLocale)
  locale.value = newLocale
}

const langMap = {
  'en': 'English',
  'zh-CN': '中文',
}
const language = ref('')
watchEffect(() => {
  language.value = (langMap as any)[locale.value]
})
function renderIcon(icon: string) {
  return () => h('div', { class: icon })
}

const menuOptions: Ref<MenuOption[]> = ref([])
watchEffect(() => {
  menuOptions.value = [
    // {
    //   label: t('menu.tools'),
    //   key: 'tools',
    //   // icon: renderIcon(BookIcon),
    //   children: [
    //     {
    //       type: 'group',
    //       label: t('menu.paper_group'),
    //       key: 'paper_group',
    //       children: [
    //         {
    //           label: () =>
    //             h(
    //               RouterLink,
    //               {
    //                 to: '/tools/paper/tree_map',
    //               },
    //               { default: () => t('menu.paperTreeMap') },
    //             ),
    //           key: 'tools-paper-treeMap',
    //           icon: renderIcon('i-carbon-tree'),
    //         }, {
    //           label: () =>
    //             h(
    //               RouterLink,
    //               {
    //                 to: '/tools/paper/stacked',
    //               },
    //               { default: () => t('menu.paperStacked') },
    //             ),
    //           key: 'tools-paper-stacked',
    //           icon: renderIcon('i-carbon-tree'),
    //         }],
    //     },
    //     {
    //       type: 'group',
    //       label: t('menu.patent_group'),
    //       key: 'patent_group',
    //       children: [
    //         {
    //           label: () =>
    //             h(
    //               RouterLink,
    //               {
    //                 to: '/tools/patent/tree_map',
    //               },
    //               { default: () => t('menu.patentTreeMap') },
    //             ),
    //           key: 'tools-patent-treeMap',
    //           icon: renderIcon('i-carbon-tree'),
    //         }, {
    //           label: () =>
    //             h(
    //               RouterLink,
    //               {
    //                 to: '/tools/patent/stacked',
    //               },
    //               { default: () => t('menu.patentStacked') },
    //             ),
    //           key: 'tools-patent-stacked',
    //           icon: renderIcon('i-carbon-tree'),
    //         }],
    //     },
    //   ],
    // },
    // {
    //   label: t('menu.ranking'),
    //   key: 'ranking',
    //   // icon: renderIcon(BookIcon),
    //   children: [
    //     {
    //       type: 'group',
    //       label: t('menu.paper_group'),
    //       key: 'ranking-paper-group',
    //       children: [
    //         {
    //           label: () =>
    //             h(
    //               RouterLink,
    //               {
    //                 to: '/rankings/eci',
    //               },
    //               { default: () => t('menu.eci') },
    //             ),
    //           icon: renderIcon('i-carbon-earth'),
    //           key: 'ranking-countries-eci',
    //         },
    //         {
    //           icon: renderIcon('i-carbon-category'),
    //           label: () =>
    //             h(
    //               RouterLink,
    //               {
    //                 to: '/rankings/pci',
    //               },
    //               { default: () => t('menu.pci') },
    //             ),
    //           key: 'ranking-countries-pci',
    //         },
    //         {
    //           icon: renderIcon('i-carbon-category'),
    //           label: () =>
    //             h(
    //               RouterLink,
    //               {
    //                 to: '/rankings/reference',
    //               },
    //               { default: () => t('menu.reference') },
    //             ),
    //           key: 'ranking-countries-reference',
    //         }],
    //     }, {
    //       type: 'group',
    //       label: t('menu.github_group'),
    //       key: 'github-group',
    //       children: [
    //         {
    //           label: () =>
    //             h(
    //               RouterLink,
    //               {
    //                 to: '/rankings/github_eci',
    //               },
    //               { default: () => t('menu.github_eci') },
    //             ),
    //           icon: renderIcon('i-carbon-earth'),
    //           key: 'ranking-github-countries-eci',
    //         },
    //         {
    //           icon: renderIcon('i-carbon-category'),
    //           label: () =>
    //             h(
    //               RouterLink,
    //               {
    //                 to: '/rankings/github_pci',
    //               },
    //               { default: () => t('menu.github_pci') },
    //             ),
    //           key: 'ranking-github-countries-pci',
    //         },
    //       ],
    //     },
    //   ],
    // },
    {
      label: '论文',
      key: 'paper',
      icon: renderIcon('i-carbon-category-new-each'),
      children: [
        {
          type: 'group',
          label: '数值统计',
          key: 'paper_group',
          children: [
            {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/tools/paper/tree_map',
                  },
                  { default: () => t('menu.paperTreeMap') },
                ),
              key: 'tools-paper-treeMap',
              icon: renderIcon('i-carbon-number-1'),
            }, {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/tools/paper/stacked',
                  },
                  { default: () => t('menu.paperStacked') },
                ),
              key: 'tools-paper-stacked',
              icon: renderIcon('i-carbon-number-2'),
            },
            {
              // icon: renderIcon('i-carbon-number-2'),
              icon: renderIcon('i-carbon-number-3'),
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/rankings/reference',
                  },
                  { default: () => t('menu.reference') },
                ),
              key: 'ranking-countries-reference',
            },
            {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/tools/paper/stats',
                  },
                  { default: () => '论文网络规模统计' },
                ),
              icon: renderIcon('i-carbon-number-4'),
              key: 'paper-network-stats',
            },
          ],
        },
        {
          type: 'group',
          label: '知识复杂度',
          key: 'patent-group',
          children: [
            {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/rankings/eci',
                  },
                  { default: () => t('menu.eci') },
                ),
              icon: renderIcon('i-carbon-number-1'),
              key: 'ranking-countries-eci',
            },
            {
              icon: renderIcon('i-carbon-number-2'),
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/rankings/pci',
                  },
                  { default: () => t('menu.pci') },
                ),
              key: 'ranking-countries-pci',
            },
          ],
        },
        {
          type: 'group',
          label: '其他工具',
          key: 'patent-group',
          children: [
            {
              label: () =>
                h(
                  'a',
                  {
                    href: 'https://wiki.nikepai.com/v2/demo/openalex/concept-tree-2022',
                    target: '_blank',
                  },
                  { default: () => '论文学科树' },
                ),
              icon: renderIcon('i-carbon-number-1'),
              key: 'subject-tree',
            }, {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/tools/paper/subject_distance',
                  },
                  { default: () => '学科间距离' },
                ),
              icon: renderIcon('i-carbon-number-2'),
              key: 'paper_subject_distance',
            }, {
              label: () =>
                h(
                  'a',
                  {
                    href: 'https://wiki.nikepai.com/v2/demo/mag/subject-algorithm-tree',
                    target: '_blank',
                  },
                  { default: () => '论文学科聚类' },
                ),
              icon: renderIcon('i-carbon-number-3'),
              key: 'subject-tree-cluster',
            },
          ],
        },

      ],
    },
    {
      label: '专利',
      key: 'patent',
      icon: renderIcon('i-carbon-catalog'),
      children: [
        {
          type: 'group',
          label: '数值统计',
          key: 'patent_group_stats',
          children: [
            {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/tools/patent/tree_map',
                  },
                  { default: () => t('menu.patentTreeMap') },
                ),
              key: 'tools-patent-treeMap',
              icon: renderIcon('i-carbon-number-1'),
            }, {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/tools/patent/stacked',
                  },
                  { default: () => t('menu.patentStacked') },
                ),
              key: 'tools-patent-stacked',
              icon: renderIcon('i-carbon-number-2'),
            }],
        },
        {
          type: 'group',
          label: '知识复杂度',
          key: 'patent_knowledge_complex_group',
          children: [
            {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/rankings/patent_eci',
                  },
                  { default: () => '知识复杂度排名（专利）' },
                ),
              key: 'patent_knowledge_complex',
              icon: renderIcon('i-carbon-number-1'),
            }],
        },
      ],
    },
    {
      label: '开源',
      key: 'github',
      icon: renderIcon('i-carbon-logo-github'),
      children: [
        {
          type: 'group',
          label: '数值统计',
          key: 'github_group',
          children: [
          ],
        },
        {
          type: 'group',
          label: '知识复杂度',
          key: 'github_group',
          children: [
            {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/rankings/github_eci',
                  },
                  { default: () => t('menu.github_eci') },
                ),
              icon: renderIcon('i-carbon-number-1'),
              key: 'ranking-github-countries-eci',
            },
            // {
            //   icon: renderIcon('i-carbon-number-2'),
            //   label: () =>
            //     h(
            //       RouterLink,
            //       {
            //         to: '/rankings/github_pci',
            //       },
            //       { default: () => t('menu.github_pci') },
            //     ),
            //   key: 'ranking-github-countries-pci',
            // },
          ],
        },
      ],
    },
    {
      label: '维基百科',
      key: 'wikipedia',
      icon: renderIcon('i-carbon-wikis'),
      children: [
        {
          type: 'group',
          label: '数值统计',
          key: 'wikipedia_group',
          children: [
            {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/tools/wikipedia/stats',
                  },
                  { default: () => '百科网络规模统计' },
                ),
              icon: renderIcon('i-carbon-number-1'),
              key: 'wikipedia-network-stats',
            },
          ],
        }, {
          type: 'group',
          label: '其他工具',
          key: 'wikipedia_other_tool-group',
          children: [
            {
              label: () =>
                h(
                  'a',
                  {
                    href: 'https://visual-demo-20231012.nikepai.com:10444/demo/wikipedia-tree-diff',
                    target: '_blank',
                  },
                  { default: () => '学科树浏览' },
                ),
              icon: renderIcon('i-carbon-number-1'),
              key: 'subject-tree',
            },
            {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/tools/wikipedia/subject_distance',
                  },
                  { default: () => '学科间距离' },
                ),
              icon: renderIcon('i-carbon-number-2'),
              key: 'wikipedia_subject_distance',
            },
          ],
        },
      ],
    },
    {
      label: 'GPC',
      key: 'gpc',
      icon: renderIcon('i-carbon-network-4'),
      children: [
        {
          type: 'group',
          label: '最近距离',
          key: 'gpc_group',
          children: [
            {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/tools/gpc/nearest-token',
                  },
                  { default: () => '实体相关性' },
                ),
              icon: renderIcon('i-carbon-number-1'),
              key: 'gpc-group',
            }, {
              label: () =>
                h(
                  RouterLink,
                  {
                    to: '/tools/gpc/knowledge-unit',
                  },
                  { default: () => 'ku2ku' },
                ),
              icon: renderIcon('i-carbon-number-2'),
              key: 'gpc-knowledge-unit',
            },
          ],
        },
      ],
    },
  ]
})
</script>

<template>
  <header class="bg-gray-100 py-4 dark:bg-gray-800 dark:text-white">
    <div class="mx-auto flex items-center justify-between container">
      <div class="logo text-xl font-bold">
        <a href="/">{{ t("site.title") }}</a>
      </div>
      <div class="menu-wrapper flex items-center">
        <n-menu mode="horizontal" :options="menuOptions" />
        <div class="spacer" />

        <ul class="flex space-x-4">
          <li>
            <button icon-btn :title="t('button.toggle_dark')" @click="toggleDark()">
              <div i="carbon-sun dark:carbon-moon" />
            </button>
          </li>
          <!-- <li>
            <a :title="t('button.toggle_langs')" icon-btn @click="toggleLocales()">
              <p inline-block w-8> {{ language }}</p>
            </a>
          </li> -->
          <li>
            <a title="帮助" icon-btn href="/about">
              <p inline-block w-8> 帮助</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style>
.logo {
  color: var(--text-color);
  margin-right: 2rem;
}

.menu-wrapper {
  margin-left: 2rem;
  flex: 1;
  justify-content: flex-end;
}

.spacer {
  flex: 1;
}

.menu-wrapper ul:last-child {
  margin-right: 0;
}
</style>
