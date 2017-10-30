<!-- 专属于重复表的table组件 -->
<script>
    import { getValueByPath } from '../../common/util';
    import { getMergeMap, getTableStyle, BorderStyleMap, getBlockMergeMap, fieldMap } from './util';
    import mixin from './mixin';

    import initCalendarFile from 'cap-ui/lib/utils/calendar';
    import ElDetailTable from './table';
    import ElTableItem from './table-item.vue';
    import ElTableHeader from './table-header.vue';
    import ElTableFooter from './table-footer.vue';

    export default {
        mixins : [mixin],
        data() {
            return {};
        },
        props : {
            node : Object,
            data : Object,
            path : [Object, Array],
            masterPath : Object,
            manFormData : Object
        },
        mounted() {},
        methods : {
            initTableProp() {
                const { node } = this;
                const { cells, repeatEndIndex, repeatStartIndex, row, col } = node;
                const headerCells = [];
                const bodyCells = [];
                const footerCells = [];
                cells.forEach(cell => {
                    if (cell.rowIndex < repeatStartIndex) {
                        cell._isMainField = true;
                        return headerCells.push(cell);
                    }
                    if (cell.rowIndex > repeatEndIndex) {
                        cell._isMainField = true;
                        return footerCells.push(cell);
                    }
                    return bodyCells.push(cell);
                });
                const mergeMap = getMergeMap(row, col, node);
//                console.log(mergeMap);
//                const headerMergeMap = getBlockMergeMap({
//                    rowEnd : repeatStartIndex - 1,
//                    colEnd : col - 1,
//                    table : node
//                });
//                const bodyMergeMap = getBlockMergeMap({
//                    rowStart : repeatStartIndex,
//                    rowEnd : repeatEndIndex,
//                    colEnd : col - 1,
//                    table : node
//                });
//                const footerMergeMap = getBlockMergeMap({
//                    rowStart : repeatEndIndex + 1,
//                    rowEnd : row - 1,
//                    colEnd : col - 1,
//                    table : node
//                });
                this._HeaderNode = Object.assign({}, node, {
                    mergeMap,
                    _cells : headerCells,
                    _col : col,
                    _row : repeatStartIndex
                });
                this._BodyNode = Object.assign({}, node, {
                    mergeMap,
                    _cells : bodyCells,
                    _col : col,
                    _row : repeatEndIndex - repeatStartIndex + 1
                });
                this._FooterNode = Object.assign({}, node, {
                    mergeMap,
                    _cells : footerCells,
                    _col : col,
                    _row : row - repeatEndIndex - 1
                });
//                console.log('明细表表头、表体、表尾拆分：');
                console.log(this._HeaderNode, this._BodyNode, this._FooterNode);
            },
            renderTableHeader() {
                const { data } = this;
                const table = this._HeaderNode;
                const { _row, _col } = table;
                const tableStyle = getTableStyle(table);
                const path = this.masterPath;

                return (
                    <div class='table__header-wrapper'>
                    <table style={ tableStyle } key={ `${table.id}_header` } border='0' cellspacing='0' cellpadding='0'>
                    <el-table-header node={table} data={data} path={path} key={ `${table.id}_header` }></el-table-header>
                    </table>
                    </div>
                );
            },
            renderTableBody() {
                const table = this._BodyNode;
                const { node, data, path } = this;
                const tableStyle = getTableStyle(table);
                const tableInfo = this.currentTableInfo;
                const { dataSubLineInfos } = tableInfo;
                return (
                    <div class="table__body-wrapper">
                    <table style={ tableStyle } key={ `${table.id}_body` } border='0' cellspacing='0' cellpadding='0'>
                    {
                        dataSubLineInfos.slice(0, 20).map((item, index) =>
                            <el-table-item node={table} data={data} path={path[index]} key={item.recordId}>
                            </el-table-item>
                        )
                    }
                    </table>
                    </div>
                );
            },
            renderTableFooter() {
                const { data } = this;
                const table = this._FooterNode;
                const { _row, _col, repeatEndIndex } = table;
                const tableStyle = getTableStyle(table);
                const path = this.masterPath;
//                console.log('传递给明细表表尾的数据', table, path);
                return (
                    <div class="table__footer-wrapper">
                    <table style={ tableStyle } key={ `${table.id}_footer` } border='0' cellspacing='0' cellpadding='0'>
                    <el-table-footer node={table} data={data} path={path} key={ `${table.id}_footer` }></el-table-footer>
                    </table>
                    </div>
                );
            },
            parseNode({ node, parent, path, ...rest }) {
                const { tableInfo } = this.data;
                const nodeType = node.nodeType === 'ctrl' ? node.type : node.nodeType;
                const masterPath = this.masterPath;
                return fieldMap.hasOwnProperty(nodeType) ?
                    fieldMap[nodeType].call(this, { node, data : this.data, path, parent, ...rest }) : null;
            }
        },
        render() {
//            console.log('table组件触发渲染了。');
            return (
                <div class="el-CapDetailTable">
                <el-form label-width="76px">
                    { this.renderTableHeader() }
                    { this.renderTableBody() }
                    { this.renderTableFooter() }
                </el-form>
                </div>
            );
        },
        computed : {
//            currentTableInfo() {
//                const { tableInfo } = this.data;
//                const node = this.node;
//                const viewTableName = node.tableName;
//                return tableInfo.formson.find(item => item.frontTableName === viewTableName);
//            }
        },
        watch : {
            node : {
                immediate : true,
                handler(val) {
                    val && this.initTableProp();
                }
            }
        },
        components : {
            ElDetailTable,
            ElTableItem,
            ElTableHeader,
            ElTableFooter
        }
    };
</script>

<style>
    @component-namespace el{
        @b CapDetailTable{
            .table__header-wrapper{
                background: #E8EFF8;
                table tr:first-child td {
                    border-top: 1px solid #B6B6B6;
                }
            }
            & + & {
                margin-top: 36px;
            }
        }
    }
</style>
