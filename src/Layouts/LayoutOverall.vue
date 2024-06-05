<template>
    <!-- 导航条 -->
    <!-- 在这里放置你的代码 -->
      <nav>
      <span v-for="(item,i) in navPath" :key="i">
        >
        <router-link
          :to="navPath[i][1]"
          @click="removeAfterItem(i)"
        >
          {{navPath[i][0]}}
        </router-link>
      </span>
    </nav>
    <br>
    <!-- 主页面占位符 -->
    <!-- 在这里放置你的代码 -->
    <router-view
      @bubbling="alterNav"
    ></router-view>
  </template>
  
  <script setup>
    import {ref} from 'vue'
    const navPath = ref([])
    navPath.value.push(['Home','/home'])
    
    //收到子组件冒泡后修改导航栏
    function alterNav(path){
      navPath.value = path.reverse()
    }
    //导航栏点击后删除之后的路径段
    function removeAfterItem(i){
      navPath.value.splice(i+1)
    }
  </script>