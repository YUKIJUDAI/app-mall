<template>
    <div class="order-payment">
        <top-bar title="确认订单" hasBack outOrder v-on:outOrderEvt="outOrderEvt"></top-bar>

        <!-- 收货地址 -->
        <section class="address-container">
            <!-- 不存在默认地址 -->
            <div class="common no-address" v-if="!defAddress.id" @click="$router.push({ name: 'AddressManage' })">
                <van-icon name="add-o" />
                <span>点击添加收货地址</span>
            </div>
            <div class="common address-info" v-else @click="$router.push({ name: 'AddressManage' })">
                <section class="location">
                    <van-icon name="location" color="#fff" />
                </section>
                <section class="address-text">
                    <p class="name-tel">
                        <span class="name">{{ defAddress.name }}</span>
                        TEL : <span class="tel">{{ defAddress.tel }}</span>
                    </p>
                    <p class="address-detail">地址 : {{ defAddress.address }}</p>
                    <p class="hint">(收货不便时,可选择免费待收货服务)</p>
                </section>
                <section class="arrow">
                    <van-icon name="arrow" />
                </section>
            </div>
            <!-- 彩条 -->
            <div class="colour-bar"></div>
        </section>
        <!-- 订单商品 -->
        <b-scroll class="content-scroll" v-if="orderPaymentList.length">
            <goods-list :goodsList="orderPaymentList" :isOrderPaymentList="true"></goods-list>
        </b-scroll>
        <!-- 底部提交支付 -->
        <section class="submit-order">
            <div class="total-price">
                <p class="text">共<span class="mark">{{ orderPaymentList.length }}</span>件，</p>
                <span>合计：</span>
                <span class="money">￥{{ totalPrice }}</span>
            </div>
            <div class="submit-btn" @click="submitOrder">提交订单</div>
        </section>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar';
import BScroll from '@/components/BScroll';
import GoodsList from '@/components/GoodsList';
import { GoodsMixin } from '@/mixins/goodsMixin';
import ajax from '@/api';

export default {
    name: 'OrderPayment',
    mixins: [GoodsMixin],
    components: { TopBar, BScroll, GoodsList },
    data() {
        return {
            defAddress: {}, // 默认地址
        }
    },
    computed: {
        // 计算总价格
        totalPrice() {
            let totalPrice = 0;
            this.orderPaymentList.forEach(item => {
                (totalPrice += parseFloat((item.min_group_price * item.num / 100).toFixed(2)));
            });
            return totalPrice.toFixed(2);
        }
    },
    // 在进入该组件路由之前被调用 | 在导航完成前获取数据
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm._getDefAddress();
            if (!vm.orderPaymentList.length) vm.$router.push({ name: 'Cart' });
        });
    },
    methods: {
        /**
         * 获取默认地址
         */
        async _getDefAddress() {
            this.defAddress = JSON.parse(JSON.stringify(this.addressInfo));
            const res = await ajax.getDefAddress();
            if (res.code === 0) {
                res.data.data[0].address = res.data.data[0].area + res.data.data[0].detail;
                this.defAddress = res.data.data[0];
            } else {
                this.defAddress = JSON.parse(JSON.stringify(this.addressInfo));
            }
        },
        /**
         * 退出订单列表 & 清空订单列表
         */
        outOrderEvt() {
            this.$router.back();
            setTimeout(() => {
                // 方法在 goodsMixin 中
                this.setOrderPaymentList([]); // 清空订单列表
                this.setAddressInfo({}); // 清除临时地址
            }, 300);
        },
        /**
         * 提交订单
         */
        async submitOrder() {
            if (!this.defAddress.id) {
                this.$toast('请添加收货地址');
                return;
            }
            // 提取订单列表中所有商品 id
            var goods = [];
            this.orderPaymentList.map(item => goods.push({ id: item.goods_id, num: item.num }));
            // 整合数据
            let orderInfo = {
                goods: JSON.stringify(goods),
                address: this.defAddress.id // 收货地址
            }

            const res = await ajax.submitOrderHandle(orderInfo);
            if (res.code === 0) {
                this.$toast(res.msg);
                var oldData = JSON.parse(JSON.stringify(this.shoppingCartList));

                for (var i = oldData.length - 1; i >= 0; i--) {
                    if (res.data.includes(oldData[i].goods_id)) {
                        oldData.splice(i, 1);
                    }
                }
                this.updateShoppingCartList(oldData);
                setTimeout(() => {
                    this.setOrderPaymentList([]); // 清空订单列表
                    this.$router.back();
                }, 2000);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>