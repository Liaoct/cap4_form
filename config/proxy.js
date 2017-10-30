// var proxySite = 'http://10.5.5.200:9898';// 代理200环境
var proxySite = 'http://10.5.5.204:8088';// 代理测试环境
// var proxySite = 'http://10.5.5.252:8080';// 代理测试环境

module.exports = {
    '/seeyon/rest/cap4/template/' : {
        target : proxySite,
        changeOrigin: true,
        headers: {
            Accept: 'application/json'
            // 'X-Requested-With': 'XMLHttpRequest'
        },
        secure: false
    },
    '/seeyon' : {
        target : proxySite,
        changeOrigin: true,
        headers: {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            // 'X-Requested-With': 'XMLHttpRequest'
        },
        secure: false
    },
    '/seeyon/common/' : {
        target : proxySite,
        changeOrigin: true,
        headers: {
            // 'X-Requested-With': 'XMLHttpRequest'
        },
        secure: false
    },
}
