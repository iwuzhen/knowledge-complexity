<script setup lang="ts">
defineProps<{
  tokenA: string
  tokenB: string
  tokenX: string
  distance1: number
  distance2: number
  tolerance: number
  tokenYSetSize: number
}>()
</script>

<template>
  <div class="container">
    <!-- 四边形 -->
    <div class="quadrilateral">
      <!-- 角上的标签 -->
      <div class="corner-label top-left">
        A:
        <Transition name="slide-fade" mode="out-in">
          <p :key="tokenA" class="corner-label-p">
            {{ tokenA }}
          </p>
        </Transition>
      </div>

      <div class="corner-label top-right">
        B:
        <Transition name="slide-fade" mode="out-in">
          <p :key="tokenB" class="corner-label-p">
            {{ tokenB }}
          </p>
        </Transition>
      </div>
      <div class="corner-label bottom-left">
        X:
        <Transition name="slide-fade" mode="out-in">
          <p :key="tokenX" class="corner-label-p">
            {{ tokenX }}
          </p>
        </Transition>
      </div>
      <div class="corner-label bottom-right">
        Y Size:
        <Transition name="slide-fade" mode="out-in">
          <p :key="tokenYSetSize" class="corner-label-p">
            {{ tokenYSetSize === 0 ? '?' : tokenYSetSize }}
          </p>
        </Transition>
      </div>
      <!-- 边上的标签 -->
      <div class="edge-label left">
        d2 = <Transition name="slide-fade" mode="out-in">
          <p :key="distance2">
            {{ distance2 }}
          </p>
        </Transition>
      </div>
      <div class="edge-label right">
        d3 = <Transition name="slide-fade" mode="out-in">
          <p :key="tolerance">
            [{{ Math.max(distance2 - tolerance, 0).toFixed(3) }}, {{ Math.min(distance2 + tolerance, 1).toFixed(3) }}]
          </p>
        </Transition>
      </div>
      <div class="edge-label bottom">
        d4 = <Transition name="slide-fade" mode="out-in">
          <p :key="tolerance">
            [{{ Math.max(distance1 - tolerance, 0).toFixed(3) }}, {{ Math.min(distance1 + tolerance, 1).toFixed(3) }}]
          </p>
        </Transition>
      </div>
      <div class="edge-label top">
        d1 = <Transition name="slide-fade" mode="out-in">
          <p :key="distance1">
            {{ distance1 }}
          </p>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped="true">
.slide-fade-enter-active {
  transition: all .9s ease-in-out;
}

.slide-fade-leave-active {
  transition: all .9s cubic-bezier(1.0,  0.5,  0.8,  1.0);
}

.slide-fade-leave-to {
  /* border: 1px solid #ccc; */
  background-color: transparent; /* 离开时背景色淡出为透明 */
  /* border: 0px solid #ccc; */
}
.slide-fade-leave-from,
.slide-fade-enter-to {
  /* border: 1px solid #ccc; */
  background-color: yellow; /*  进入时背景色淡入为黄色 */
}

.container {
  position: relative;
  height: 170px;
  /* 根据需要调整高度 */
}

.quadrilateral {
  position: absolute;
  width: 250px;
  /* 四边形的宽度 */
  height: 100px;
  /* 四边形的高度 */
  background-color: #ffffff;
  /* 标签的背景颜色 */
  border: 1px solid #ccc;
  /* 四边形的背景颜色 */
  transform: rotate(35deg);
  /* 旋转四边形以形成菱形 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.corner-label {
  position: absolute;
  width: auto;
  /* 标签的宽度 */
  height: 20px;
  /* 标签的高度 */
  background-color: #fff;
  /* 标签的背景颜色 */
  border: 0px solid #ccc;
  /* 标签的边框 */
  border-radius: 5px;
  /* 圆角 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.corner-label-p {
  max-width: 100px; /* 设置最大宽度，例如200像素 */
  word-wrap: break-word; /* 允许单词在必要时换行 */
  overflow-wrap: break-word; /* 与 word-wrap 相同，用于支持旧版浏览器 */
  white-space: normal; /* 允许空白符（如空格、制表符等）导致换行 */
}

.top-left {
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
}

.top-right {
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
}

.bottom-left {
  bottom: 0;
  left: 0;
  transform: translate(-50%, 50%);
}

.bottom-right {
  bottom: 0;
  right: 0;
  transform: translate(50%, 50%);
}

.edge-label {
  position: absolute;
  width: auto;
  /* 标签的宽度 */
  height: 20px;
  /* 标签的高度 */
  background-color: #fff;
  /* 标签的背景颜色 */
  border: 0px solid #ccc;
  /* 标签的边框 */
  border-radius: 5px;
  /* 圆角 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.left {
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
}

.right {
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
}

.bottom {
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 120%);
}

.top {
  top: 0;
  left: 50%;
  transform: translate(-50%, -120%);
}
</style>
