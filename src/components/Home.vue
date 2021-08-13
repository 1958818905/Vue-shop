<template>
  <el-container class='home-container'>
    <!--头部区-->
    <el-header>
      <div>
        <img src='../assets/logo1.png' alt=''>
        <span>数据综合治理与分析挖掘平台</span>
      </div>
      <el-button type='info' @click='logout'>退出</el-button>
    </el-header>
    <!--页面主体区-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="isCollapse ? '64px' : '200px' ">
        <div class='toggle-button' @click='toggleCollapse'>|||</div>
        <!--侧边栏菜单区-->
        <el-menu
          :unique-opened='true'
          :collapse='isCollapse'
          :collapse-transition='false'
          :router='true'
          :default-active='activePath'
          background-color='#333744'
          text-color='#fff'
          active-text-color='#409EFF'>
          <!--激活的文本颜色-->
          <!--一级菜单-->
          <el-submenu :index=" item.id + ''" v-for='item in menulist' :key='item.id'>
            <!--一级菜单模板区-->
            <template slot='title'>
              <!--图标-->
              <i :class='iconsObj[item.id]'></i>
              <!--文本-->
              <span>{{ item.authName }}</span>
            </template>
            <!--二级菜单-->
            <el-menu-item :index=" '/' +  subItem.path+''" v-for='subItem in item.children' :key='subItem.id'
                          @click="saveNavState( '/' + subItem.path )">
              <template slot='title'>
                <!--图标-->
                <i class='el-icon-menu'></i>
                <!--文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      iconsObj: {
        ' 125 ': 'iconfont icon-user',
        ' 103 ': 'iconfont icon-tijikongjian',
        ' 101 ': 'iconfont icon-shangping',
        ' 102 ': 'iconfont icon-danju',
        ' 145 ': 'iconfont icon-baobiao'
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.menulist = res.data
      }
      console.log(res)
    },
    // 点击按钮，切换菜单的折叠
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang='less' scoped>
.iconfont {
  margin-right: 10px;
}

.home-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      padding-left: 10px;
    }
  }
}

.el-aside {
  background-color: #333744;

  .el-menu {
    border-right: none
  }
}

.el-main {
  background-color: #EAEDF1;
}

.toggle-button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

</style>
