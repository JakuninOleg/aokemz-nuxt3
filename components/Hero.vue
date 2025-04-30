<template>
  <header class="mb-6 lg:mb-0">
    <div class="relative h-70vh">
      <img
        src="~assets/images/newkemz.jpg"
        alt="Баннер"
        class="w-full h-70vh object-contain brightness-50 absolute z-20"
      />
      <img
        src="~assets/images/newkemz_bg.png"
        alt="Баннер"
        class="w-full h-70vh object-fill brightness-50 absolute z-10"
      />
      <!-- <video class="w-full h-70vh object-cover brightness-50 absolute z-1" autoplay loop muted playsinline >
        <source src="~assets/video/kemz_ny.mp4" type="video/mp4" />
      </video> -->
      <!-- <div class="w-full bg-black opacity-50 h-70vh absolute opacity-5 z-30" /> -->
      <!-- <div class="w-full bg-white h-1/2 absolute z-1" />
      <div class="w-full bg-light-blue h-1/2 absolute z-1" /> -->
      <div
        class="absolute z-40 pt-8 lg:pt-24 xl:pt-24 pb-8 xl:pb-20 grid gap-5 xl:gap-0 h-70vh w-full"
      >
        <div class="section">
          <h1
            class="font-bold text-xl lg:text-2xl xl:text-3xl xl:text-5xl text-black mb-6 xl:mb-12"
          >
            Оборудование для карьерных и шагающих экскаваторов
          </h1>
          <NuxtLink to="/products">
            <button
              class="text-white bg-blue-500 text-lg xl:text-xl xl:px-8 xl:py-4 py-2 px-4"
            >
              Перейти в каталог
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {}
</script>

<style></style>
