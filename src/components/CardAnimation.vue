<script setup></script>

<template>
  <div class="wrapper">
    <div class="animationWrapper">
      <div class="column">
        <div class="rectangle one"></div>
        <div class="rectangle two"></div>
        <div class="rectangle three"></div>
        <!--  -->
        <div class="rectangle one"></div>
        <div class="rectangle two"></div>
        <div class="rectangle three"></div>
      </div>
      <div class="column reverse">
        <div class="rectangle four"></div>
        <div class="rectangle five"></div>
        <div class="rectangle six"></div>
        <!--  -->
        <div class="rectangle four"></div>
        <div class="rectangle five"></div>
        <div class="rectangle six"></div>
      </div>
      <div class="column">
        <div class="rectangle seven"></div>
        <div class="rectangle eight"></div>
        <div class="rectangle nine"></div>
        <!--  -->
        <div class="rectangle seven"></div>
        <div class="rectangle eight"></div>
        <div class="rectangle nine"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (min-height: 900px) {
  .animationWrapper {
    height: 800px;
  }
}
.wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
  --h: clamp(400px, 80vh, 900px);
}
.animationWrapper {
  width: 100%;
  max-width: 800px;
  max-height: var(--h);
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.column {
  animation: defile 20s linear infinite;
  flex: 1;
  min-width: 0;
}

.reverse {
  animation-direction: reverse;
}

.rectangle {
  height: calc(var(--h) / 1.5);
  width: 100%;
  margin-bottom: 10px;
  border-radius: 17px;
}

.one {
  background-color: #77ebff;
}
.two {
  background-color: #c681ff;
}
.three {
  background-color: #ecff81;
}
.four {
  background-color: #81ff81;
}
.five {
  background-color: #81adff;
}
.six {
  background-color: #ff81c2;
}
.seven {
  background-color: #81e0ff;
}
.eight {
  background-color: #c6ff81;
}
.nine {
  background-color: #ff8181;
}

@keyframes defile {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .column {
    animation: none;
  }
}

@media (min-height: 600px) {
  .animationWrapper {
    height: 800px;
  }
}
</style>
