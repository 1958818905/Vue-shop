<template>
  <div>
    <!--  面包屑导航区-->
    <el-breadcrumb separator-class='el-icon-arrow-right'>
      <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区-->
    <el-card>
      <!--搜索与添加区  栅格布局-->
      <el-row :gutter='20'>
        <el-col :span='8'>
          <el-input placeholder='请输入内容' v-model='queryInfo.query' clearable @clear='getUserList'>
            <el-button slot='append' icon='el-icon-search' @click='getUserList'>
            </el-button>
          </el-input>
        </el-col>
        <el-col :span='4'>
          <el-button type='primary' @click='addDialogVisible = true'>添加用户</el-button>
        </el-col>
      </el-row>
      <!--表格区-->
      <el-table :data='userList' border stripe>
        <el-table-column type='index' label='序号'></el-table-column>
        <el-table-column label='姓名' prop='username'></el-table-column>
        <el-table-column label='邮箱' prop='email'></el-table-column>
        <el-table-column label='电话' prop='mobile'></el-table-column>
        <el-table-column label='角色' prop='role_name'></el-table-column>
        <el-table-column label='状态'>
          <template slot-scope='scope'>
            <el-switch v-model='scope.row.mg_state' @change='userStateChanged(scope.row)'>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label='操作'>
          <!-- eslint-disable-next-line -->
          <template slot-scope='scope' width='180px'>
            <el-button type='primary' icon='el-icon-edit' size='mini'></el-button>
            <el-button type='danger' icon='el-icon-delete' size='mini'></el-button>
            <el-tooltip effect='dark' content='分配角色' placement='top' enterable>
              <el-button type='warning' icon='el-icon-setting' size='mini'></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--      分页区域-->
      <el-pagination @size-change='handleSizeChange' @current-change='handleCurrentChanged'
                     :current-page='queryInfo.pagenum' :page-sizes='[1,2,5,10]' :page-size='queryInfo.pageSize'
                     layout='total,sizes,prev,pager,next,jumper' :total='total'></el-pagination>
    </el-card>
    <!--添加用户对话框-->
    <el-dialog title='添加用户' :visible.sync='addDialogVisible' width='50%'>
      <!--内容主体-->
      <el-form :model='addForm' :rules='addFormRules' ref='addFormRef' label-width='70px'>
        <el-form-item label='用户名' prop='username'>
          <el-input v-model='addForm.username'></el-input>
        </el-form-item>
        <el-form-item label='密码' prop='password'>
          <el-input v-model='addForm.password'></el-input>
        </el-form-item>
        <el-form-item label='邮箱' prop='email'>
          <el-input v-model='addForm.email'></el-input>
        </el-form-item>
        <el-form-item label='手机' prop='mobile'>
          <el-input v-model='addForm.mobile'></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮-->
      <span slot='footer' class='dialog-footer'>
        <el-button @click='addDialogVisible = false'>取消</el-button>
        <el-button type='primary' @click='addDialogVisible = false'>确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(true)) {
        return cb()
      } else {
        cb(new Error('请输入合法邮箱'))
      }
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      //  验证手机号正则
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(true)) {
        return cb
      } else {
        cb(new Error('请输入合法的手机号'))
      }
    }
    return {
      //  获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 显示多少条数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示和隐藏
      addDialogVisible: false,
      // 添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单规则
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          }, {
            min: 3,
            max: 10,
            message: '用户名的长度在3-10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
            min: 5,
            max: 12,
            message: '密码的长度在5-12个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机',
            trigger: 'blur'
          },
          {
            validator: checkMobile(),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      } else {
        this.userList = res.data.users
        this.total = res.data.total
      }
      // console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //  监听页码值改变的时间
    handleCurrentChanged (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听Switch开关的状态
    async userStateChanged (userinfo) {
      // console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新失败！')
      } else {
        this.$message.success('更新成功！')
      }
    }
  }
}
</script>

<style lang='less' scoped>

</style>
