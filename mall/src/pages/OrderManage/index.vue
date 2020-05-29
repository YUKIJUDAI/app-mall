<template>
    <div class="order-manage">
        <top-bar title="订单管理" hasBack></top-bar>

        <section class="order-container">
            <!-- 标签导航 -->
            <van-tabs v-model="curActiveTab" color="#e61e41" @change="_getOrderList()">
                <van-tab v-for="(tab, index) in tables" :key="index" :title="tab">
                </van-tab>
            </van-tabs>

            <div class="content-container">
                <b-scroll class="content-scroll" v-if="!loadingStatus && orderList.length" :data="orderList">
                    <div class="container">
                        <section class="order-item" v-for="(item,i) in orderList" :key="i">
                            <div class="order-wrapper">
                                <section class="order-number">
                                    <span>订单编号：</span>
                                    <span class="number">{{ item.order_no }}</span>
                                </section>
                                <ul class="goods-list">
                                    <li class="goods-item" v-for="(value,index) in item.order_goods" :key="index">
                                        <section class="goods-img"><img :src="value.goods_thumbnail_url" /></section>
                                        <section class="goods-name">{{ value.goods_name }}</section>
                                        <section class="goods-price">
                                            <p class="money">￥{{ value.goods_price/100 }}</p>
                                            <p class="buy-count">X {{ value.goods_num }}</p>
                                        </section>
                                    </li>
                                </ul>
                                <section class="order-info">
                                    <p>共<span class="goods-count">{{ item.order_goods.length }}</span>件商品</p>
                                    <p>创建时间：<span class="create-time">{{ item.create_time }}</span></p>
                                    <p>收货地址：{{ item.order_address[0].area + item.order_address[0].detail }}</p>
                                    <van-button v-if="curActiveTab === 3" type="danger" size="small" class="confirm-receipt" @click="orderOpt(item.order_no)">确认收货</van-button>
                                </section>
                            </div>
                        </section>
                    </div>
                </b-scroll>

                <article class="empty" v-if="!loadingStatus && !orderList.length">
                    {{ userToken ? '暂无相关订单~~' : '请先登录噢~~' }}
                </article>
            </div>
            <!-- 加载状态 -->
            <loading :loadingStatus="loadingStatus" type="spinner" />
        </section>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar';
import BScroll from '@/components/BScroll';
import { GoodsMixin } from '@/mixins/goodsMixin';
import ajax from '@/api';

export default {
    name: 'OrderManage',
    mixins: [GoodsMixin],
    components: { TopBar, BScroll },
    data() {
        return {
            orderList: [], // 订单数据
            tables: ["全部", "待付款", "待发货", "待收货", "已完成"], // tab 导航标题
            curActiveTab: 0, // 当前激活 tab 索引
        }
    },
    created() {
        let { status } = this.$route.query || 0;
        this.curActiveTab = status;
        this._getOrderList();
    },
    methods: {
        /**
         * 获取订单列表
         */
        async _getOrderList() {
            this.orderList = [];
            const res = await ajax.getOrderList({ status: this.curActiveTab });
            this.loadingStatus = false;
            if (res.code === 0) {
                this.orderList = res.data;
            }
        },
        async orderOpt(order_no) {
            const res = await ajax.orderOpt({ order_no, status: 4 });
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>
