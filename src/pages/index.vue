<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})

// print data
</script>

<template>
  <div class="back-ground h-screen flex flex-col bg-cover bg-center">
    <main class="flex-1 overflow-y-auto bg-gray-900 bg-opacity-10 p-4 text-black">
      <h2 class="mb-10 text-start text-3xl font-semibold">
        挖掘数据中的知识复杂度
      </h2>
      <n-carousel
        direction="horizontal" :show-arrow="true" dot-type="line" dot-placement="bottom" style="height: 990px"
        :interval="22000" autoplay centered-slides draggable
      >
        <!-- <n-card title="中美大城市专利数量随时间变化趋势比较" >
          <template #cover> -->
        <!-- </template>
          中美大城市专利数量随时间变化趋势比较
        </n-card> -->

        <a href="https://chart-demo-hz.nikepai.com:10444/charts/china-us-global-cite" title="中美大城市论文引文分布" target="_blank">
          <div class="carousel-caption">
            <h3>中美论文被引对比</h3>
            <p>来自中美几个大城市的论文被世界上其他地区引用的时间和地理分布</p>
          </div>
          <div class="video-mask" />
          <video
            src="/asset/paper-reference-v1.mp4" muted="" loop="" autoplay="" playsinline="" webkit-playsinline=""
            class="video-band"
          />
        </a>

        <a
          href="https://chart-demo-hz.nikepai.com:10444/charts/china-us-compare-patent-2" title="中美大城市专利数量随时间变化趋势比较"
          target="_blank"
        >
          <div class="carousel-caption">
            <h3>中美专利数量对比</h3>
            <p>来自中美几个主要的大城市和区域的专利数量随时间变化趋势</p>
          </div>
          <div class="video-mask" />
          <video
            src="/asset/v1.mp4" muted="" loop="" autoplay="" playsinline="" webkit-playsinline=""
            class="video-band"
          />
        </a>
      </n-carousel>

      <p class="mb-2 mt-4 text-start text-6">
        我们的工作
      </p>
      <p class="mb-10 mt-4 text-start text-lg">
        我们主要收录了上亿级别的学术论文集和世界专利集、世界所有的投融资数据，以及 Github
        中有影响力的开源项目等，所有数据都已建立知识图谱,各数据集之间也做了关联。根据论文、专利、开源项目内部的引用关系，分别计算了知识复杂度；根据知识图谱，建立了可以查询任意两个实体之间的距离的工具。
      </p>
      <p class="mb-10 mt-4 text-start text-lg">
        论文数据：来自 openalex 的约2.4亿篇论文。内容包括论文题目，作者，概念，摘要，引用关系等。在此基础，统计了各国论文的发表数量和引用趋势，计算了论文的知识复杂度。
      </p>
      <p class="mb-10 mt-4 text-start text-lg">
        专利数据：内容包括截至2019年, 总量约1.2亿的世界专利数据，包括专利号，专利族，IPC分类等。在此基础，统计了各国专利引用关系，计算了专利的知识复杂度。
      </p>
      <p class="mb-10 mt-4 text-start text-lg">
        开源数据：收集了在 Github 中 300 star 以上的开源项目，并分析其代码中的依赖关系，建立起来开源依赖网络。
      </p>
    </main>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style>
.back-ground::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-color: #ffffff;
  /* 可以设置背景色或者背景图片 */
  z-index: -1;
  background-image: url(/knowledge_complex_1.webp);
}

.video-band {
  /* height: 100%;
  width: 100%; */
  /* object-fit: fill; */
  object-fit: none;
  /* position: relative; */
  /* z-index: -1; */
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  z-index: -1;

}

.video-mask {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  height: 640px;
  width: 100%;
  background: linear-gradient(to top, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
}

.carousel-caption {
  z-index: 10;
    position: absolute;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #000000;
    text-align: center;
}

.carousel-caption h3 {
    font-size: 3em;
    font-weight: 600;
    margin-bottom: 20px;
}

.carousel-caption p {
    font-size: 1.5em;
}
</style>
