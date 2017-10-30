let siteDomainCommon = 'http://localhost:8080'; // 本地
if (process.env.NODE_ENV === 'production') {
    siteDomainCommon = 'http://10.5.5.233:8088'; // 生产(万翔本地)
}
export const siteDomain = siteDomainCommon;

// 数据接口地址
// export const api = `${siteDomain}/seeyon/rest/cap4/template/`;
export const api = `/seeyon/rest/cap4/template/`;
