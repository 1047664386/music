<template>
    <transition name="singer">
        <musicList :songs="songs" :title="title" :bgImage="bgImage"></musicList>
    </transition>
</template>
<script>
    import {mapGetters} from 'vuex'
    import {getSingerDetail} from 'api/singer'
    import {ERR_OK} from 'api/config'
    import {createSong} from 'common/js/song'
    import musicList from 'components/music-list/music-list'
    export default{
        data(){
            return{
                songs:[]
            }
        },
        computed: {
            title(){
                return this.singer.name
            },
            bgImage(){
                return this.singer.avatar
            },
            ...mapGetters([
                'singer'
            ])
        },
        created(){
            setTimeout(()=>{
            },500)
            this._getDetail(this.singer.id)
        },
        methods: {
            _getDetail(singermid) {
                if (!this.singer.id){
                    this.$router.push('/singer')
                    return
                }
                getSingerDetail(singermid).then((res) => {
                        if (res.code === ERR_OK){
                            this.songs = this._normalizeSongs(res.data.list)
                        }
                })
            },
            _normalizeSongs(list) {
                let ret = []
                list.forEach((item)=>{
                    let {musicData} = item
                    if (musicData.songid && musicData.albummid){
                        ret.push(createSong(musicData))
                    }
                })
                return ret
            }
        },
        components:{
            musicList
        }

    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    @import "~common/stylus/variable"
    .singer-detail
        position: fixed
        z-index: 100%
        top: 0
        left: 0
        right: 0
        bottom: 0
        background: $color-background

    .singer-enter-active, .singer-leave-active
        transition: all, .3s

    .singer-enter, .singer-leave-to
        transform: translate3d(100%, 0, 0)
</style>