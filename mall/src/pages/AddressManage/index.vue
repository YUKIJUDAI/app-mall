<template>
    <div class="address-manage">
        <top-bar title="地址管理" hasBack></top-bar>

        <section class="address-container">
            <div v-if="!loadingStatus && !addressList.length" class="empty-address-list">
                暂无收货地址 ~~
            </div>
            <b-scroll class="content-scroll" v-if="addressList.length">
                <van-address-list v-model="chosenAddressId" default-tag-text="默认" :list="addressList" @edit="editAddress" @select="selectAddress" @add="$router.push({ name: 'AddressEdit' })" />
            </b-scroll>

            <!-- 加载状态 -->
            <loading :loadingStatus="loadingStatus" type="spinner" />
        </section>
        <!-- 底部新增按钮 -->
        <section class="add-address" v-if="!loadingStatus && !addressList.length" @click="$router.push({ name: 'AddressEdit' })">新增地址</section>
    </div>
</template>

<script>
import TopBar from '@/components/TopBar';
import BScroll from '@/components/BScroll';
import { GoodsMixin } from '@/mixins/goodsMixin';
import ajax from '@/api';

export default {
    name: 'AddressManage',
    mixins: [GoodsMixin],
    components: { TopBar, BScroll },
    data() {
        return {
            addressList: [], // 地址列表
            chosenAddressId: '0', // 当前选中地址的 id
            isOrderPayEnter: false, // 是否是从订单支付页进入
        }
    },
    // 在进入该组件路由之前被调用
    beforeRouteEnter(to, from, next) {
        // 通过 `vm` 访问该组件实例
        next(vm => {
            // 若是从订单支付页进入，设为 ture
            if (from.name === 'OrderPayment') vm.isOrderPayEnter = true;
        });
    },
    created() {
        this._getAddressList();
    },
    methods: {
        /**
         * 获取地址列表
         */
        async _getAddressList() {
            const res = await ajax.getAddressList();
            this.loadingStatus = false;
            if (res.code === 0) {
                let defAddress;
                // 反转数组
                res.data.data.forEach((item, i) => {
                    item.address = item.area + item.detail;
                    if (item.is_default === 1) {
                        item.isDefault = true;
                        defAddress = item;
                        res.data.data.splice(i, 1); // 删除它
                        res.data.data.unshift(defAddress); // 将元素添加到数组的开头
                    }
                });
                this.addressList = res.data.data;
                console.log(this.addressList)

            }
        },
        /**
        * 选择地址
        */
        selectAddress(item) {
            // 判断是不是从订单支付页面过来的
            if (this.isOrderPayEnter) {
                this.setAddressInfo(item);
                setTimeout(() => {
                    this.$router.back();
                }, 500);
            }
        },
        /**
         * 编辑地址
         */
        editAddress(item) {
            var data = item;
            data.areaCode = data.area_code + "";
            data.province = data.area.split("-")[0];
            data.city = data.area.split("-")[1];
            data.county = data.area.split("-")[2];
            data.addressDetail = data.detail;
            data.isDefault = !Boolean(data.is_default - 1);
            this.setAddressInfo(data);
            this.$router.push({ name: 'AddressEdit' });
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>

<style lang="scss">
$color: #e61e41;
// 强行改变 vant 中默认样式
.van-address-item {
    .van-radio__icon--checked {
        .van-icon {
            background: $color;
            border-color: $color;
        }
    }
}
</style>
