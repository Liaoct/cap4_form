<template>
    <div class="el-SheetBrowse">
        <div class="el-SheetBrowse__header">
            <el-button type="primary">打印</el-button>
            <el-button type="text">上一条</el-button>
            <el-button type="text">下一条</el-button>
        </div>
        <el-cap-form :data="data" v-if="data" :value.sync="formData"></el-cap-form>
    </div>
</template>

<script>
    import Api from '../common/api';
    import FormData from '../../static/from';
    import ElCapForm from './form/Form.vue';
    import { getUrlParam } from '../common/util';

    import {
        Button
    } from 'cap-ui';

    const NewParams = {
        rightId : '4934368602173165503',
        moduleId : '5634464858497504316',
        moduleType : '42'
    };

    const ElButton = Button;

    const createOrEdit = {
        url : '/seeyon/rest/cap4/form/createOrEdit',
        method : 'POST'
    };
    const saveOrUpdate = {
        url : '/seeyon/rest/cap4/form/saveOrUpdate',
        method : 'POST'
    };
    const fetch = {
        createOrEdit,
        saveOrUpdate
    };

    export default {
        data() {
            return {
                data : null,
                formData : {}
            };
        },
        props : {
        },
        mounted() {
            this.requestFormData();
        },
        computed : {
            params() {
                const rightId = getUrlParam('rightId');
                const moduleId = getUrlParam('moduleId');
                const moduleType = getUrlParam('moduleType');
                return {
                    rightId,
                    moduleId,
                    moduleType
                };
            }
        },
        methods : {
            async requestFormData(parmas) {
                fetch.createOrEdit.body = {
//                    ...NewParams,
                    ...parmas,
                    ...this.params
                };
                const { data } = await Api.resource(fetch.createOrEdit);
                this.data = data.data.data;
            }
        },
        components : {
            ElButton,
            ElCapForm
        }
    };
</script>

<style>
    @component-namespace el{
        @b SheetBrowse{
            @e header {
                padding: 10px 20px;
                text-align: right;
            }
            .el-CapForm {
                margin: 46px auto;
            }
        }
    }
</style>
