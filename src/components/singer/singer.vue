<template>
    <div class="singer" ref="singer">
        <listView @select="selectSinger" :data="singers" ref="listView"></listView>
        <router-view></router-view>
    </div>
</template>
<script>
    import {getSingerList} from 'api/singer'
    import Singer from 'common/js/singer'
    import {ERR_OK} from 'api/config'
    import listView from 'base/listView/listView'
    import {mapMutations} from 'vuex'
    import {playListMixin} from 'common/js/mixin'

    const HOT_SINGER_LEN = 10
    const HOT_NAME = '热门'

    export default{
        mixins: [playListMixin],
        data(){
            return{
                singers :[]
            }
        },
        created(){
            this._getSingerList()
        },
        methods: {
            // 控制有小播放器的话 刷新scroll的bottom值
            handlePlayList(playlist){
                const bottom = playlist.length > 0 ? '60px' : ''
                this.$refs.singer.style.bottom = bottom
                this.$refs.listView.refresh()
            },
            //  路由更改
            selectSinger(item){
                this.$router.push({
                    path : `/singer/${item.id}`,
                })
                this.setSinger(item)
            },
            _getSingerList(){
                getSingerList().then((res) => {
                    if (res.code === ERR_OK) {
                        this.singers = this._normalizeSinger(res.data.list)
                    }
                })
            },
            //  处理数据  让他变成我们需要的样子
            _normalizeSinger(list){
                let map = {
                    hot: {
                        title: HOT_NAME,
                        items: []
                    }
                }
                list.forEach((item, index) => {
                    //  前十条定义为热门
                    if (index < HOT_SINGER_LEN) {
                        map.hot.items.push(new Singer({
                            name: item.Fsinger_name,
                            id: item.Fsinger_mid
                        }))
                    }
                    //  首字母
                    const key = item.Findex
                    if (!map[key]) {
                        map[key] = {
                            title: key,
                            items: []
                        }
                    }
                    //  以首字母进行排序归类
                    map[key].items.push(new Singer({
                        name: item.Fsinger_name,
                        id: item.Fsinger_mid
                    }))
                })
                let ret = []
                let hot = []
                for (let key in map) {
                    let val = map[key]
                    if (val.title.match(/[a-zA-Z]/)) {
                        ret.push(val)
                    } else if (val.title === HOT_NAME) {
                        hot.push(val)
                    }
                }
                //  排序
                ret.sort((a,b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0)
                })
                return hot.concat(ret)
            },
            ...mapMutations({
                setSinger :'SET_SINGER'
            })
        },
        components:{
            listView,
        }
    }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
    .singer
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
</style>