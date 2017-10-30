<template>
  <div class="el-hello">
      <p class="el-hello__msg">{{ msg }}</p>
      <button @click="requestParent">请求父iframe的方法</button>
      <calendar
          v-model="value1"
          type="datetime"
          placeholder="选择日期时间"
          format="yyyy年MM月dd天"></calendar>
      <checkbox-group><checkbox label="test"></checkbox></checkbox-group>
  </div>
</template>

<script>
    import { mixinHullMethod, requestHull, waitCall } from '../common/hull';
    import { getUrlParam } from '../common/util';
    import { Calendar, Checkbox, CheckboxGroup } from 'cap-ui';

    export default {
        name : 'hello',
        mixins : [mixinHullMethod],
        data() {
            return {
                msg : 'Welcome to Your Vue.js App',
                value1 : ''
            };
        },
        async mounted() {
            console.log(this);
            console.log(this.nmspace);
            console.log(getUrlParam('name'));
            this.bindMethods({ saveInfo : 'saveInfo' });
//            const msg = await waitCall('testHullCall');
//            console.log(msg);
        },
        methods : {
            async saveInfo(data, callback) {
                this.msg = data;
                console.log(this);
                console.log(data);
                console.log(callback);
//                callback({ msg : 'sth. from client' });
                const result = callback && await requestHull(callback)({ msg : 'sth. from client' });
                console.log(result);
//                const res = await requestHull('saveMsg', { age : 10 });
//                console.log(res);
            },
            requestParent() {
                requestHull('saveMsg', { age : 10 });
            }
        },
        components : {
            Calendar,
            Checkbox,
            CheckboxGroup
        }
    };
</script>

<style>
    @component-namespace el{
        @b hello{
            text-align: center;
            @utils-vertical-center;
            height: 400px;
            overflow: hidden;
            @e msg{
                display: inline-block;
                height: 100%;
                font-size: 30px 1;
            }
        }
    }
</style>
