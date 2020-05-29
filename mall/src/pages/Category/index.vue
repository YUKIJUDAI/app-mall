<template>
    <div class="category">
        <top-bar title="商品分类"></top-bar>
        <div class="header">
            <!-- <van-tabs v-model="curTabIndex" color="#e61e41">
                <van-tab title="人气"></van-tab>
                <van-tab title="销量"></van-tab>
                <van-tab>
                    <template #title>
                        <van-dropdown-menu>
                            <van-dropdown-item v-model="a" :options="option" />
                        </van-dropdown-menu>
                    </template>
                </van-tab>
                <van-tab title="高级筛选"></van-tab>
            </van-tabs> -->
            <van-popup v-model="show" position="bottom">
                <div class="advanced-screening-popup">
                    <ul>
                        <li>
                            价格
                            <input type="text">
                            ——
                            <input type="text">
                        </li>
                        <li>
                            销量
                            <input type="text" placeholder=">=">
                        </li>
                    </ul>
                    <div class="advanced-screening-btn">
                        <van-button type="danger" class="yes">确定筛选</van-button>
                        <van-button type="default">&nbsp;&nbsp;&nbsp;取消&nbsp;&nbsp;&nbsp;</van-button>
                    </div>
                </div>
            </van-popup>
        </div>
        <!-- 内容区 -->
        <div class="content">
            <!-- 左侧导航栏 -->
            <section class="left">
                <ul>
                    <li v-for="(item, index) in categoryList" :key="item.id" :class="{ active: sidebarIndex === index }" @click="switchSideNav(item, index)">
                        {{ item.name }}
                    </li>
                    <!-- 侧边栏导航标记 -->
                    <article class="sidebar-tag" ref="sideTagRef"></article>
                </ul>
            </section>
            <!-- 右侧内容 -->
            <section class="right">
                <van-tabs v-model="curTabIndex" color="#e61e41" @click="onCategorySubClick">
                    <van-tab v-for="(item, index) in categorySubList" :key="index" :title="item.name"></van-tab>
                </van-tabs>
                <div class="scroll-wrapper">
                    <b-scroll class="content-scroll" :data="goodsList" v-if="!isEmptyGoodsList && goodsList.length">
                        <div class="container">
                            <goods-list :goodsList="goodsList"></goods-list>
                        </div>
                    </b-scroll>
                    <article class="no-data" v-show="isEmptyGoodsList">暂无数据~~</article>

                    <!-- 加载状态 -->
                    <loading :loadingStatus="loadingStatus" />
                </div>
            </section>
        </div>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar';
import BScroll from '@/components/BScroll';
import GoodsList from '@/components/GoodsList';
import { GoodsMixin } from '@/mixins/goodsMixin';
import ajax from '@/api';

export default {
    name: 'Category',
    mixins: [GoodsMixin],
    components: { TopBar, BScroll, GoodsList },
    data() {
        return {
            sidebarIndex: 0, // 侧边栏导航下标
            categorySubList: [], // 子分类列表
            curTabIndex: 0, // 当前子分类激活下标
            curTabIndexCopy: 0, // 当前子分类激活下标副本 | 对重复点击相同子分类做节流
            goodsList: [], // 商品列表
            isEmptyGoodsList: false, // 是否为空商品列表
            option: [
                { text: '价格从高到低', value: 0 },
                { text: '价格从低到高', value: 1 }
            ],
            show: false
        };
    },
    async created() {
        this._getCategoryList(0);
    },
    methods: {
        /**
         * 获取大分类列表 & 存到 Vuex 中
         */
        async _getCategoryList(pid) {
            // 判断是否已存在大分类列表 | 调用 Vuex 中的 Getters，值在 GoodsMixin 中
            let res = await ajax.getCate({ pid });
            if (res.code === 0) {
                if (pid === 0) {
                    // 设置大分类列表 | 调用 Vuex 中的 Actions，方法在 GoodsMixin 中
                    this.setCategoryList(res.data);
                    // 默认取第一个子分类商品数据
                    this._getCategoryList(res.data[0].id);
                } else {
                    this.categorySubList = res.data;
                    this._getGoodsList(res.data[0].id);
                }
            }
        },
        /**
         * 根据子分类 Id 获取对应分类商品数据
         */
        async _getGoodsList(cat_id) {
            this.loadingStatus = true;
            this.goodsList = [];
            let res = await ajax.getGoodsList(cat_id);
            this.loadingStatus = false;
            if (res.code === 0) {
                this.goodsList = res.data.goods_search_response.goods_list;
                // 判断是否为空商品列表
                this.isEmptyGoodsList = !this.goodsList.length ? true : false;
            }
        },
        /**
         * 切换侧边导航
         */
        switchSideNav(item, index) {
            // 节流
            if (this.sidebarIndex === index) return;

            // 切换左侧导航下标
            this.sidebarIndex = index;
            // 计算侧边导航标签距离顶部距离
            let top = 100 / (this.categoryList.length) * index;
            this.$refs.sideTagRef.style.top = `${top}%`;
            // 切换子分类列表
            this.categorySubList = item.bxMallSubDto;
            // 切换为第一个子分类下标
            this.curTabIndex = 0;
            // 恢复初始化子分类下标副本
            this.curTabIndexCopy = 0;
            // 清空商品列表
            this._getCategoryList(item.id);
        },
        /**
         * 点击子分类
         */
        onCategorySubClick(index) {
            // 节流
            if (this.curTabIndexCopy === index) return;
            this.curTabIndexCopy = index;
            // 清空商品列表
            this.goodsList = [];
            this._getGoodsList(this.categorySubList[index].id);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>