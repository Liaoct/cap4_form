<script>
    import ElDetailTable from './table';
    import { getValueByPath } from '../../common/util';
    import { getMergeMap, getTableStyle, BorderStyleMap, fieldMap } from './util';
    import mixin from './mixin';
    import ElTableMain from './table-main.vue';
    import ElFreeField from './free-field.vue';

    export default {
        mixins : [mixin],
        components : {
            ElDetailTable,
            ElTableMain,
            ElFreeField
        },
        data() {
            return {};
        },
        props : {
            data : Object,
            value : {
                type : Object,
                default : {}
            }
        },
        created() {},
        mounted() {},
        updated() {},
        methods : {
            // 初始化日期时间控件
            initCalendar() {
                const $ = window.$;
                if ($ && this.calendarFileLoaded && !this.initedCalendar) {
                    $('.comp').each(function (i) {
                        $(this).compThis();
                    });
                }
                this.initedCalendar = true;
            },
            /**
             * 设置前端model, 用于组件v-model。
             * {
                    "formmain_0083":{ // 主表
                        "field0001":"445",
                        "field0002":"678"
                    },
                    "formson_0002":[{ // 重复表
                        id: "",
                        field0003:"444",
                        field0004:"777"
                    }],
                    "formson_0003":[{ // 重复表
                        id: "",
                        field0005:"47744",
                        field0006:"44774"
                    }]
                }
             */
            initFieldModel() {
                if (!this.data) return;
                const { formmain = {}, formson = [] } = this.data.tableInfo;
                const getFormSonRowData = (item, fieldInfo) => { // 设置重复表每一条数据
                    const row = {};
                    Object.keys(item).forEach(name => {
                        if (name in fieldInfo) {
                            row[name] = this.getFieldDefaultModel(item[name], fieldInfo[name].inputType);
                        }
                    });
                    row.id = item.recordId;
                    return row;
                };
                const setData = (tableInfo = {}, isMaster = true) => {
                    const { tableName, fieldInfo, dataSubLineInfos } = tableInfo;
                    if (!tableName || !fieldInfo) return;
                    if (!this.value[tableName]) {
                        this.$set(
                            this.value,
                            tableName,
                            isMaster ? {} : []
                        );
                    }
                    if (isMaster) {
                        Object.keys(fieldInfo).forEach(id => this.$set(
                            this.value[tableName],
                            id,
                            this.getFieldDefaultModel(fieldInfo[id])
                        ));
                        return;
                    }
                    dataSubLineInfos.forEach((item, index) => {
                        this.$set(
                            this.value[tableName],
                            index,
                            getFormSonRowData(item, fieldInfo)
                        );
                    });
                };
                setData(formmain); // 设置主表字段
                formson.forEach(info => setData(info, false)); // 设置明细表字段
            },
            getFieldDefaultModel(field, type) {
                const inputType = type || field.inputType;
                switch (inputType) {
                    case 'date':
                    case 'datetime':
                        return field.showValue2;
                    default:
                        return field.value;
                }
            },
            renderDetailTable({ node, data, path, masterPath }) {
//                console.log('传递给明细表的path', path);
                return (
                    <el-detail-table
                    node={node}
                    data={data}
                    path={ path }
                    masterPath={ masterPath }></el-detail-table>
                );
            },
            renderMainTable(table, path) {
//                const row = table.row;
//                const col = table.col;
//                table.mergeMap = getMergeMap(row, col, table);
                const tableStyle = getTableStyle(table);
                const data = this.data;

                return (
                    <table style={ tableStyle } key={ table.id } border='0' cellspacing='0' cellpadding='0'>
                        <el-table-main node={table} data={data} path={ path }></el-table-main>
                    </table>
                );
            },
            renderFreeField(node, path) {
                const { data } = this;
                return (<el-free-field key={ node.id } node={node} data={data} path={path}></el-free-field>);
            },
            parseNode({ node, parent, table, path, ...rest }) {
                const { tableInfo } = this.data;
                const nodeType = node.nodeType === 'ctrl' ? node.type : node.nodeType;
                const masterTableName = getValueByPath(tableInfo, 'formmain.tableName');
                const masterPath = this.value[masterTableName];
                // 自由控件
                if (!parent && !table && nodeType !== 'table') return this.renderFreeField(node, masterPath);
                // table类型的默认path
                if (nodeType === 'table' && !path) {
                    const viewTableName = node.tableName;
                    if (node.isMaster) {
                        path = masterPath;
                    } else {
                        const tableData = tableInfo.formson.find(item => item.frontTableName === viewTableName);
                        path = tableData ? tableData.tableName : '';
                        path = this.value[path];
                    }
                }
                return fieldMap.hasOwnProperty(nodeType) ?
                    fieldMap[nodeType].call(this, { node, data : this.data, path, table, parent, masterPath, ...rest }) : null;
            }
        },
        computed : {},
        watch : {
            data : {
                immediate : true,
                handler(val) {
                    val && this.initFieldModel();
                }
            }
        },
        render() {
            if (!this.data) return null;
            const view = this.data.viewInfo.viewContent.children;
            return (
                <div class="el-CapForm" style={ this.currentFormStyle }>
                <div class='el-CapForm__formHeader'>{ this.data.formInfo.formName }</div>
                    <el-form label-width="76px" v-model={ this.value } style={ this.currentFormStyle }>
                    {
                        view.map(node => this.parseNode({ node }))
                    }
                    </el-form>
                </div>
            );
        }
    };
</script>

<style>
    @component-namespace el{
        @b CapForm{
            @e header {
                padding: 10px 20px;
                border-bottom: 1px solid #CECECE;
            }
            @e formHeader {
                background: #3AADFB;
                text-align: center;
                color: #fff;
                font-size: 24px;
                height: 80px;
                @utils-vertical-center;
            }
            .el-form {

            }
            .el-form-item {
                margin-bottom: 0;
            }
            table, td, th, tr {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
            }
            table {
                table-layout: fixed;
                & + table {
                    margin-top: 20px;
                }
            }
            td {
                border: 1px solid #B6B6B6;
                border-top: 0;
                overflow-x: hidden;
                padding: 7px 10px;
                & > .el-form-item {
                }
            }
            td ~ td {
                border-left: 0;
            }

        }
    }
</style>
