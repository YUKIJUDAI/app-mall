<template>
    <div class="shop-cart">
        <top-bar title="购物车"></top-bar>

        <div class="shop-cart-container">
            <!-- 空购物车 或者 未登录 -->
            <article v-if="!loadingStatus && !shopCartList.length" class="empty-cart">
                <section class="cart-wrapper">
                    <img class="cart-img" :src="cartImg" />
                </section>
                <section class="desc">{{ userToken ? '购物车快饿扁了/(ㄒoㄒ)/~~' : '请先登录噢~~' }}</section>
                <section class="go-shop" v-if="userToken" @click="$router.push({ name: 'Home' })">去购物</section>
                <section class="login-btn" v-else @click="exit()">去登录</section>
            </article>

            <!-- 购物车内容 -->
            <b-scroll class="content-scroll" v-if="!loadingStatus && shopCartList.length" :data="shopCartList">
                <div class="container">
                    <section class="header">
                        <p class="text">共<span class="mark">{{ shopCartList.length }}</span>件商品</p>
                        <p class="text" @click="isShowMange = !isShowMange">{{ !isShowMange ? '管理' : '完成'}}</p>
                    </section>
                    <!-- 商品列表 -->
                    <ul class="goods-list">
                        <li class="goods-item" v-for="item of shopCartList" :key="item.goods_id">
                            <!-- 选择复选框 -->
                            <section class="checked">
                                <van-checkbox v-model="item.checked" :checked-color="checkedColor" />
                            </section>
                            <!-- 图片 -->
                            <section class="goods-left">
                                <img v-lazy="item.goods_image_url" :onerror="errorImg" />
                            </section>
                            <!-- 商品名、操作 -->
                            <section class="goods-right">
                                <p class="goods-name">{{ item.goods_name }}</p>
                                <div class="wrapper">
                                    <p class="goods-price">￥{{ item.min_group_price * item.num/100 | toFixed }}</p>
                                    <!-- 增加、减少 -->
                                    <section class="stepper">
                                        <i class="minus" @click="editGoodsCount(item, 'minus')"></i>
                                        <span>{{ item.num }}</span>
                                        <i class="plus" @click="editGoodsCount(item, 'plus')"></i>
                                    </section>
                                </div>
                            </section>
                        </li>
                    </ul>
                </div>
            </b-scroll>

            <!-- 计算总价 -->
            <section class="calc-total-wrapper" v-if="!loadingStatus && shopCartList.length">
                <div class="all-checked" @click="toggleAllChecked">
                    <van-checkbox v-model="allChecked" :checked-color="checkedColor" />
                    <span>全选</span>
                </div>

                <div class="common-mge calc-price" v-if="!isShowMange">
                    <van-icon name="gold-coin-o" color="#e61e41" size="1.3rem" />
                    <span class="total-price">{{ totalPrice }}</span>
                </div>
                <div class="common-mge remove-warn" v-else>
                    <van-icon name="warning-o" color="#e61e41" size="1.3rem" />
                    <span>清理</span>
                </div>

                <div class="common-btn calc-btn" v-if="!isShowMange" @click="goPaymentOrder">去结算{{ checkedCount ? `(${ checkedCount })` : '' }}</div>
                <div class="common-btn remove-btn" v-else @click="delCartGoods">删除</div>
            </section>

            <!-- 加载状态 -->
            <loading :loadingStatus="loadingStatus" />
        </div>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar';
import BScroll from '@/components/BScroll';
import { GoodsMixin } from '@/mixins/goodsMixin';
import { exit } from "@/utils/tools";
import ajax from '@/api';

export default {
    name: 'Cart',
    mixins: [GoodsMixin],
    components: { TopBar, BScroll },
    data() {
        return {
            shopCartList: [], // 购物车列表
            cartImg: require('@/assets/imgs/shop.png'), // 购物车图片
            errorImg: 'this.src="' + require('@/assets/imgs/error-img.png') + '"',
            allChecked: false, // 全选
            checkedColor: '#e61e41', // 选中器颜色
            isShowMange: false, // 是否显示管理：移除
            delGoodsIds: [], // 需要移除购物车的商品 ids
        }
    },
    computed: {
        // 计算已勾选的商品数量
        checkedCount() {
            return this.shopCartList.filter(item => item.checked === true).length;
        },
        // 计算总价格
        totalPrice() {
            let totalPrice = 0;
            this.shopCartList.forEach(item => {
                item.checked
                    && (totalPrice += parseFloat((item.min_group_price * item.num / 100).toFixed(2)));
            });
            return totalPrice.toFixed(2);
        }
    },
    watch: {
        checkedCount(newValue) {
            this.allChecked = (newValue === this.shopCartList.length) ? true : false;
        }
    },
    created() {
        this._checkShopCart();
    },
    methods: {
        exit() {
            exit()
        },
        /**
         * 查询购物车数据
         */
        async _checkShopCart() {
            if (!this.userToken) {
                this.loadingStatus = false;
                return;
            }
            this.shopCartList = JSON.parse(JSON.stringify(this.shoppingCartList));
            this.loadingStatus = false;
        },
        /**
         * 编辑商品数量
         * @param {Object} item 商品信息
         * @param {String} editFlag 编辑标签 plus：增加 minus:减少
         */
        async editGoodsCount(item, editFlag) {
            switch (editFlag) {
                case 'minus':
                    if (item.num <= 1) {
                        this.$toast("最少购买 1 件噢~~");
                        return;
                    }
                    --item.num;
                    break;
                case 'plus':
                    if (item.num >= 10000) {
                        this.$toast("最多购买 10000 件噢~~");
                        return;
                    }
                    ++item.num;
                    break;
            }
            this.updateShoppingCartList(this.shopCartList);
            const mallPrice = parseFloat((item.present_price * item.buy_count).toFixed(2)); // 计算总价
        },
        /**
         * 绑定全选、取消
         */
        toggleAllChecked() {
            let newValue = !this.allChecked;
            this.shopCartList.forEach(item => item.checked = newValue);
            console.log(this.shopCartList)
        },
        /**
         * 删除购物车商品
         */
        delCartGoods() {
            this.delGoodsIds = this.shopCartList.filter(item => item.checked === true).map(item => item.goodsId);

            if (!this.delGoodsIds.length) {
                this.$toast('您还没有选择商品噢~~');
                return;
            }

            this.$dialog.confirm({
                title: '提示',
                message: '您确定删除商品吗？',
                confirmButtonText: '确定',
                confirmButtonColor: '#e61e41',
                beforeClose: this.beforeClose
            }).catch(error => {
                this.delGoodsIds = [];
                console.log(error);
            });
        },
        /**
         * Bialog 关闭前的回调函数 | 执行删除购物车商品
         */
        beforeClose(action, done) {
            if (action === 'confirm') {
                var list = this.shopCartList.filter(item => !item.checked);
                this.updateShoppingCartList(list);
                this.$toast("删除成功");
                done();
            } else {
                this.delGoodsIds = [];
                done();
            }
        },
        /**
         * 去订单支付页
         */
        goPaymentOrder() {
            if (!this.checkedCount) {
                this.$toast('您还没有选择商品噢~~');
                return;
            }
            const shopList = this.shopCartList.filter(item => item.checked === true);
            // 将订单列表存入 Vuex，方法在 goodsMixin 中
            this.setOrderPaymentList(shopList);
            this.$router.push({ name: 'OrderPayment' });
        }
    },
    watch: {
        shoppingCartList(val) {
            this.shopCartList = JSON.parse(JSON.stringify(val));
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>