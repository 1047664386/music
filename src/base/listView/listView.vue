<template>
    <Scroll class="listview"
            :data="data"
            ref="listview"
            :probeType="probeType"
            :listenScroll="listenScroll"
            @scroll="scroll"
    >
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li @click="groupClick(item)" v-for="item in group.items" class="list-group-item">
                        <img v-lazy="item.avatar" alt="" class="avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart"
             @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li class="item"
                    v-for="(item,index) in shortcutList"
                    :data-index="index"
                    :class="{current:currentIndex===index}"
                >{{item}}
                </li>
            </ul>
        </div>
        <div class="list-fixed" v-show="fixedTitle" ref="fixed">
            <div class="fixed-title">{{fixedTitle}}</div>
        </div>
        <div class="loading-container" v-show="!data.length">
            <Loading></Loading>
        </div>
    </Scroll>
</template>
<script>
    import Scroll from 'base/scroll/scroll'
    import {getData} from 'common/js/dom'
    import Loading from 'base/loading/loading'

    // 标题高度 快速入口单个高度
    const TITLE_HEIGHT = 30
    const ANCHOR_HEIGHT = 18

    export default{
        props: {
            data: {
                type: Array,
                default: []
            }
        },
        data(){
            return {
                scrollY: -1,    //  Y轴大小
                currentIndex: 0,    // 当前所处位置
                diff : -1       // 固定标题
            }
        },
        computed: {
            //  取首字母
            shortcutList(){
                return this.data.map((group) => {
                    return group.title.substr(0, 1)
                })
            },
            //  显示标题
            fixedTitle(){
                if (this.scrollY > 0) {
                    return ''
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
            }
        },
        created(){
            this.probeType = 3
            this.listenScroll = true
            this.touch = {}
            this.listHeight = []
        },
        methods: {
            refresh(){
                this.$refs.listview.refresh()
            },
            //  列表点击事件
            groupClick(item){
                this.$emit('select',item)
            },
            // 点击快速入口
            onShortcutTouchStart(e){
                let anchorIndex = getData(e.target, 'index')
                let firstTouch = e.touches[0]
                this.touch.y1 = firstTouch.pageY
                this.touch.anchorIndex = anchorIndex
                this.scrollTo(anchorIndex)
            },
            // 滑动快速入口
            onShortcutTouchMove(e){
                let firstTouch = e.touches[0]
                this.touch.y2 = firstTouch.pageY
                let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta
                this.scrollTo(anchorIndex)
            },
            // 计算滚动区间高度
            _calculateHeight(){
                this.listHeight = []
                const list = this.$refs.listGroup
                let height = 0
                this.listHeight.push(height)
                for (let i = 0; i < list.length; i++) {
                    let item = list[i]
                    height += item.clientHeight
                    this.listHeight.push(height)
                }
            },
            // 接收scroll组件暴露出来的pos监听当前滑动位置
            scroll(pos){
                this.scrollY = pos.y
            },
            scrollTo(index){
                if (!index && index !== 0) {
                    return
                }
                if (index<0){
                    index = 0
                }else if (index>this.listHeight.length -2){
                    index = this.listHeight.length - 2
                }
                this.scrollY = -this.listHeight[index]
                this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
            }
        },
        watch: {
            data(){
                setTimeout(() => {
                    this._calculateHeight()
                }, 20)
            },
            scrollY(newY){
                const listHeight = this.listHeight
                // 当滚动到顶部，newY>0
                if (newY > 0) {
                    this.currentIndex = 0
                    return
                }
                // 在中间滚动的时候
                for (let i = 0; i < listHeight.length; i++) {
                    // 规定下限与上限
                    let height1 = listHeight[i]
                    let height2 = listHeight[i + 1]
                    if (-newY>=height1 && -newY<height2){
                        this.currentIndex = i
                        // 设置diff值是当前所在的位置的上限加上当前滚动的Y轴偏移量（负数）
                        this.diff = height2 + newY
                        return
                    }
                }
                // 滚动到底部 -newy大于最后一个元素的上限
                this.currentIndex = listHeight.length -2
            },
            diff(val){
                // 满足这个条件 title才变化 否则不用计算
                let fixedTop = (val>0 && val<TITLE_HEIGHT) ? val-TITLE_HEIGHT : 0
                this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
        },
        components: {
            Scroll,
            Loading
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"

    .listview
        position: relative
        width: 100%
        height: 100%
        overflow: hidden
        background: $color-background
        .list-group
            padding-bottom: 30px
            .list-group-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
            .list-group-item
                display: flex
                align-items: center
                padding: 20px 0 0 30px
                .avatar
                    width: 50px
                    height: 50px
                    border-radius: 50%
                .name
                    margin-left: 20px
                    color: $color-text-l
                    font-size: $font-size-medium
        .list-shortcut
            position: absolute
            z-index: 30
            right: 0
            top: 50%
            transform: translateY(-50%)
            width: 20px
            padding: 20px 0
            border-radius: 10px
            text-align: center
            background: $color-background-d
            font-family: Helvetica
            .item
                padding: 3px
                line-height: 1
                color: $color-text-l
                font-size: $font-size-small
                &.current
                    color: $color-theme
        .list-fixed
            position: absolute
            top: 0
            left: 0
            width: 100%
            .fixed-title
                height: 30px
                line-height: 30px
                padding-left: 20px
                font-size: $font-size-small
                color: $color-text-l
                background: $color-highlight-background
        .loading-container
            position: absolute
            width: 100%
            top: 50%
            transform: translateY(-50%)
</style>