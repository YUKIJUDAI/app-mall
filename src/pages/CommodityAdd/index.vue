<template>
    <div class="commodity-edit">
        <top-bar title="新增商品" hasBack></top-bar>
        <div class="commodity-form">
            <van-form>
                <van-field v-model="item.id" name="商品地址" label="商品地址" placeholder="请输入商品地址" v-for="(item,i) in goods_ids" :key="i" />
            </van-form>
        </div>
        <!-- 底部新增按钮 -->
        <section class="add-address" @click="saveHandle()">确认新增</section>
        <van-popup v-model="show" style="width:80%;text-align:center">
            <ul class="result-ul">
                <li v-for="(item,i) in resultList" :key="i">{{i + 1}}.商品<span>{{item.name | strFilter}}</span>,{{item.status}}</li>
            </ul>
            <van-button type="info" size="small" class="result-btn" @click="confirm">确认</van-button>
        </van-popup>
    </div>
</template>

<script>
import qs from "qs";
import TopBar from '@/components/TopBar';
import { GoodsMixin } from '@/mixins/goodsMixin';
import ajax from '@/api';

export default {
    name: 'AddressEdit',
    mixins: [GoodsMixin],
    components: { TopBar },
    filters: {
        strFilter(val) {
            return val.length > 10 ? val.substr(0, 10) + "..." : val;
        }
    },
    data() {
        return {
            goods_ids: [{ "id": "" }, { "id": "" }, { "id": "" }, { "id": "" }, { "id": "" }],
            isSaving: false,
            show: false,
            resultList: []
        }
    },
    methods: {
        /**
         * 点击保存按钮
         * @param {Object} 表单内容
         */
        async saveHandle(content) {

            this.isSaving = true;
            var data = JSON.parse(JSON.stringify(this.goods_ids));

            data.forEach((item, i) => { data[i] = qs.parse(item.id.split('?')[1]).goods_id });
            data = data.filter(item => item).join(",");

            const res = await ajax.addProduct({ goods_ids: data });
            this.isSaving = false;
            if (res.code === 0) {
                this.$toast(res.msg);
                setTimeout(() => {
                    this.$router.back();
                }, 300);
            } else if (res.code === 1000) {
                this.show = true;
                this.resultList = res.data;
            } else {
                this.$toast(res.msg);
            }
        },
        confirm() {
            this.show = false;
            setTimeout(() => {
                this.$router.back();
            }, 300);
        }
    }
}
</script>

<style lang="scss">
$color: #e61e41;

// 强行改变 vant 中默认样式
.commodity-edit {
    .commodity-form {
        padding: 14px;
    }
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
    .result-ul {
        padding: 1rem;
        li {
            padding: 0.4rem 0;
        }
        span {
            color: $color;
        }
    }
    .result-btn {
        margin-bottom: 1rem;
    }
    .add-address {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        height: 13.5vw;
        line-height: 13.5vw;
        color: #fff;
        text-align: center;
        letter-spacing: 0.1rem;
        background: $color;
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