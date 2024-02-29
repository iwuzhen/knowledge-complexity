<template>
  <main
    text="center gray-700 dark:gray-200"
  >
    <n-message-provider>
      <TheHeader />
      <RouterView p-1 />
      <TheFooter />
      <div mx-auto mt-5 text-center text-sm opacity-50>
        <!-- [Default Layout] -->
      </div>
    </n-message-provider>
  </main>
</template>
