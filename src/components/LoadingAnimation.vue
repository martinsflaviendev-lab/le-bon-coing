<template>
  <div class="animContainer">
    <div class="publishing"></div>
  </div>
</template>

<style scoped>
.animContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.publishing {
  /* margin: auto; */
  border: 10px solid grey;
  border-radius: 50%;
  border-top: 10px solid coral;
  width: 40px;
  height: 40px;
  animation: spinner 2s linear infinite;
}
@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
