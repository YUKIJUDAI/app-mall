const baseURL = process.env.NODE_ENV === 'development' ? '/api' : '/api';

export const Url = {
    homeDataApi: baseURL + '/index/hot', // 商城首页所有数据
    homeAdsApi: baseURL + "/index/ads", // 首页banner数据
    searchApi: baseURL + '/index/search', // 搜索

    cateApi: baseURL + '/cate/index', //分类信息
    goodsListApi: baseURL + '/cate/catelist', // 分类商品列表

    registerApi: baseURL + '/member/reg', // 用户注册
    loginApi: baseURL + '/member/login', // 用户登录
    userInfoApi: baseURL + '/member/getMemberInfo', // 用户信息
    updateUserInfoApi: baseURL + '/member/editinfo', // 更新用户信息
    collectionListApi: baseURL + '/member/collectlist', // 用户收藏列表

    productListApi: baseURL + '/product/lists', //商品列表
    addProductApi: baseURL + '/product/add', //添加商品
    delProductApi: baseURL + '/product/del', //删除商品
    statusProductApi: baseURL + '/product/status', //商品上下架

    goodsDetailsApi: baseURL + '/index/det', // 单个商品详情
    queryCollectionApi: baseURL + '/member/checkCollect', // 查询商品是否已收藏
    goodsCollectionApi: baseURL + '/member/collect', // 商品收藏、取消
    goodsCollectionCancelApi: baseURL + '/member/collectdel',
    addToShopCartApi: baseURL + '/api/u-action/addToShopCart', // 加入到购物车
    checkShopCartApi: baseURL + '/api/user/checkShopCart', // 查询购物车数据
    editGoodsCountApi: baseURL + '/api/u-action/editGoodsCount', // 编辑商品数量
    goodsCommentApi: baseURL + '/api/u-action/goodsComment', // 商品评论
    delCartGoodsApi: baseURL + '/api/u-action/delCartGoods', // 删除购物车商品

    addressListApi: baseURL + '/member/getAddress', // 地址列表
    addAddressApi: baseURL + '/member/addaddress', // 添加收货地址
    editAddressApi: baseURL + '/member/editaddress', // 编辑收货地址
    delAddressApi: baseURL + '/member/delAddress', // 删除收货地址
    defAddressApi: baseURL + '/member/getDefaultAddress', // 默认地址

    submitOrderApi: baseURL + '/orders/add', // 提交订单
    orderListApi: baseURL + '/orders/orderList', // 获取订单列表
    orderNumApi: baseURL + '/api/user/orderNum', // 获取订单对应处理数量
    orderOptApi: baseURL + '/orders/orderOpt', // 修改订单状态

    waitCommentApi: baseURL + '/api/user/waitCommentList', // 查询待评论商品列表
    alreadyCommentApi: baseURL + '/api/user/alreadyCommentList', // 查询已评论商品列表
    commentDetailsApi: baseURL + '/api/user/commentDetails' // 评论商品详情
};