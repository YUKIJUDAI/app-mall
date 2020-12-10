<template>
    <div id="hot-goods">
        <section class="title">
            <span class="name">热卖商品</span>
        </section>
        <ul>
            <li class="hot-goods-item" v-for="item of hotGoods" :key="item.id" @click="goGoodsDetails(item.goods_id)">
                <img v-lazy="item.goods_thumbnail_url" class="hot-goods-img" />
                <p class="name">{{ item.goods_name }}</p>
                <p class="price">
                    <span class="code">￥</span>
                    <span class="mall-price">{{ item.min_group_price/100 }}</span>
                    <!-- <span class="min-price">{{ item.min_group_price }}</span> -->
                </p>
            </li>
        </ul>
    </div>
</template>

<script>
import { GoodsMixin } from '@/mixins/goodsMixin';

export default {
    name: 'HotGoods',
    mixins: [GoodsMixin],
    props: {
        hotGoods: { type: Array, default: () => [] }
    },
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>