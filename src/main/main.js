// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from '../router/index';
import store from '../store';
import VueResource from 'vue-resource';

Vue.config.productionTip = false;
Vue.use(VueResource);

/* eslint-disable no-new */
new Vue({
    el : '#app',
    router,
    store,
    template : '<App/>',

    components : { App }
});
