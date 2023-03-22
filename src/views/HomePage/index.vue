<template>
  <div class="home" :style="{ backgroundColor: rgbToString }">
    <div :class="SWIPER_CONTAINER" ref="swiperContainer">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(src, index) in imgsSrc" :key="src">
          <img ref="imgs" :src="src" @load="loadImage(index)" />
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import ColorThief from 'colorthief'
import Swiper from 'swiper/swiper-bundle'
import 'swiper/swiper-bundle.css'

const loadImgs = require.context('@/assets/imgs', true, /.*.jpg$/)
const imgsSrc = loadImgs.keys().map((filename) => {
  return require(`@/assets/imgs${filename.slice(1)}`)
})

const SWIPER_CONTAINER = 'swiper-container'

const swiperConfig = {
  loop: true,
  spaceBetween: 100,
  speed: 400,
  autoplay: {
    delay: 5000,
    disableOnInteraction: true,
  },
  effect: 'coverflow',
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: 'auto',
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 300,
    modifier: 1,
    slideShadows: false,
  },

  pagination: {
    el: '.swiper-pagination',
  },
}

export default {
  name: 'HomePage',
  data() {
    return {
      imgsSrc,
      SWIPER_CONTAINER,
      colors: Array.from({ length: imgsSrc.length }),
      swiper: null,
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    this.destroy()
  },
  computed: {
    rgbToString() {
      const defaultColor = [0, 0, 0]
      if (!this.swiper) {
        return defaultColor
      }
      const rgb =
        this.colors[this.swiper.activeIndex % this.colors.length]?.map(
          (c) => c * 0.6
        ) || defaultColor
      return `rgb(${rgb.join(',')})`
    },
  },
  methods: {
    loadImage(index) {
      this.$set(
        this.colors,
        index,
        this.colorThief.getColor(this.$refs.imgs[index])
      )
    },
    init() {
      if (!this.colorThief) {
        this.colorThief = new ColorThief()
      }

      if (!this.swiper) {
        this.swiper = new Swiper(this.$refs.swiperContainer, swiperConfig)
      }
    },
    destroy() {
      this.colorThief = this.swiper = null
    },
  },
}
</script>

<style lang="sass">
body
  background: #eee
  font-family: Helvetica Neue, Helvetica, Arial, sans-serif
  font-size: 14px
  color: #000
  margin: 0
  padding: 0
  box-sizing: border-box

.home
  height: 80vh
  display: flex
  justify-content: center
  align-items: center

.swiper
  &-container
    width: 750px
    height: 100%
    padding: 50px 0
  &-wrapper
    align-items: center
  &-slide
    background-position: center
    background-size: cover
    width: 300px
    height: 300px
    --webkit-box-reflect: below 1px linear-gradient(transparent, transparent, #0006)
    img
      object-fit: cover
      display: block
      width: 100%
</style>
