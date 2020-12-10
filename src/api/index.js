import { get, post } from '@/utils/http';
import { Url } from './url';

class Ajax {
    // 获取首页数据 | GET
    getHomeData() {
        return get(Url.homeDataApi);
    }

    // 获取banner数据
    getHomeAds(data) {
        return post(Url.homeAdsApi, data);
    }

    // 搜索 | POST
    search(data) {
        return post(Url.searchApi, data);
    }

    // 获取类目信息
    getCate(data) {
        return post(Url.cateApi, data);
    }

    // 获取分类商品数据 
    getGoodsList(cat_id) {
        return post(Url.goodsListApi, { cat_id });
    }

    // 注册 | POST
    register(data) {
        return post(Url.registerApi, data);
    }

    // 登录 | POST
    login(data) {
        return post(Url.loginApi, data);
    }

    login2(data) {
        return post(Url.loginApi2, data);
    }

    // 获取用户信息 | GET
    getUserInfo() {
        return get(Url.userInfoApi);
    }

    // 更新用户信息 | POST
    updateUserInfo(userInfoData) {
        return post(Url.updateUserInfoApi, userInfoData);
    }

    //获取商品列表
    getProductList(data) {
        return post(Url.productListApi, data);
    }
    // 添加商品
    addProduct(data) {
        return post(Url.addProductApi, data);
    }
    // 删除商品
    delProduct(data) {
        return post(Url.delProductApi, data);
    }
    // 上下架
    statusProduct(data) {
        return post(Url.statusProductApi, data);
    }

    // 获取用户已收藏的商品列表
    getCollectionList() {
        return post(Url.collectionListApi);
    }

    // 获取商品详情
    getGoodsDetails(goods_id) {
        return post(Url.goodsDetailsApi, { goods_id });
    }

    // 查询商品是否已收藏 | POST
    queryCollection(goods_id) {
        return post(Url.queryCollectionApi, { goods_id });
    }

    // 商品收藏、取消 | POST
    collectionHandle(goods_id) {
        return post(Url.goodsCollectionApi, { goods_id });
    }
    collectionCancleHandle(goods_id) {
        return post(Url.goodsCollectionCancelApi, { goods_id });
    }

    // 查询商品是否已收藏 | POST
    addToShopCart(goodsId) {
        return post(Url.addToShopCartApi, { goodsId });
    }

    // 查询购物车数据 | GET
    checkShopCart() {
        return get(Url.checkShopCartApi);
    }

    // 编辑商品数量 | POST
    editGoodsCount(goodsId, buyCount, mallPrice) {
        return post(Url.editGoodsCountApi, { goodsId, buyCount, mallPrice });
    }

    // 删除购物车商品 | POST
    delCartGoods(delGoodsIds) {
        return post(Url.delCartGoodsApi, { delGoodsIds });
    }

    // 获取地址列表 | GET
    getAddressList() {
        return post(Url.addressListApi);
    }

    // 添加地址 | POST
    addAddress(data) {
        return post(Url.addAddressApi, data);
    }

    // 编辑地址 | POST
    editAddress(data) {
        return post(Url.editAddressApi, data);
    }

    // 删除地址 | POST
    delAddress(id) {
        return post(Url.delAddressApi, { id });
    }

    // 设置默认地址 | POST
    setDefAddress(addressId) {
        return post(Url.setDefAddressApi, { addressId });
    }

    // 获取默认地址 | GET
    getDefAddress() {
        return get(Url.defAddressApi);
    }

    // 提交订单处理 | POST
    submitOrderHandle(data) {
        return post(Url.submitOrderApi, data);
    }

    // 获取订单列表 | GET
    getOrderList(data) {
        return post(Url.orderListApi, data);
    }

    orderOpt(data) {
        return post(Url.orderOptApi, data);
    }

    // 获取订单对应处理数量 | GET
    getOrderNum() {
        return get(Url.orderNumApi);
    }

    // 查询待评价商品列表 | GET
    queryWaitComment() {
        return get(Url.waitCommentApi);
    }
    // 查询已评价商品列表 | GET
    queryAlreadyComment() {
        return get(Url.alreadyCommentApi);
    }

    // 评价商品 | POST
    commentGoods({ ...args }) {
        return post(Url.goodsCommentApi, args);
    }

    // 评价详情 | POST
    commentDetails(commentId) {
        return post(Url.commentDetailsApi, { commentId });
    }
}

export default new Ajax();