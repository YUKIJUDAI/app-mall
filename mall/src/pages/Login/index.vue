<template>
    <div class="login" v-show="showFlag">
        <!-- 登录 -->
        <transition name="login-slide">
            <article class="form-container" v-if="switchFlag === 1">
                <h2 class="title">{{["","用户","商家"][type]}}登录</h2>
                <!-- 手机号码 -->
                <section class="input-wrapper" :class="[ focusIndex === 1 ? 'focus-a' : '' ]">
                    <input type="text" class="mobile-phone" @focus="handleFocus(1)" @blur="handleBlur" v-model="username" placeholder="用户邮箱" autocomplete="off" />
                </section>
                <!-- 密码 -->
                <section class="input-wrapper" :class="[ focusIndex === 2 ? 'focus-a' : '' ]">
                    <input type="password" class="u-password" @focus="handleFocus(2)" @blur="handleBlur" v-model="password" placeholder="密码" autocomplete="off" />
                </section>
                <!-- 图形验证码 -->
                <section class="input-wrapper" :class="[ focusIndex === 3 ? 'focus-a' : '' ]">
                    <input type="text" class="verify-code" @focus="handleFocus(3)" @blur="handleBlur" v-model="code" maxlength="4" placeholder="验证码" autocomplete="off" />
                    <div @click="_updatePicCode">
                        <img ref="picCode" class="pic-code" :src="'http://hao.lethink.net/member/captcha?mark=' + code_mark" title="看不清？点击刷新" />
                    </div>
                </section>
                <!-- 登录按钮 -->
                <van-button v-if="!isLoading" size="large" color="#e61e41" @click="login" text="登录" />
                <van-button v-else size="large" loading loading-type="spinner" loading-text="正在登录 ..." color="#e61e41" />
                <!-- 前往注册 -->
                <section class="register-entry">
                    <span @click="changeType">{{["","商家版","用户版"][type]}}</span>
                    <span @click="switchForm(2)">注册账号</span>
                </section>
            </article>
        </transition>

        <!-- 注册 -->
        <transition name="reg-slide">
            <article class="form-container" v-if="switchFlag === 2">
                <h2 class="title">{{["","用户","商家"][type]}}注册</h2>
                <!-- 用户名 -->
                <section class="input-wrapper" :class="[ focusIndex === 1 ? 'focus-a' : '' ]">
                    <input type="text" class="u-name" @focus="handleFocus(1)" @blur="handleBlur" v-model="username" placeholder="用户邮箱" autocomplete="off" />
                </section>
                <!-- 密码 -->
                <section class="input-wrapper" :class="[ focusIndex === 2 ? 'focus-a' : '' ]">
                    <input type="password" class="u-password" @focus="handleFocus(2)" @blur="handleBlur" v-model="password" placeholder="密码" autocomplete="off" />
                </section>
                <section class="input-wrapper" :class="[ focusIndex === 3 ? 'focus-a' : '' ]">
                    <input type="password" class="u-password" @focus="handleFocus(3)" @blur="handleBlur" v-model="password_confirm" placeholder="确认密码" autocomplete="off" />
                </section>
                <!-- 手机号 -->
                <section class="input-wrapper" :class="[ focusIndex === 4 ? 'focus-a' : '' ]">
                    <input type="text" class="mobile-phone" @focus="handleFocus(4)" @blur="handleBlur" v-model="phone" maxlength="11" placeholder="手机号码" autocomplete="off" />
                </section>
                <!-- qq -->
                <section class="input-wrapper" :class="[ focusIndex === 5 ? 'focus-a' : '' ]">
                    <input type="text" class="mobile-phone" @focus="handleFocus(5)" @blur="handleBlur" v-model="qq" placeholder="QQ" autocomplete="off" />
                </section>
                <!-- 图片验证码 -->
                <section class="input-wrapper" :class="[ focusIndex === 6 ? 'focus-a' : '' ]">
                    <input type="text" class="verify-code" @focus="handleFocus(6)" @blur="handleBlur" v-model="code" maxlength="4" placeholder="验证码" autocomplete="off" />
                    <div @click="_updatePicCode">
                        <img ref="picCode" class="pic-code" :src="'http://hao.lethink.net/member/captcha?mark=' + code_mark" title="看不清？点击刷新" />
                    </div>
                </section>
                <!-- 注册按钮 -->
                <van-button v-if="!isLoading" size="large" color="#e61e41" @click="register" text="注册" />
                <van-button v-else size="large" loading loading-type="spinner" loading-text="正在注册 ..." color="#e61e41" />
                <!-- 前往登录 -->
                <section class="login-entry">
                    <span @click="changeType">{{["","商家版","用户版"][type]}}</span>
                    <span @click="switchForm(1)">登录账号</span>
                </section>
            </article>
        </transition>

        <!-- 后退 -->
        <back @backEvt="back" />
    </div>
