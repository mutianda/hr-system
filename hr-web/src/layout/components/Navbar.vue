<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="Global Size" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>返回首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="updataUser">
            <span style="display:block;">修改信息</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog
      title="添加员工"
      :visible.sync="updateUserDialog"
      width="520px"
      :before-close="handleDialogClose"
    >
      <el-form ref="form" :model="userForm" class="demo-form-inline" :rules="userRule" label-width="80px">

        <el-form-item label="姓名" prop="username">
          <el-input v-model="userForm.username" placeholder="姓名" readonly style="width: 300px" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="手机号" style="width: 300px" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="邮箱" style="width: 300px" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="密码" style="width: 300px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取 消</el-button>
        <el-button type="primary" @click="toupdateUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import {updateUser} from '@/api/myself'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search
  },
  data() {
    return {
      userForm: {
        username: '',
        phone: '', password: '', email: '', role: '', salary: ''
      },
      updateUserDialog:false,
      userRule: {
        username: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        phone: [
          { required: true, message: '请输入内容', trigger: 'blur' }

        ],
        password: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入内容', trigger: 'blur' }

        ],
        role: [
          { required: true, message: '请输入标题', trigger: 'change' }
        ],
        salary: [
          { required: true, message: '请输入内容', trigger: 'blur' }

        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'))
  },
  methods: {
    updataUser() {
      const user = JSON.parse(localStorage.getItem('user'))
      this.userForm={
        userId: user.id,
        username: user.user_name,
        phone: user.user_phone,
        password:user.user_password,
        email: user.user_email,
        role: user.role,
        salary: user.salary
      }
      this.updateUserDialog = true

    },
    handleDialogClose(){
      this.updateUserDialog = false
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    toupdateUser(){
      updateUser(this.userForm).then(res=>{
        if (res.code) {
          this.$message({
            type: 'success',
            message: res.msg
          })
          this.logout()
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          })
        }

       this.handleDialogClose()
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
