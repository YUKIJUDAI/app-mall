import axios from 'axios';
import qs from "qs";
import store from '../store';
import router from '../router';
import { locationCityCache } from '@/assets/js/cache';
import { Toast } from 'vant';
import { Dialog } from 'vant';

/**
 * 数据请求 | 封装 axios
 */

axios.defaults.timeout = 10000; // 默认超时设置 10s
axios.defaults.withCredentials = true; // 表示跨域请求时是否需要使用凭证
// axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '/v1' : '/api'; // 相对路径设置

/**
 *  请求拦截器
 */
axios.interceptors.request.use(config => {
    config.headers['Content-Type'] = "application/x-www-form-urlencoded";
    // 在发送请求之前做某事
    const userToken = store.getters.userToken;
    // 添加 token 到 headers 中
    (userToken) && (config.headers['token'] = userToken);

    config.data = qs.stringify(config.data);
    // 若缓存中不存在定位城市 或者 过期，则执行删除本地缓存
    // (!locationCityCache.getCache()) && store.dispatch('deleteLocationCity');

    return config;
}, error => {
    return Promise.reject(error);
});

/**
 * 响应拦截器
 */
axios.interceptors.response.use(response => {
    // 对响应数据做些事
    return Promise.resolve(response);
}, error => {
    return Promise.reject(error);
});

/**
 * 封装 get 方法
 * @param {String} url
 * @param {Object} params
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, { params })
            .then(res => {
                if (res.status === 200) {
                    if (res.data || !res.data.code) {
                        // 请求成功
                        resolve(res.data);
                    } else {
                        // 请求错误
                        reject(res);
                    }
                } else {
                    // 服务器错误
                    console.log('服务器错误!');
                    reject(res);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}

/** 
 * 封装 post 方法
 * @param {String} url
 * @param {Object} params
 * @returns {Promise}
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(res => {
                if (res.status === 200) {
                    if (res.data || !res.data.code) {
                        // 请求成功

                        if (res.data.code > 4000 && res.data.code < 5100) router.push({ name: 'Login' });
                        else resolve(res.data);
                    } else {
                        // 请求错误
                        reject(res);
                    }
                } else {
                    // 服务器错误
                    console.log('服务器错误!');
                    reject(res);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}