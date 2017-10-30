import Vue from 'vue';
import Vuex from 'vuex';
import * as modules from './modules';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const store = new Vuex.Store({
    strict : debug,
    plugins : debug ? [createLogger()] : [],
    modules
});

// if (module.hot) {
//     module.hot.accept([
//         './actions',
//         './modules'
//     ], () => {
//         store.hotUpdate({
//             actions : require('./actions'), // eslint-disable-line global-require
//             mutations : require('./modules') // eslint-disable-line global-require
//         });
//     });
// }

export default store;
