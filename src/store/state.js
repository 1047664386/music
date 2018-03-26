import {playMode} from 'common/js/config'

const state = {
    singer: {},             // 当前播放的信息
    playing :false,         // 是否播放
    fullScreen:false,       // 是否全屏
    playlist:[],            // 播放列表
    sequenceList:[],        // 当前模式播放列表
    mode:playMode.sequence, // 播放模式
    currentIndex:-1         // 当前播放的歌曲下标

}
export default state