<template>
    <!--用component和插槽切换样式会导致bug，切换后会导致子组件重新渲染，让各级子组件的样式变成默认样式， -->
    <!--这使得外层组件切换样式后，所有内部组件会变成默认样式(黑色边框) -->
    <!--即使我在component外添加了keep-live标签也无法解决-->
    <!--keep-live只是把组件在不同curLayout选择下的子组件状态保存下来了（即为两种curLayout保存了两种子组件状态），而不是不同选择下子组件状态一致-->
    <!--理想的解决方法是添加vuex模块来进行状态管理，或者在LayoutMain.vue中书写style而不是切换套用的vue布局-->
    <component :is="curLayout">
      <!-- 正文部分 -->
      <!-- 在这里放置你的代码 -->
      <div v-html="titleHTML"></div>
      
      <!-- 控制区域 -->
      <div class="container">
        <!-- 进入下一个层级的链接：`Go to Level X` -->
        <!-- 在这里放置你的代码 -->
        <router-link
            v-if="(props['gotoURL'] !== undefined) &&(props['nextItemName'] !== undefined)"
            :to="props['gotoURL']"
            @click="bubblingMessage([[props['nextItemName'],props['gotoURL']]])"
        >
          Go to {{props['nextItemName']}}
        </router-link>
        
        <!-- 切换边框风格的按钮 -->
        <button @click="switchLayout">Switch Layout</button>
      </div>
  
      <!-- 用于显示下一个嵌套矩形框的占位符 -->
      <router-view
          @bubbling="bubblingMessage">
      </router-view>
    </component>
  </template>
  
  <script setup>
    import {defineProps, defineEmits, ref, shallowReactive, shallowRef, watch} from 'vue'
    import solid from './MarginSolid.vue'
    import dashed from './MarginDashed.vue'
  
    const props = defineProps(['defaultStyle','itemName','overrideMainBody','curURL','nextItemName','gotoURL'])
    const emit = defineEmits(['bubbling'])
    const curLayout = shallowRef(props['defaultStyle']==='solid'?solid:dashed)//不能使用Ref
    const titleHTML= ref('')
    
    //设置正文HTML
    if(props['overrideMainBody']===undefined) {
      if (!isNaN(Number(props['itemName'].at(-1)))) {
        //如果最后一个字符是数字,根据数字设置为获取正文标题级数
        let titleLevel = Number(props['itemName'].at(-1))+1
        titleHTML.value = `<h${titleLevel}>This is ${props['itemName']}</h${titleLevel}>`
      }
      else {
        //如果最后一个字符是非数字,不设为标题HTML
        titleHTML.value = `<p>This is ${props['itemName']}<p>`
      }
    }
    else{
      titleHTML.value = `<p>${props['overrideMainBody']}<p>`
    }
    
    //在信息中添加当前组件的名称和url，向上发送事件来进行消息传递。最终这个消息给导航栏使用
    function bubblingMessage(navArr){
      navArr.push([props['itemName'],props['curURL']])
      emit('bubbling',navArr)
    }
    
    //切换样式
    function switchLayout(){
      curLayout.value = (curLayout.value === solid)?dashed:solid
    }
    
    //页面重新载入/首次进入页面时，发出一次冒泡来设置导航栏
    window.onload=function(){
      bubblingMessage([])
    }
  </script>