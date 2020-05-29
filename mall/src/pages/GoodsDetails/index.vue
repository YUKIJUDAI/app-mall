<template>
    <div class="goods">
        <b-scroll class="content-scroll" ref="scrollRef">
            <div class="container">
                <!-- 商品图片轮播图 -->
                <van-swipe class="goods-swipe" :autoplay="3000" :duration="1500" :touchable="false" @change="onChangeSwipe">
                    <van-swipe-item v-for="n in 1" :key="n">
                        <img v-lazy="goodsInfo.goods_thumbnail_url" @click="previewImg" />
                    </van-swipe-item>
                    <!-- 自定义指示器 -->
                    <!-- <article class="custom-indicator" slot="indicator">{{ currentImg + 1 }}/4</article> -->
                </van-swipe>
                <!-- 商品信息 -->
                <section class="goods-info">
                    <p class="goods-name">{{ goodsInfo.goods_name }}</p>
                    <!-- <span class="goods-price">￥{{ goodsInfo.min_group_price }}</span> -->
                </section>
                <!-- 商品运费 -->
                <section class="goods-express">
                    <span class="goods-ex">￥{{ goodsInfo.min_group_price/100 }}</span>
                    <!-- <span class="goods-ex">运费：0</span> -->
                    <!-- <span class="goods-amount">剩余：{{ goodsInfo.amount }}</span> -->
                    <span class="goods-collection" @click="collectionHandle">
                        收藏：
                        <van-icon :name="isCollection ? 'like' : 'like-o'" class="goods-like" />
                    </span>
                </section>
                <!-- 商品店铺 -->
                <section class="goods-store">
                    <div class="store-left">
                        <van-icon name="shop-o" />
                        <span class="store-name">{{goodsInfo.mall_name}}</span>
                        <van-tag class="store-tag" type="danger">官方</van-tag>
                    </div>
                    <!-- <div class="store-right">
                        <span class="store-enter">进入店铺</span>
                        <van-icon name="arrow" />
                    </div> -->
                </section>
                <!-- 商品详情 -->
                <section class="goods-tabs">
                    <div>
                        <img v-for="(item,i) in goodsInfo.goods_gallery_urls" :key="i" :src="item">
                    </div>
                    <!-- <van-tabs v-model="currentTab" color="#e61e41">
                        <van-tab v-for="item of tabs" :key="item.id" :title="item.title">
                            <div v-show="currentTab == 0" v-html="goodsInfo.detail"></div>
                            <div v-show="currentTab == 1" class="comment-wrapper">
                                <div v-if="!commentList.length" class="no-comment">该商品暂无评论噢~~</div>
                            </div>
                        </van-tab>
                    </van-tabs> -->
                </section>
            </div>
        </b-scroll>

        <!-- 立即购买弹出层 -->
        <transition name="bounce-drawer">
            <div v-show="showBuyDrawer" class="drawer-buy">
                <!-- 商品信息 -->
                <section class="drawer-goods-info">
                    <img v-lazy="goodsInfo.goods_thumbnail_url" />
                    <div class="goods-info">
                        <p class="goods-name">{{ goodsInfo.goods_name }}</p>
                        <p class="goods-pic">
                            <span>￥</span>
                            <span>{{ (goodsInfo.min_group_price * buyCount/100) | toFixed }}</span>
                        </p>
                    </div>
                </section>
                <!-- 购买数量 -->
                <section class="drawer-goods-count">
                    <div class="buy-total">
                        <p>购买数量：<span>{{ buyCount }}</span></p>
                        <!-- <span>剩余 {{ goodsInfo.amount }} 件</span> -->
                    </div>
                    <div class="change-total">
                        <van-stepper v-model="buyCount" disable-input />
                    </div>
                </section>
                <!-- 立即购买 -->
                <section class="drawer-buy-now" @click="nowBuy">立即购买</section>
            </div>
        </transition>
        <!-- 蒙层 -->
        <transition name="fade">
            <article class="mask" v-show="showBuyDrawer" @click="showBuyDrawer = false"></article>
        </transition>

        <!-- 底部购买 -->
        <article class="goods-buy">
            <!-- 首页 -->
            <section class="com-icon home" @click="$router.push({ name: 'Home' })">
                <van-icon name="wap-home" />
                <span>首页</span>
            </section>
            <!-- 购物车 -->
            <section class="com-icon cart" @click="$router.push({ name: 'Cart' })">
                <van-icon name="shopping-cart-o" />
                <span>购物车</span>
            </section>
            <!-- 加入购物车 -->
            <section class="com-text add-cart" @click="addToShopCart">加入购物车</section>
            <!-- 立即购买 -->
            <section class="com-text buy-now" @click="popupBuyDrawer">立即购买</section>
        </article>

        <!-- 后退 -->
        <back @backEvt="back" />
        <!-- 加载状态 -->
        <loading :loadingStatus="loadingStatus" />
    </div>
