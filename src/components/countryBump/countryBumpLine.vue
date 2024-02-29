<script setup lang="ts">
import { customAlphabet } from 'nanoid'
import * as d3 from 'd3'

interface myData {
  source: number
  target: number
  color: string
}

const props = defineProps<{
  value: myData[]
  length: number
}>()

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const nanoid = customAlphabet(alphabet, 10)
const svgID = nanoid()

const blockHeigh = 30

const svgHeight = ref(props.length * blockHeigh + 22)
const svgRef = ref<any>(null)
const pointYs = []
for (let i = 0; i < props.length; i++)
  pointYs.push(i * blockHeigh + 12)

pointYs.push(props.length * blockHeigh + 22)

// onMounted(() => {

// })

watchEffect(() => {
  handleResize()
})

function handleResize() {
  if (!svgRef.value)
    return

  let startNodeCount = 1
  let endNodeCount = 1
  props.value.forEach((row) => {
    if (row.source > 0)
      startNodeCount += 1
    if (row.target > 0)
      endNodeCount += 1
  })
  const startPointMoteY = Math.min(startNodeCount, props.length) * blockHeigh + 18
  const endPointMoteY = Math.min(endNodeCount, props.length) * blockHeigh + 18

  svgHeight.value = props.length * blockHeigh + 22
  const width = svgRef.value.getBoundingClientRect().width
  // const points = [
  //   [0, 12],
  //   [60, 12],
  //   [width - 20, 400],
  //   [width, 400],
  // ]
  const line = d3.line()
    .curve(d3.curveBasis)
  d3.select(`#${svgID}`)
    .selectAll('*')
    .remove()

  const svg = d3.select(`#${svgID}`)
    .attr('width', 200)
    .attr('height', svgHeight.value)

  let startMoreFlag = false
  let endMoreFlag = false
  // const pointMoteY = props.length * blockHeigh + 18
  props.value.forEach((row) => {
    let source = row.source * blockHeigh + 12
    let target = row.target * blockHeigh + 12
    let startXs = [0, 20]
    let endsXs = [width - 20, width]

    if (row.source < 0) {
      startMoreFlag = true
      // source = pointMoteY
      source = startPointMoteY
      startXs = [20, 40]
    }
    if (row.target < 0) {
      endMoreFlag = true
      // target = pointMoteY
      target = endPointMoteY
      endsXs = [width - 40, width - 20]
    }

    svg.append('path')
    // .datum(points)
    // .attr('d', line)
      .attr('d', line([
        [startXs[0], source],
        [startXs[1], source],
        [endsXs[0] - 20, target],
        [endsXs[1], target],
      ]))
      .attr('stroke', row.color) // 使用半透明黑色
      .attr('stroke-width', 7) // 设置线宽为5
      .attr('fill', 'none')
  })
  if (startMoreFlag) {
    // 画更多的起点，三个黑点
    [0, 10, 20].forEach((pointX) => {
      svg.append('rect')
        .attr('x', pointX - 1)
        // .attr('y', pointMoteY - 3)
        .attr('y', startPointMoteY - 3)
        .attr('width', 6)
        .attr('height', 6)
        .attr('fill', 'black')
    })
  }
  if (endMoreFlag) {
    // 画更多的终点，三个黑点
    [width - 26, width - 16, width - 6].forEach((pointX) => {
      svg.append('rect')
        .attr('x', pointX - 1)
        // .attr('y', pointMoteY - 3)
        .attr('y', endPointMoteY - 3)
        .attr('width', 6)
        .attr('height', 6)
        .attr('fill', 'black')
    })
  }
  // svg.append('path')
  //   // .datum(points)
  //   // .attr('d', line)
  //   .attr('d', line(points))
  //   .attr('stroke', 'rgba(10, 110, 0, 0.5)') // 使用半透明黑色
  //   .attr('stroke-width', 7) // 设置线宽为5
  //   .attr('fill', 'none')
}
</script>

<template>
  <svg :id="svgID" ref="svgRef" class="svgLine" :style="`height: ${svgHeight} px`" />
</template>

<style>
  .svgLine {
    width: 100%;
  }
</style>
