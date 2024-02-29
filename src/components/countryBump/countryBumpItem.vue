<script setup lang="ts">
const props = defineProps<{
  rank: number | null
  name: string
  value: number | null
  color: string
  i18n: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <li :style="`background-color: ${props.color};`" class="bump-li" border-b border-t>
    <span class="bump-rank" ma>
      {{ props.rank }}
    </span>
    <div mb-1 ml-1 mr-1 mt-1 :i="`flag-${props.name.toLowerCase()}-4x3`" />
    <span flex class="bump-label">
      {{ props.i18n ? t(`country.${props.name}`) : props.name }}
    </span>
    <div flex-grow />
    <span class="bump-score">
      {{ props.value }}
    </span>
  </li>
</template>

<style>
/* li {
    background-color: ;
} */
.bump-li {
    /* background-color: red; */
    display: flex;
    /* border: 1px solid black; */
    color: white;
    height: 28px;
    margin-bottom: 2px;
    border-radius: 30px 0 0 30px;
}
.bump-rank {
    border-radius: 50%;
    /* border: 1px solid black; */
    color: black;
    background-color: aliceblue;
    width: 33px;
    height: 26px;
    line-height: 12px;
    font-size: 14px;
    flex:0 0 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.bump-label {
    /* border: 1px solid black; */
    height: 29px;
    width: auto;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.bump-score {
    background-color: rgba(0,0,0,.3);
    /* border: 1px solid black; */
    width: 83px;
    display: flex;
    font-weight: 700;
    align-items: center;
    justify-content: center;
    flex: 0 0 0 40px;
    height: 28px;
}
</style>
