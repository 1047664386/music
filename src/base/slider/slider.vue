<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item,index) in dots" :class="{active : currentPageIndex===index}"></span>
        </div>
    </div>
</template>
<script>
    import {addClass} from 'common/js/dom'
    import Scroll from 'better-scroll'
    export default {

        data(){
            return {
                dots: [],
                currentPageIndex: 0
            }
        },

        //  轮播初始状态
        props: {
            loop: {
                type: Boolean,
                default: true
            },
            autoPlay: {
                type: Boolean,
                default: true
            },
            interVal: {
                type: Number,
                default: 4000
            }
        },

        mounted(){
            this.$nextTick(() => {
                this._setSliderWidth()
                this._initDots()
                this._initSlider()
                if (this.autoPlay) {
                    this._play()
                }

                window.addEventListener('resize', () => {
                    if (!this.slider){
                        return
                    }
                    this._setSliderWidth(true)
                    this.slider.refresh()
                })
            })
        },

        methods: {
            _setSliderWidth(isResize){
                //  获取所有子元素
                this.children = this.$refs.sliderGroup.children

                //  包裹着所有子元素的父级宽度
                let width = 0

                //  设置宽度为屏幕宽度
                let sliderWidth = this.$refs.slider.clientWidth

                //  循环设置每个传入组件的子元素class以及宽度
                for (let i = 0; i < this.children.length; i++) {
                    let child = this.children[i]

                    addClass(child, 'slider-item')

                    child.style.width = sliderWidth + 'px'

                    width += sliderWidth
                }
                if (this.loop && !isResize) {
                    width += 2 * sliderWidth
                }
                //  循环轮播要clone第一个以及最后一个子元素 所以要*2
                this.$refs.sliderGroup.style.width = width + 'px'
            },
            _initSlider(){
                //  初始化滚动
                this.slider = new Scroll(this.$refs.slider, {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: true,
                    snapLoop: this.loop,
                    snapThreshold: 0.3,
                    snapSpeed: 400
                })
                this.slider.on('scrollEnd', () => {
                    let pageIndex = this.slider.getCurrentPage().pageX
                    if (this.loop) {
                        pageIndex -= 1
                    }
                    this.currentPageIndex = pageIndex

                    if (this._play) {
                        clearTimeout(this.timer)
                        this._play()
                    }
                })
            },
            _initDots(){
                this.dots = new Array(this.children.length)
            },
            _play(){
                let pageIndex = this.currentPageIndex + 1
                if (this.loop) {
                    pageIndex += 1
                }
                this.timer = setTimeout(() => {
                    this.slider.goToPage(pageIndex, 0, 400)
                }, this.interVal)
            }

        },
        distoryed(){
            clearTimeout(this.timer)
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"


    .slider
        min-height: 1px
        .slider-group
            position: relative
            overflow: hidden
            white-space: nowrap
            .slider-item
                float: left
                box-sizing: border-box
                overflow: hidden
                text-align: center
                a
                    display: block
                    width: 100%
                    overflow: hidden
                    text-decoration: none
                img
                    display: block
                    width: 100%
        .dots
            position: absolute
            right: 0
            left: 0
            bottom: 12px
            text-align: center
            font-size: 0
            .dot
                display: inline-block
                margin: 0 4px
                width: 8px
                height: 8px
                border-radius: 50%
                background: $color-text-l
                &.active
                    width: 20px
                    border-radius: 5px
                    background: $color-text-ll
</style>