<template>
  <div class="streamVideo">
    <img
      class="streamVideo-cover"
      alt="cover"
      :class="{ active: loaded && shouldPlay }"
      :src="videoInfo.cover"
      @load="$emit('image-load')"
    />
    <video
      ref="video"
      class="streamVideo-video"
      muted
      @loadedmetadata="loaded = true"
    >
      <source :src="useNativeHLS || videoInfo.url" :type="videoInfo.type" />
    </video>
  </div>
</template>

<script>
export default {
  name: 'StreamVideo',
  data () {
    return {
      loaded: false,
      shouldPlay: false,
      useNativeHLS: false,
    }
  },
  props: {
    videoInfo: {
      type: Object,
      required: true,
    }
  },
  methods: {
    $play () {
      this.shouldPlay = true
      this.$refs.video.play()
    },
    $pause () {
      this.$refs.video.pause()
      this.shouldPlay = false
    }
  }
}
</script>

<style lang="sass">
.streamVideo
  position: relative
  &-cover
    width: 100%
    height: 100%
    object-fit: cover
    display: block
    transition: opacity 1s ease-in-out 350ms
    &.active
      opacity: 0
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
