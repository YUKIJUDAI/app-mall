<template>
    <transition name="bounce">
        <div class="setting-info" v-show="isShowSetting">
            <top-bar title="个人资料" hasClose @close="$emit('closeSetting', $event)"></top-bar>
            <!-- 用户名 -->
            <section class="options">
                <p class="title">用户名</p>
                <input type="text" class="u-name" v-model="username" maxlength="10" placeholder="用户名" autocomplete="off" readonly />
            </section>
            <section class="options">
                <p class="title">账号类型</p>
                <input type="text" class="u-name" :value="type | _type" maxlength="10" placeholder="用户名" autocomplete="off" readonly />
            </section>
            <!-- 邮箱 -->
            <section class="options">
                <p class="title">手机号码</p>
                <input type="text" class="u-email" v-model="phone" maxlength="11" placeholder="手机号码" autocomplete="off" />
            </section>
            <section class="options">
                <p class="title">QQ</p>
                <input type="text" class="u-email" v-model="qq" maxlength="12" placeholder="QQ" autocomplete="off" />
            </section>

            <section class="btn-container">
                <div class="common save-btn" @click="saveNewUserInfo">保存</div>
                <div class="common close-btn" @click="$emit('closeSetting', false)">取消</div>
            </section>
        </div>
    </transition>
</template>

<script>
import TopBar from '@/components/TopBar';
import { GoodsMixin } from '@/mixins/goodsMixin';
import ajax from '@/api';

export default {
    name: "UserInfo",
    mixins: [GoodsMixin],
    components: { TopBar },
    props: {
        isShowSetting: { type: Boolean, default: false } // 是否显示设置界面
    },
    filters: {
        _type(val) {
            return ["", "用户账号", "供货商账号"][val];
        }
    },
    data() {
        return {
            username: '', // 用户名
            phone: '', // 邮箱
            qq: '', // qq号
            type: 1
        };
    },
    watch: {
        isShowSetting(newValue) {
            newValue && this._getUserInfo();
        },
    },
    methods: {
        /**
         * 重置用户信息
         */
        _resetUserInfo() {
            this.username = '';
            this.phone = '';
            this.qq = '';
            this.type = 1;
        },
        /**
         * 获取用户信息
         */
        async _getUserInfo() {
            try {
                let res = await ajax.getUserInfo({ id: "" });
                if (res.code === 0) {
                    this.username = res.data[0].username;
                    this.phone = res.data[0].phone;
                    this.qq = res.data[0].qq;
                    this.type = res.data[0].type;
                }
            } catch (error) {
                if (error.response && error.response.status === 401 || 400 || 403) {
                    this._resetUserInfo();
                    this.$toast(error.response.data.msg); // 反馈信息
                } else {
                    console.log(error);
                }
            }
        },
        /**
         * 更新个人信息
         */
        async saveNewUserInfo() {
            let newUserInfo = {
                tel: this.phone,
                qq: this.qq
            };
            const res = await ajax.updateUserInfo(newUserInfo);
            if (res.code === 0) {
                // 设置 token | 方法在 GoodsMixin
                setTimeout(() => this.$emit('closeSetting', false), 1000);
            }
            this.$toast(res.msg);
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
.setting-info {
    .van-picker__cancel,
    .van-picker__confirm {
        color: $color;
    }
}
</style>