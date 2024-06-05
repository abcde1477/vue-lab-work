// 在这里放置你的代码
import {createRouter, createWebHistory} from 'vue-router'
import LayoutMain from '../Layouts/LayoutMain.vue'
//创建Level X子路由的递归函数
const createChildren =  function (i){
    const recursion = (i,end,curURL)=>{
        if (i === end) {
            return [
                {path: ''}
            ]
        } else {
            let itemName = `Level ${i}`
            return [
                {
                    path:''
                },
                {
                    path: 'level' + i,
                    component:LayoutMain,
                    props: {
                        defaultStyle:'solid',
                        itemName:itemName,
                        overrideMainBody:undefined,
                        curURL:curURL,
                        nextItemName:`Level ${i+1}`,
                        gotoURL:(i+1 !== end)?`${curURL}/level${i+1}`:undefined,//level4没有go to level X
                    },
                    children: recursion(i + 1,end,`${curURL}/level${i+1}`)
                }
            ]
        }
    }
    return recursion(1,i+1,'/home/level1')
}
const routes = [
    {
        path: '/',
        redirect:'/home'
    },
    {
        path:'/home',
        component:LayoutMain,
        name:'home',
        props: {
            defaultStyle:'dashed', 
            itemName:'Home',
            overrideMainBody:'Welcome to Home',
            curURL:'/home',
            nextItemName:'Level 1',
            gotoURL:'/home/level1',
        },
        children:createChildren(4)
    }
]
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

export default router

