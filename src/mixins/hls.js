import HLS from 'hls.js'

export default {
  created() {
    this.initHLS()
  },
  destroyed() {
    this.hls && this.hls.destroyed()
  },
  methods: {
    initHLS() {
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
  },
}
