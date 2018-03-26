<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>
<script>
    import Scroll from 'better-scroll'
    export default{
        props: {
            probeType: {
                type: Number,
                default: 1
            },
            click: {
                type: Boolean,
                default: true
            },
            listenScroll: {
                type: Boolean,
                default: false
            },
            data: {
                type: Array,
                default: null
            },
        },
        mounted(){
            setTimeout(() => {
                this._initScroll()
            }, 20)
        },
        methods: {
            _initScroll(){
                if (!this.$refs.wrapper) {
                    return
                }
                this.scroll = new Scroll(this.$refs.wrapper, {
                    probeType: this.probeType,
                    click: this.click
                })
                if (this.listenScroll) {
                    let This = this
                    this.scroll.on('scroll', (pos) => {
                        This.$emit('scroll',pos)
                    })
                }
            },
            disable(){
                this.scroll && this.scroll.disable()
            },
            enable(){
                this.scroll && this.scroll.enable()
            },
            refresh(){
                this.scroll && this.scroll.refresh()
            },
            scrollTo(){
                this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
            },
            scrollToElement(){
                this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
            }
        },
        watch: {
            data(){
                setTimeout(() => {
                    this.refresh()
                }, 20)
            }
        }
    }
</script>