<template>
  <div
    ref="wrap"
    :id="id"
    class="select-none"
    @click="wrapClick">
    <div
      ref="elem"
      class="relative block h-2 rounded bg-slate-200 cursor-pointer"
    >
        <div class="absolute -top-4 z-10 cursor-pointer">
          <div
          ref="tooltip"
          class="flex justify-center"
          @mousedown="moveStart"
          @touchstart="moveStart"
        >
          <div 
            v-if="showCursor"
            class="absolute w-6 h-6 translate-y-1/3" 
          >
            <div 
              class="w-full h-full rounded-full box-border bg-purple-800"
              :class="[bgTheme]"
            >
            </div>
          </div>
          <span
            v-if="showTooltip"
            class="flex -mt-8"
          >
              <span
                class="px-4 py-2 rounded-lg text-white -translate-y-3 bg-purple-800"
                :class="[bgTheme]"
              >
                {{ val }}
              </span>
          </span>
        </div>
        </div>
      <div
        ref="process"
        class="absolute h-full rounded transition-all duration-75 z-[1] top-0 left-0 bg-purple-300"
        :class="[bgProcessThmee]"
        style="will-change: width;"
      />
    </div>
    
  </div>
</template>
<script>
export default {
  name: 'vue-slide-bar',
  data () {
    return {
      flag: false,
      size: 0,
      currentValue: 0,
      currentSlider: 0,
      interval: 1,
      lazy: false,
      realTime: false
    }
  },
  props: {
    id: {
      type: String,
      default: 'wrap'
    },
    speed: {
      type: Number,
      default: 0.5
    },
    modelValue: {
      type: [String, Number],
      require: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    showCursor: {
      type: Boolean,
      default: true
    },
    showTooltip: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    draggable: {
      type: Boolean,
      default: true
    },
    theme: {
      type: String,
      default: 'purple'
    },
  },
  computed: {
    slider () {
      return this.$refs.tooltip
    },
    val: {
      get () {
        return this.currentValue
      },
      set (val) {
        this.currentValue = val
      }
    },
    bgTheme() {
      return 'bg-' + this.theme + '-800';
    },
    bgProcessThmee() {
      return 'bg-' + this.theme + '-300';
    },
    currentIndex () {
      return (this.currentValue - this.minimum) / this.spacing
    },
    indexRange () {
      return [0, this.currentIndex]
    },
    minimum () {
      return this.min
    },
    maximum () {
      return this.max
    },
    multiple () {
      let decimals = `${this.interval}`.split('.')[1]
      return decimals ? Math.pow(10, decimals.length) : 1
    },
    spacing () {
      return this.interval
    },
    total () {

      return (this.maximum - this.minimum) / this.interval
    },
    gap () {
      return this.size / this.total
    },
    position () {
      return ((this.currentValue - this.minimum) / this.spacing * this.gap)
    },
    limit () {
      return [0, this.size]
    },
    valueLimit () {
      return [this.minimum, this.maximum]
    },
  },
  watch: {
    value (val) {
      debugger
      if (this.flag) this.setValue(val)
      else this.setValue(val, this.speed)
    },
    max (val) {
      let resetVal = this.limitValue(this.val)
      this.setValue(resetVal)
      this.refresh()
    },
    min (val) {
      let resetVal = this.limitValue(this.val)
      this.setValue(resetVal)
      this.refresh()
    }
  },
  methods: {
    bindEvents () {
      document.addEventListener('touchmove', this.moving, {passive: false})
      document.addEventListener('touchend', this.moveEnd, {passive: false})
      document.addEventListener('mousemove', this.moving)
      document.addEventListener('mouseup', this.moveEnd)
      document.addEventListener('mouseleave', this.moveEnd)
      window.addEventListener('resize', this.refresh)
    },
    unbindEvents () {
      document.removeEventListener('touchmove', this.moving)
      document.removeEventListener('touchend', this.moveEnd)
      document.removeEventListener('mousemove', this.moving)
      document.removeEventListener('mouseup', this.moveEnd)
      document.removeEventListener('mouseleave', this.moveEnd)
      window.removeEventListener('resize', this.refresh)
    },
    getPos (e) {
      this.realTime && this.getStaticData()
      return e.clientX - this.offset
    },
    wrapClick (e) {
      if (this.disabled || (!this.draggable && e.target.id === this.id)) return false
      let pos = this.getPos(e)
      this.setValueOnPos(pos)
    },
    moveStart (e, index) {
      if (!this.draggable) return false
      this.flag = true
      this.$emit('dragStart', this)
    },
    moving (e) {
      if (!this.flag || !this.draggable) return false
      e.preventDefault()
      if (e.targetTouches && e.targetTouches[0]) e = e.targetTouches[0]
      this.setValueOnPos(this.getPos(e), true)
    },
    moveEnd (e) {
      if (this.flag && this.draggable) {
        this.$emit('dragEnd', this)
        if (this.lazy && this.isDiff(this.val, this.modelValue)) {
          this.syncValue()
        }
      } else {
        return false
      }
      this.flag = false
      this.setPosition()
    },
    setValueOnPos (pos, isDrag) {
      let range = this.limit
      let valueRange = this.valueLimit
      if (pos >= range[0] && pos <= range[1]) {
        this.setTransform(pos)
        let v = (Math.round(pos / this.gap) * (this.spacing * this.multiple) + (this.minimum * this.multiple)) / this.multiple
        this.setCurrentValue(v, isDrag)
      } else if (pos < range[0]) {
        this.setTransform(range[0])
        this.setCurrentValue(valueRange[0])
        if (this.currentSlider === 1) this.currentSlider = 0
      } else {
        this.setTransform(range[1])
        this.setCurrentValue(valueRange[1])
        if (this.currentSlider === 0) this.currentSlider = 1
      }
    },
    isDiff (a, b) {
      if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
        return true
      } else if (Array.isArray(a) && a.length === b.length) {
        return a.some((v, i) => v !== b[i])
      }
      return a !== b
    },
    setCurrentValue (val, bool) {
      if (val < this.minimum || val > this.maximum) return false
      if (this.isDiff(this.currentValue, val)) {
        this.currentValue = val
        if (!this.lazy || !this.flag) {
          this.syncValue()
        }
      }
      bool || this.setPosition()
    },
    setIndex (val) {
      val = this.spacing * val + this.minimum
      this.setCurrentValue(val)
    },
    setValue (val, speed) {
      if (this.isDiff(this.val, val)) {
        let resetVal = this.limitValue(val)
        this.val = resetVal
        this.syncValue()
      }
      this.$nextTick(() => this.setPosition(speed))
    },
    setPosition (speed) {
      if (!this.flag) this.setTransitionTime(speed === undefined ? this.speed : speed)
      else this.setTransitionTime(0)
      this.setTransform(this.position)
    },
    setTransform (val) {
      let value = val - ((this.$refs.tooltip.scrollWidth - 2) / 2)
      let translateValue = `translateX(${value}px)`
      this.slider.style.transform = translateValue
      this.slider.style.WebkitTransform = translateValue
      this.slider.style.msTransform = translateValue
      this.$refs.process.style.width = `${val}px`
      this.$refs.process.style['left'] = 0
    },
    setTransitionTime (time) {
      this.slider.style.transitionDuration = `${time}s`
      this.slider.style.WebkitTransitionDuration = `${time}s`
      this.$refs.process.style.transitionDuration = `${time}s`
      this.$refs.process.style.WebkitTransitionDuration = `${time}s`
    },
    limitValue (val) {
      const inRange = (v) => {
        if (v < this.min) {
          return this.min
        } else if (v > this.max) {
          return this.max
        }
        return v
      }
      return inRange(val)
    },
    syncValue () {
      let val = this.val
      this.$emit('update:modelValue', val)
    },
    getValue () {
      return this.val
    },
    getIndex () {
      return this.currentIndex
    },
    getStaticData () {
      if (this.$refs.elem) {
        this.size = this.$refs.elem.offsetWidth
        this.offset = this.$refs.elem.getBoundingClientRect().left
      }
    },
    refresh () {
      if (this.$refs.elem) {
        this.getStaticData()
        this.setPosition()
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
        this.getStaticData()
        this.setValue(this.limitValue(this.modelValue), 0)
        this.bindEvents()
    })
  },
  beforeDestroy () {
    this.unbindEvents()
  }
}
</script>