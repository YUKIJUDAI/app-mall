<template>
    <div class="address-edit">
        <top-bar title="编辑地址" hasBack outAddressEdit v-on:outAddressEditEvt="outAddressEditEvt"></top-bar>

        <!-- Vant AddressEdit 地址编辑 -->
        <van-address-edit show-set-default show-search-result :area-list="areaList" :address-info="addressInfo" :show-delete="showDelete" :is-saving="isSaving" :is-deleting="isDeleting" @save="saveHandle" @delete="deleteHandle" />
    </div>
</template>

<script>
import TopBar from '@/components/TopBar';
import { GoodsMixin } from '@/mixins/goodsMixin';
import ajax from '@/api';

export default {
    name: 'AddressEdit',
    mixins: [GoodsMixin],
    components: { TopBar },
    data() {
        return {
            areaList: require('@/assets/js/area').default, // 地区列表
            showDelete: false, // 是否显示删除按钮
            isSaving: false, // 是否显示保存按钮加载动画
            isDeleting: false, // 是否显示删除按钮加载动画
        }
    },
    created() {
        let self = this;
        // 判断是否为修改地址 | 该值存在 Vuex 中
        if (Object.keys(self.addressInfo).length) {
            this.showDelete = true;
        }
    },
    methods: {
        /**
         * 点击保存按钮
         * @param {Object} 表单内容
         */
        async saveHandle(content) {
            if (!this.userToken) {
                this.$router.push({ name: 'Login' });
                return;
            }

            this.isSaving = true;
            let self = this;

            const data = {
                area_code: content.areaCode,
                name: content.name, // 收货人姓名
                tel: content.tel, // 收货人电话
                area: content.province + "-" + content.city + "-" + content.county, // 城市
                detail: content.addressDetail, // 详细地址
                is_default: +!content.isDefault + 1, // 是否为默认地址
                id: Object.keys(self.addressInfo).length ? self.addressInfo.id : null // 判断是否为修改地址
            }
            const res = data.id ? await ajax.editAddress(data) : await ajax.addAddress(data);
            this.isSaving = false;
            this.$toast(res.msg);
            if (res.code === 0) {
                setTimeout(() => {
                    this.$router.back();
                    // 清除地址信息，方法在 goodsMixin 中
                    this.deleteAddressInfo();
                }, 300);
            }
        },
        /**
         * 点击删除按钮
         * @param {Object} 表单内容
         */
        async deleteHandle(content) {
            this.isDeleting = true;
            const res = await ajax.delAddress(content.id);
            if (res.code === 0) {
                this.isDeleting = false;
                this.$toast(res.msg);
                setTimeout(() => {
                    this.$router.back();
                    // 清除地址信息，方法在 goodsMixin 中
                    this.deleteAddressInfo();
                }, 300);
            }
        },
        /**
         * 退出地址编辑 & 清除地址信息
         */
        outAddressEditEvt() {
            this.$router.back();
            setTimeout(() => {
                // 清除地址信息，方法在 goodsMixin 中
                this.deleteAddressInfo();
            }, 300);
        }
    }
}
</script>

<style lang="scss">
$color: #e61e41;

// 强行改变 vant 中默认样式
.address-edit {
    .van-switch--on {
        background: $color;
    }

    .van-address-edit__buttons {
        .van-button--danger {
            background: $color;
            border: 1px solid $color;
        }
        .van-button--default {
            border: 1px solid $color;
            color: $color;
        }
    }
}

.van-picker__cancel,
.van-picker__confirm {
    color: $color;
}
.van-dialog__confirm {
    color: $color;
}
</style>