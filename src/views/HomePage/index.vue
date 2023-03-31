<template>
  <div class="home" :style="{ backgroundColor: currentColor }">
    <div :class="SWIPER_CONTAINER" ref="swiperContainer">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide"
          v-for="(info, index) in videoInfos"
          :key="index"
        >
          <stream-video
            ref="videos"
            :video-info="info"
            @image-load="loadImage(index)"
          />
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
import streamVideo from '@/components/streamVideo.vue'
import VIDEO_SRC from '@/assets/videos/girl.mp4'

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
  components: { streamVideo },
  name: 'HomePage',
  data () {
    return {
      videoInfos: imgsSrc.map(img => {
        return {
          cover: img,
          url: VIDEO_SRC,
          type: 'video/mp4',
        }
      }),
      SWIPER_CONTAINER,
      colors: Array.from({ length: imgsSrc.length }),
      swiper: null,
      isColorsReady: false,
      currentColor: 'rgb(0,0,0)',
      videoInfo: {
        url: VIDEO_SRC,
        type: 'video/mp4',
      },
      prevActiveIndex: 0,
    }
  },
  mounted () {
    this.init()
  },
  destroyed () {
    this.destroy()
  },
  watch: {
    'swiper.activeIndex': {
      handler (index) {
        if (!this.isColorsReady) {
          return
        }
        this.setColor(index)
      },
      immediate: true,
    },
  },
  methods: {
    loadImage (index) {
      this.colors[index] = this.colorThief.getColor(this.$refs.videos[index].$el.firstChild)
      if (index % this.colors.length === 0) {
        this.setColor(0)
      }
      if (this.colors.every((color) => !!color)) {
        this.isColorsReady = true
      }
    },
    init () {
      if (!this.colorThief) {
        this.colorThief = new ColorThief()
      }

      if (!this.swiper) {
        this.swiper = new Swiper(this.$refs.swiperContainer, swiperConfig)
        this.registerEvents()
      }
    },
    destroy () {
      this.colorThief = this.swiper = null
    },
    setColor (index) {
      const rgb = this.colors[index % this.colors.length]
        ?.map((c) => c * 0.6)
        .join(',')
      this.currentColor = `rgb(${rgb})`
    },
    registerEvents () {
      if (!this.swiper) {
        return
      }

      this.swiper.on('slideChangeTransitionStart', () => {
        const video = this.$refs.videos[this.prevActiveIndex]
        video.$pause()
      })

      this.swiper.on('slideChangeTransitionEnd', () => {
        this.prevActiveIndex = this.swiper.activeIndex % this.videoInfos.length
        const video = this.$refs.videos[this.prevActiveIndex]
        video.$play()
      })

      // init for first time
      if (this.prevActiveIndex === 0) {
        this.$refs.videos[this.prevActiveIndex].$play()
      }
    }
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
