<template>
  <div class="home" :style="{ backgroundColor: rgbToString }">
    <div :class="SWIPER_CONTAINER" ref="swiperContainer">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(src, index) in imgsSrc" :key="src">
          <img ref="imgs" :src="src" @load="loadImage(index)" />
        </div>
      </div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>

<script>
import ColorThief from 'colorthief'
import Swiper from 'swiper/swiper-bundle'
import 'swiper/swiper-bundle.css'

const loadImgs = require.context('@/assets/imgs', true, /.*.jpg$/)
const imgsSrc = loadImgs.keys().map(filename => {
  return require(`@/assets/imgs${filename.slice(1)}`)
})

const SWIPER_CONTAINER = 'swiper-container'

const swiperConfig = {
  loop: true,
  speed: 400,
  autoplay: {
    delay: 1000,
  },
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch: 80,
    depth: 200,
    modifier: 1,
    slideShadows: false,
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
}

export default {
  name: 'HomePage',
  data () {
    return {
      imgsSrc,
      SWIPER_CONTAINER,
      colors: Array.from({ length: imgsSrc.length }),
      activeIndex: 0,
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    this.destroy()
  },
  computed: {
    rgbToString () {
      const rgb = this.colors[this.activeIndex]?.map(c => c * 0.6) || [0, 0, 0]
      return `rgb(${rgb.join(',')})`
    },
  },
  methods: {
    loadImage (index) {
      this.$set(this.colors, index, this.colorThief.getColor((this.$refs.imgs[index])))
    },
    init () {
      if (!this.colorThief) {
        this.colorThief = new ColorThief()
      }

      if (!this.swiper) {
        this.swiper = new Swiper(this.$refs.swiperContainer, swiperConfig)
      }
    },
    destroy () {
      this.colorThief = this.swiper = null
    },
  }
};
</script>

<style lang="sass">
.home
  height: 100vh
  display: flex
  justify-content: center
  align-items: center
.swiper
  &-container
    width: 750px
    padding: 50px 0
  &-wrapper
    display: flex
    justify-content: center
    align-items: center
  &-slide
    width: 300px
    > img
      width: 100%
</style>
