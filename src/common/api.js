import Vue from 'vue';
import { api } from './config';
// import VueResource from 'vue-resource';

// http method mapping to vue-resource action
const methodMapAction = {
    get : 'query', // query or get
    post : 'save',
    put : 'update',
    patch : 'update',
    delete : 'delete'// delete or remove
};

const resource = function ({ url, params, actions = {}, body, ...options }) {
    if (url.match(/^http/) === null) url = `${url}`;
    // 忽略自定义的action，统一使用标准的action
    const resource = Vue.resource(url, {}, {}, options);
    let action = options.method || 'get';
    action = action.toLowerCase();
    return resource[methodMapAction[action]](params, body);
};

const http = function ({ url, params, actions = {}, ...options }) {
    if (url.match(/^http/) === null) url = `${api}${url}`;
    return Vue.http({ url, params, ...options });
};

export default { http, resource };
