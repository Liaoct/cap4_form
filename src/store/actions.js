/**
 * @fileOverview vuex根action，将各module中异步请求样板代码统一提取为一个独立的action。
 * 使用方式，在module中，发起request action：
 *  dispatch('request', {
 *      //异步请求各阶段的mutations type数组
        types : [types.DISABLED_TEMPLATE, types.DISABLED_TEMPLATE_SUCCESS, types.DISABLED_TEMPLATE_FAILURE],
        //请求配置参数
        fetch : options,
        // 请求成功回调
        resolved : {
            action : 'getTemplateList',
            ...actionPayload
        },
        rejected : 'getTemplateList',
        ...otherPayload
    });
 *
 *  其中rejected和resolved为可选回调参数，可接受字符串类型，对象类型，或者函数。
 *  字符串将作为回调action名字使用，回调发生时，触发该action。
 *  如果想给action传递参数，则可以使用对象形式，其中‘action’属性为将要触发的action名字，其余值将作为参数。
 *  也可以自定义触发一个函数。
 *  request action中的剩余数据，会作为负载传递到types中规定的各mutation中去。
 */
import Api from '../common/api';
import { isObject, isFunction } from '../assets/js/utils/util';

export const request = async ({ commit, state, dispatch }, payload = {}) => {
    const { types = [], fetch = {}, resolved, rejected, ...rest } = payload;
    const [BEGIN, SUCCESS, FAILURE] = types;
    try {
        commit(BEGIN);
        const res = await Api.resource(fetch);
        const { status, data, ok } = res;
        const isExecuteSuccess = ok && data && parseInt(data.code, 10) === 0 && parseInt(data.data.code, 10) === 1000;
        if (isExecuteSuccess) {
            commit(SUCCESS, { ...rest, status, data, ok });
            if (typeof resolved === 'string') {
                dispatch(resolved);
            } else if (isFunction(resolved)) {
                resolved(data);
            } else if (isObject(resolved)) {
                const { action, ...resolvedPayload } = resolved;
                dispatch(action, resolvedPayload);
            }
            return;
        }
        commit(FAILURE, { ...rest, status, data, ok });
        if (typeof rejected === 'string') {
            dispatch(rejected);
        } else if (isFunction(rejected)) {
            rejected(data);
        } else if (isObject(rejected)) {
            const { action, ...rejectedPayload } = rejected;
            dispatch(action, rejectedPayload);
        }
    } catch (e) {
        console.log('action "request" got a error ：', e);
        const { status, data, ok } = e;
        commit(FAILURE, { ...rest, status, data, ok, ...e });
        if (typeof rejected === 'string') {
            dispatch(rejected);
        } else if (isFunction(rejected)) {
            rejected(data);
        } else if (isObject(rejected)) {
            const { action, ...rejectedPayload } = rejected;
            dispatch(action, rejectedPayload);
        }
    }
};

