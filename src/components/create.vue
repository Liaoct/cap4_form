<template>
    <div class="el-SheetCreate">
        <div class="el-SheetCreate__header">
            <el-button type="primary" @click="saveForm('1')">保存</el-button>
            <el-button type="primary" @click="saveForm('2')">保存并新建</el-button>
            <el-button type="primary" @click="saveForm('3')">保存并复制</el-button>
            <el-button>取消</el-button>
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
        moduleId : '-2652479162664269835',
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
//                const { data } = await Api.resource(fetch.createOrEdit);
//                this.data = data.data.data;
                this.data = FormData.data.data;
                console.log('当前数据结构', this.data);
            },
            async saveForm(saveType = 1) {
                const { viewInfo, content, tableInfo } = this.data;
                const formName = tableInfo.formmain.tableName;
                console.log('当前的表单数据:', this.formData);
                const body = {
                    content : {
                        ...content,
                        isMerge : '0',   // 是否仅仅合并缓存
                        saveType   // 1:保存，2:保存并新建，3:保存并复制
                    },
                    [formName] : {
                        ...this.formData
                    }
                };
                fetch.saveOrUpdate.body = body;
                try {
                    const { data } = await Api.resource(fetch.saveOrUpdate);
                    this.handleSave(saveType, data);
                } catch (e) {
                    console.log(e);
                }
            },
            handleSave(saveType, data) {
                if (saveType === '1') return;
                const { code } = data.data;
                if (code !== '2000') return;
                if (saveType === '2') {
                    this.requestFormData();
                    return;
                }
                if (saveType === '3') {
                    const { formMasterId } = data.data.data;
                    this.requestFormData({ formMasterId });
                }
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
        @b SheetCreate{
            @e header {
                padding: 10px 20px;
                border-bottom: 1px solid #CECECE;
            }
            .el-CapForm {
                margin: 46px auto;
            }
        }
    }
</style>
