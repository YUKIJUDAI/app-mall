<template>
    <div class="management-list">
        <top-bar title="商品管理" hasBack outBrowse></top-bar>
        <section class="management-container">
            <van-tabs v-model="curActiveTab" color="#e61e41" @change="_getProductList">
                <van-tab v-for="(tab, index) in tables" :key="index" :title="tab">
                </van-tab>
            </van-tabs>
            <section class="header" v-if="curActiveTab === 1">
                <p class="text">共选择<span class="mark">{{ checkedLength }}</span>件商品</p>
                <p class="text" @click="status(0)">下架</p>
            </section>
            <section class="header" v-if="curActiveTab === 2">
                <p class="text">共选择<span class="mark">{{ checkedLength }}</span>件商品</p>
                <p class="text" @click="status(1)">上架</p>
            </section>
            <b-scroll class="content-scroll" v-if="dataList.length" :data="dataList" pullup v-on:scrollEnd="collectionScrollEnd">
                <goods-list :goodsList="dataList" isCommodityList :isLoadMore="isLoadMore" v-on:deleteProduct="deleteProduct"></goods-list>
                </ul>
            </b-scroll>

            <div v-if="!loadingStatus && !dataList.length" class="empty-management-list">
                暂无发布商品 ~~
            </div>
            <!-- 加载状态 -->
            <loading :loadingStatus="loadingStatus" />
        </section>
        <!-- 底部新增按钮 -->
        <section class="add-address" v-if="!loadingStatus" @click="$router.push({ name: 'AddManagement' })">新增商品</section>
    </div>
</template>

<script>
import { Dialog } from 'vant';
import TopBar from '@/components/TopBar';
import BScroll from '@/components/BScroll';
import GoodsList from '@/components/GoodsList';
import { GoodsMixin } from '@/mixins/goodsMixin';
import { loadMixin } from '@/mixins/loadMixin';
import ajax from '@/api';

export default {
    name: 'Collection',
    mixins: [GoodsMixin, loadMixin],
    components: { TopBar, BScroll, GoodsList },
    data() {
        return {
            tables: ["全部", "上架中", "已下架"], // tab 导航标题
            curActiveTab: 0, // 当前激活 tab 索引
            dataList: [],
            page: 1, // 页数
            isLoadMore: true, // 是否加载更多
            loadingStatus: false,
        }
    },
    computed: {
        checkedLength() {
            return this.dataList.filter(item => item.checked).length;
        }
    },
    created() {
        this._getProductList(this.isLoadMore);
    },
    methods: {
        /**
         * 获取用户发布的商品列表
         * @param {Boolean} isLoadMore 是否加载更多
         */
        async _getProductList(isLoadMore) {
            // 判断上一次请求是否完成 | 必须等待上一次请求完成才继续向下执行，方法在 loadMixin 中
            if (this.isLocked()) return;
            // 上锁，方法在 loadMixin 中
            this.locked();
            const res = await ajax.getProductList({ status: ["", 1, 0][this.curActiveTab] });
            this.loadingStatus = false;
            this.unLocked();
            if (res.code === 0) {
                // this.setDataTotal(res.total); // 设置数据总数，方法在 loadMixin 中
                // 判断是加载更多还是一次新的请求，方法在 loadMixin 中
                // isLoadMore ? this.addMoreData(res.collectionList) : this.dataList = res.collectionList;
                this.dataList = res.data;
            }
        },
        /**
         * 删除商品
         */
        async deleteProduct(item, index) {
            Dialog.confirm({
                message: '确定要删除此商品吗？',
            })
                .then(() => {
                    ajax.delProduct({ goods_id: item.goods_id }).then(res => {
                        if (res.code == 0) this.dataList.splice(index, 1);
                        this.$toast(res.msg);
                    });
                })
                .catch(() => { });
        },
        /**
         * 商品上下架
         */
        status(status) {
            Dialog.confirm({
                message: '确定要' + ["", "上架", "下架"][+status] + '商品吗？',
            })
                .then(() => {
                    var data = this.dataList.filter(item => item.checked);
                    data.forEach((item, i) => data[i] = item.id);
                    data = data.join(",");
                    ajax.statusProduct({ id: data, status }).then(res => {
                        if (res.code == 0) this._getProductList();
                        this.$toast(res.msg);
                    });
                })
                .catch(() => { });

        },
        /**
         * 监听 better-scroll 滚动到底部事件，加载更多数据
         */
        collectionScrollEnd() {
            return;
            if (this.dataList.length >= 10) {
                if (this.hasMoreData()) {
                    this.isLoadMore = true;
                    this.page++;
                    this.getProductList(this.isLoadMore);
                } else {
                    this.isLoadMore = false;
                    this.$toast('没有更多数据了~~');
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
$color: #e61e41;
.management-list {
    .management-container {
        position: fixed;
        top: 11.5vw;
        left: 0;
        right: 0;
        bottom: 0;
        .content-scroll {
            position: absolute;
            overflow: hidden;
            top: calc(44px + 2rem);
            left: 0;
            right: 0;
            bottom: 0;
        }
        .empty-management-list {
            text-align: center;
            margin-top: 100px;
            letter-spacing: 2px;
            color: #999;
        }
    }
    .header {
        display: flex;
        justify-content: space-between;
        font-size: 3.5vw;
        padding: 0.5rem 1rem;
        .mark {
            color: red;
            padding: 0 0.3rem;
        }
    }
    .goods-list {
        .goods-item {
            display: flex;
            box-sizing: border-box;
            padding: 2vw;
            border-bottom: 1px solid #eee;
            .checked {
                display: flex;
                align-items: center;
                padding-right: 3vw;
            }
            .goods-left {
                flex-basis: 30%;
                img {
                    width: 100%;
                    height: 100%;
                    box-shadow: 0 0.533vw 2.133vw #f0f1f2;
                }
            }
        }
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
</style>