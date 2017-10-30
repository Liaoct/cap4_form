<script>
    import { getValueByPath } from '../../common/util';
    import { getMergeMap, getTableStyle, BorderStyleMap, fieldMap } from './util';
    import mixin from './mixin';

    export default {
        mixins : [mixin],
        data() {
            return {};
        },
        props : {
            node : Object,
            data : Object,
            path : Object
        },
        mounted() {},
        methods : {
            parseNode({ node, parent, table, path, ...rest }) {
                const { tableInfo } = this.data;
                const nodeType = node.nodeType === 'ctrl' ? node.type : node.nodeType;
                const masterPath = this.masterPath;
                return fieldMap.hasOwnProperty(nodeType) ?
                    fieldMap[nodeType].call(this, { node, data : this.data, path, parent, ...rest }) : null;
            },
            initMergeMap() {
                const { node } = this;
                const { col, row } = node;
                node.mergeMap = getMergeMap(row, col, node);
            }
        },
        render() {
//            console.log('main组件触发渲染了。');
//            console.log(this.data, this.node, this.path);
            const { data, node, path } = this;
            const { row, col } = node;
            const tableStyle = getTableStyle(node);
            return (
                <tbody class="el-table__table-main">
                {
                    Array(row).fill(null).map((r, rIndex) => this.renderTableTr(rIndex, col, node, path))
                }
                </tbody>
            );
        },
        watch : {
            node : {
                immediate : true,
                handler(val) {
                    val && this.initMergeMap();
                }
            }
        },
        components : {}
    };
</script>

<style>

</style>
