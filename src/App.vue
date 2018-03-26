<template>
    <div id="app">
        <Vheader></Vheader>
        <Tab></Tab>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
        <player></player>
    </div>
</template>

<script>
    import Vheader from 'components/vHeader/Vheader'
    import Tab from 'components/tab/Tab'
    import player from 'components/player/player'
    export default {
        components: {
            Vheader,
            Tab,
            player
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

    #app
        color: $color-theme

</style>
