<template>
    <div class="progress-bar" ref="progressBar" @click="progressBarClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper"
                 ref="progressBtn"
                 @touchstart.prevent="progressTouchStart"
                 @touchmove.prevent="progressTouchMove"
                 @touchend="progressTouchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>
<script>
    const PROGRESSBTN_WIDTH = 16

    import {prefixStyle} from 'common/js/dom'
    const transform = prefixStyle('transform')
    export default{
        props:{
            percent:{
                type:Number,
                default:0
            }
        },
        created(){
            this.touch={}
        },
        methods:{
            progressTouchStart(e){
                this.touch.initiated = true
                this.touch.startX = e.touches[0].pageX
                this.touch.left = this.$refs.progress.clientWidth
            },
            progressTouchMove(e){
                if (!this.touch.initiated){
                    return
                }
                let deltaX = e.touches[0].pageX - this.touch.startX
                let offsetWidth = Math.min(this.$refs.progressBar.clientWidth - PROGRESSBTN_WIDTH,Math.max(0,deltaX + this.touch.left))
                this.setOffsetWidth(offsetWidth)

            },
            progressTouchEnd(){
                this.touch.initiated = false
                this._triggerPencent()
            },
            _triggerPencent(){
                const barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTN_WIDTH
                const percent = this.$refs.progress.clientWidth / barWidth
                this.$emit('setPercent',percent)
            },
            setOffsetWidth(offsetWidth){
                this.$refs.progress.style['width'] = `${offsetWidth}px`
                this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
            },
            progressBarClick(e){
                const left = this.$refs.progressBar.getBoundingClientRect().left
                const offsetWidth = e.pageX - left
                this.setOffsetWidth(offsetWidth)
                this._triggerPencent()
            },
        },
        watch:{
            percent(newPercent){
                if (newPercent>=0 && !this.touch.initiated){
                    const barWidth = this.$refs.progressBar.clientWidth - PROGRESSBTN_WIDTH
                    const offsetWidth = newPercent*barWidth
                    this.setOffsetWidth(offsetWidth)
                }
            }
        },
    }

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"

    .progress-bar
        height: 30px
        .bar-inner
            position: relative
            top: 13px
            height: 4px
            background: rgba(0, 0, 0, 0.3)
            .progress
                position: absolute
                height: 100%
                background: $color-theme
            .progress-btn-wrapper
                position: absolute
                left: -8px
                top: -13px
                width: 30px
                height: 30px
                .progress-btn
                    position: relative
                    top: 7px
                    left: 7px
                    box-sizing: border-box
                    width: 16px
                    height: 16px
                    border: 3px solid $color-text
                    border-radius: 50%
                    background: $color-theme
</style>
