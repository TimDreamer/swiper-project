<template>
  <div class="streamVideo">
    <img
      class="streamVideo-cover"
      alt="cover"
      :class="{ active: loaded }"
      :src="videoInfo.cover"
    />
    <video
      ref="video"
      class="streamVideo-video"
      :src="useNativeHLS && videoInfo.url"
      preload="none"
      type="application/x-mpegURL"
      muted
      @loadedmetadata="loaded = true"
    />
  </div>
</template>

<script>
import HLS from 'hls.js'

export default {
  name: 'StreamVideo',
  data () {
    return {
      loaded: false,
      useNativeHLS: false,
    }
  },
  props: {
    videoInfo: {
      type: Object,
      required: true,
    }
  },
  created () {
    this.initHLS()
  },
  destroyed () {
    this.hls && this.hls.destroyed()
  },
  methods: {
    initHLS () {
      if (this.useNativeHLS || this.hls) {
        return
      }

      if ((this.useNativeHLS = !HLS.isSupported())) {
        return
      }

      this.hls = new HLS()
      this.hls.loadSource(this.videoInfo.url)
      this.hls.attachMedia(this.$refs.video)

    },
  }
}
</script>

<style lang="sass">
.streamVideo
  position:
  &-cover
    width: 100%
    height: 100%
    object-fit: cover
    display: block
    &.active
      opacity: 0
      transition: opacity 1s ease-in-out 700ms
  &-video
    position: absolute
    left: 0
    top: 0
    right: 0
    bottom: 0
    width: 100%
    min-height: 100%
    z-index: -1
    background-color: black
</style>