</template>

<script>
import Back from '@/components/Back';
import { GoodsMixin } from '@/mixins/goodsMixin';
import ajax from '@/api';

export default {
    name: "Login",
    mixins: [GoodsMixin],
    components: { Back },
    data() {
        return {
            showFlag: false,
            type: 1, // 用户: 1,商家：2
            switchFlag: 1, // 登录: 1, 注册: 2
            focusIndex: 0, // 输入框聚焦索引
            username: '', // 用户名
            password: '', // 密码
            password_confirm: '',//确认密码
            phone: '', // 手机号
            qq: '',// qq号码
            code: '', // 图形验证码
            code_mark: 0,
            isLoading: false, // 登录 或 注册按钮状态
            countdownText: '', // 倒计时文本
            cDTime: 60, // 60 秒倒计时
        }
    },
    created() {
        const username = this.$route.query.username;
        const password = this.$route.query.password;
        if (window.AndroidJs && window.AndroidJs.getToken2()) {
            this.setUserToken(window.AndroidJs.getToken2()) && setTimeout(() => this.$router.replace("/home"), 1000);
        } else if (username && password) {
            this.username = username;
            this.password = password;
            this.login2();
        } else {
            this.showFlag = true;
        }
        this.$nextTick(() => this._updatePicCode());
    },
    methods: {
        /**
         * 随机key
         */
        getKey() {
            this.code_mark = new Date().getTime() + "" + (Math.floor(Math.random() * (99 - 10 + 1)) + 10);
        },
        /**
         * 改变type
         */
        changeType() {
            this.type = this.type === 1 ? 2 : 1;
        },
        /**
         * 处理输入框聚焦
         */
        handleFocus(index) { this.focusIndex = index; },
        /**
         * 处理输入框失焦
         */
        handleBlur() { this.focusIndex = 0; },
        /**
         * 切换表单 & 做一些重置操作
         * @param {Number} flag 表单标识 1：登录 2：注册
         */
        switchForm(flag) {
            this.switchFlag = flag;
            this.$nextTick(() => this._updatePicCode());
            this.focusIndex = 0; // 重置表单索引
            this.isLoading = false; // 重置登录 或 注册按钮状态
            let resetData = ['username', 'password', 'password_confirm', 'code', 'phone', 'qq'];
            for (let item of resetData) {
                this[item] = ''
            }
        },
        /**
         * 注册
         */
        async register() {
            this.isLoading = true; // 按钮加载状态
            let { username, password, password_confirm, phone, qq, code_mark, code, type } = this.$data;
            try {
                let res = await ajax.register({ username, password, password_confirm, phone, qq, code_mark, code, type });
                // 反馈消息
                this.$toast(res.msg);
                this.isLoading = false;
                // 跳转到登录 
                res.code === 0 && this.switchForm(1);
            } catch (error) {
                this.isLoading = false;
                console.log(error);
            }
        },
        /**
         * 登录
         */
        async login() {
            this.isLoading = true; // 按钮加载状态
            let { username, password, code_mark, code, type } = this.$data;
            let login_username = username;
            let login_password = password;
            try {
                let res = await ajax.login({ login_username, login_password, code_mark, code, type });
                // 反馈消息
                if (res.code !== 0) {
                    this.$toast(res.msg);
                    this.isLoading = false; // 重置按钮状态
                }

                // 设置 token | 方法在 GoodsMixin
                (res.data) && this.setUserToken(res.data) && setTimeout(() => this.$router.back(), 1000);
            } catch (error) {
                this.isLoading = false;
                console.log(error);
            }
        },
        /**
         * 登录2
         */
        async login2() {
            let { username, password } = this.$data;
            let login_username = username;
            let login_password = password;
            try {
                let res = await ajax.login2({ login_username, login_password });
                // 反馈消息
                if (res.code !== 0) {
                    this.$toast(res.msg);
                }
                // 设置 token | 方法在 GoodsMixin
                (res.data) && this.setUserToken(res.data) && setTimeout(() => this.$router.replace("/home"), 1000);
            } catch (error) {
                console.log(error);
            }
        },
        /**
         * 更新图形验证码
         */
        _updatePicCode() {
            this.getKey();
        }
    }
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>