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
            parseNode({ node, parent, path, ...rest }) {
                const { tableInfo } = this.data;
                const nodeType = node.nodeType === 'ctrl' ? node.type : node.nodeType;
                const masterPath = this.masterPath;
                return fieldMap.hasOwnProperty(nodeType) ?
                    fieldMap[nodeType].call(this, { node, data : this.data, path, parent, ...rest }) : null;
            }
        },
        render() {
//            console.log('footer组件触发渲染了。');
//            console.log(this.data, this.node, this.path);
            const { data, node, path } = this;
            const { _row, _col, repeatEndIndex } = node;
            const tableStyle = getTableStyle(node);
            return (
                <tbody class="el-table__table-footer">
                {
                    Array(_row).fill(null).map((r, rIndex) => this.renderTableTr(rIndex + repeatEndIndex + 1, _col, node, path))
                }
                </tbody>
            );
        },
        components : {}
    };
</script>

<style>

</style>