</template>

<script>
import Back from '@/components/Back';
import BScroll from '@/components/BScroll';
import { ImagePreview } from 'vant'; // 图片预览
import { GoodsMixin } from '@/mixins/goodsMixin';
import ajax from '@/api';

export default {
    name: "GoodsDetails",
    mixins: [GoodsMixin],
    components: { Back, BScroll },
    props: ['goodsId'],
    data() {
        return {
            goodsInfo: {}, // 商品信息
            currentImg: 0, // 当前显示图片索引
            isCollection: false, // 是否收藏 | ture: 收藏  false: 未收藏
            tabs: [{ id: 0, title: '商品详情' }], // 标签页
            currentTab: 0, // 当前标签页索引
            commentList: [], // 评论
            showBuyDrawer: false, // 是否显示购买抽屉
            buyCount: 1, // 购买数量
        }
    },
    watch: {
        $route(to, from) {
            (to.name === 'GoodsDetails') && this._goodsDetails(this.goodsId);
        }
    },
    created() {
        this._goodsDetails(this.goodsId);
        this.userToken && this._queryCollection(this.goodsId);
    },
    methods: {
        /**
         * 商品详情
         */
        async _goodsDetails(goods_id) {
            let res = await ajax.getGoodsDetails(goods_id);
            this.loadingStatus = false;
            if (res.code === 0) {
                this.goodsInfo = res.data[0];
            }
            if (this.goodsInfo) {
                document.title = this.goodsInfo.goods_name;
                // 添加该商品到浏览历史 | 方法在 GoodsMixin 中
                setTimeout(() => {
                    this.setBrowseHistory(this.goodsInfo);
                }, 300);
            }
        },
        /**
         * 查询商品是否已收藏
         */
        async _queryCollection(goods_id) {
            const res = await ajax.queryCollection(goods_id);
            if (res.code === 0) {
                this.isCollection = (res.code === 0) ? true : false;
            }
        },
        /**
         * 监听一页轮播结束事件
         */
        onChangeSwipe(index) { this.currentImg = index },
        /**
         * 预览图片
         */
        previewImg() {
            ImagePreview({
                images: new Array(1).fill(this.goodsInfo.goods_thumbnail_url),
                showIndicators: true,
            });
        },
        /**
         * 收藏、取消处理
         */
        async collectionHandle() {
            if (!this.userToken) {
                this.$router.push({ name: 'Login' });
                return;
            }
            let isCollection = this.isCollection;
            let goodsId = this.goodsId;

            if (!isCollection) {
                // 收藏行为
                let res = await ajax.collectionHandle(goodsId); // 1: 指收藏
                if (res.code == 0) this.isCollection = true;
                this.$toast(res.msg);
            } else {
                // 取消收藏行为
                let res = await ajax.collectionCancleHandle(goodsId); // 0: 指取消收藏
                if (res.code == 0) this.isCollection = false;
                this.$toast(res.msg);
            }
        },
        /**
         * 加入购物车
         */
        async addToShopCart() {
            if (!this.userToken) {
                this.$router.push({ name: 'Login' });
                return;
            }
            this.setShoppingCartList(Object.assign(this.goodsInfo, { num: 1 }));
            this.$toast("加入购物车成功");
        },
        /**
         * 弹出立即购买抽屉
         */
        popupBuyDrawer() { this.showBuyDrawer = true; },
        /**
         * 立即购买
         */
        nowBuy() {
            if (!this.userToken) {
                this.$router.push({ name: 'Login' });
                return;
            }
            // 整合数据
            let nowBuyList = [{
                goods_id: this.goodsInfo.goods_id,
                goods_name: this.goodsInfo.goods_name,
                goods_thumbnail_url: this.goodsInfo.goods_thumbnail_url,
                num: this.buyCount,
                min_group_price: this.goodsInfo.min_group_price
            }];
            // 将订单列表存入 Vuex，方法在 goodsMixin 中
            this.setOrderPaymentList(nowBuyList);
            this.$router.push({ name: 'OrderPayment' });
        }
    },
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>