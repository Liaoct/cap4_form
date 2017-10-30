/**
 * 将table中的merges转化为一个row * col的2维数组，row[col]位置由0与1表示，1代表该单元格被合并了，0反之。
 * @param row
 * @param col
 * @param table
 * @returns {Array}
 */
export const getMergeMap = (row, col, table) => {
    const mergeMap = [];
    let rowIndex = 0;
    while (rowIndex < row) {
        mergeMap[rowIndex] = Array(col).fill(0);
        rowIndex++;
    }
    const merges = table.merges;
    merges.forEach(m => {
        const r = m.startRowIndex;
        const c = m.startColIndex;
        const rowSpan = m.rowSpan;
        const colSpan = m.colSpan;
        for (let rStep = 0; rStep < rowSpan; rStep++) {
            for (let cStep = 0; cStep < colSpan; cStep++) {
                const cellRowIndex = r + rStep;
                const cellColIndex = c + cStep;
                mergeMap[cellRowIndex][cellColIndex] = 1;
            }
        }
    });
    return mergeMap;
};

/**
 * 根据table中的merges，获取一个区间的合并数组。
 * @param rowStart
 * @param rowEnd
 * @param colStart
 * @param colEnd
 * @param table
 * @returns {Array}
 */
export const getBlockMergeMap = ({ rowStart = 0, rowEnd, colStart = 0, colEnd, table }) => {
    // console.log('获取区域的合并');
    // console.log(rowStart, rowEnd, colStart, colEnd);
    const mergeMap = [];
    let rowIndex = 0;
    const rowLen = rowEnd - rowStart + 1;
    const colLen = colEnd - colStart + 1;
    while (rowIndex < rowLen) {
        mergeMap[rowIndex] = Array(colLen).fill(0);
        rowIndex++;
    }
    const merges = table.merges;
    merges.forEach(m => {
        const r = m.startRowIndex;
        const c = m.startColIndex;
        const rowSpan = m.rowSpan;
        const colSpan = m.colSpan;
        for (let rStep = 0; rStep < rowSpan; rStep++) {
            for (let cStep = 0; cStep < colSpan; cStep++) {
                const cellRowIndex = r + rStep;
                const cellColIndex = c + cStep;
                const inRowRange = rowStart <= cellRowIndex && cellRowIndex <= rowEnd;
                const inColRange = colStart <= cellColIndex && cellColIndex <= colEnd;
                if (inRowRange && inColRange) {
                    mergeMap[cellRowIndex - rowStart][cellColIndex - colStart] = 1;
                }
            }
        }
    });
    return mergeMap;
};

export const getTableStyle = table => {
    const { colWidths } = table;
    let tableWidth = 0;
    if (!colWidths || !colWidths.length) return {};
    tableWidth = colWidths.reduce((p, n) => p + n, tableWidth);
    return {
        width : `${tableWidth}px`
    };
};

export const BorderStyleMap = {
    all : 'default',
    bottom : 'bottom-border',
    none : 'no-border'
};

const getModelByPath = (model, path) =>
    path.reduce((xs, x) => (xs ? xs[x] : null), model);

export const fieldMap = {
    text({ node, data, path, parent }) {
        if (node.ctrlType === 'suiNumber') return fieldMap.number.call(this, ...arguments);
        const fieldInfo = this.getFieldInfo(...arguments);
        const props = this.getFieldProps(node, data);
        return (
            <el-form-item
            label={ node.display }
            label-position={ props.labelPosition }
            hidden-label={ props.hiddenLabel }>
            <el-input
                key={ node.id }
                maxlength={ Number(fieldInfo.fieldLength) }
                placeholder={ fieldInfo.placeHolder }
                required={ props.required }
                facade={ props.facade }
                scan={ props.scan }
                hidden={ props.hidden }
                v-model={ path[node.id] }>
            </el-input>
            </el-form-item>
        );
    },
    number({ node, data, path, parent }) {
        const fieldInfo = this.getFieldInfo(...arguments);
        const props = this.getFieldProps(node, data);
        return (
            <el-form-item
            label={ node.display }
            label-position={ props.labelPosition }
            hidden-label={ props.hiddenLabel }>
            <el-input-number
                key={ node.id }
                placeholder={ fieldInfo.placeHolder }
                v-model={ path[node.id] }
                facade={ props.facade }
                required={ props.required }
                scan={ props.scan }
                debounce={0}
                hidden={ props.hidden }>
            </el-input-number>
            </el-form-item>
        );
    },
    checkbox({ node, data, path, parent }) {
        const fieldInfo = this.getFieldInfo(...arguments);
        const props = this.getFieldProps(node, data);
        const { enums } = fieldInfo;
        const label = props.checkboxLabelStyle !== 'none' ? node.display : null;
        const labelBefore = props.checkboxLabelStyle === 'before';
        if ((!enums || !enums.length) && labelBefore) {
            return (
                <el-form-item
                label={ label }>
                    <el-checkbox
                    true-label = { 1 }
                    false-label = { 0 }
                    disabled = { props.scan }
                    v-model={ path[node.id] }
                    checked={ !!parseInt(this.value[node.id], 10)}
                    key={ node.id }></el-checkbox>
                </el-form-item>
            );
        }
        if (!enums || !enums.length) {
            return (
                <el-form-item>
                <el-checkbox
                    label={ label }
                    true-label = { 1 }
                    false-label = { 0 }
                    disabled = { props.scan }
                    v-model={ path[node.id] }
                    label-width="label-width"
                    checked={ !!parseInt(this.value[node.id], 10)}
                    key={ node.id }>
                </el-checkbox>
                </el-form-item>
            );
        }
        return (
            <el-form-item
            label={ label }
            label-position={ props.labelPosition }
            hidden-label={ props.hiddenLabel }>
            <el-checkbox-group v-model={ path[node.id] } key={ node.id } inline={ props.radioInline }>
                {
                    enums && enums.length ?
                        enums.map(item => <el-checkbox label={ item.showValue } key={ item.id }></el-checkbox>) : null
                }
            </el-checkbox-group>
            </el-form-item>
        );
    },
    textarea({ node, data, path, parent }) {
        const fieldInfo = this.getFieldInfo(...arguments);
        const props = this.getFieldProps(node, data);
        return (
            <el-form-item
            label={ node.display }
            label-position={ props.labelPosition }
            hidden-label={ props.hiddenLabel }>
            <el-input
                maxlength={ Number(fieldInfo.fieldLength) }
                placeholder={ fieldInfo.placeHolder }
                v-model={ path[node.id] }
                required={ props.required }
                facade={ props.facade }
                autosize
                key={ node.id }
                scan={ props.scan }
                hidden={ props.hidden }
                type="textarea"></el-input>
            </el-form-item>
        );
    },
    radio({ node, data, path, parent }) {
        const fieldInfo = this.getFieldInfo(...arguments);
        const props = this.getFieldProps(node, data);
        const { enums } = fieldInfo;
        return (
            <el-form-item
            label={ node.display }
            label-position={ props.labelPosition }
            hidden-label={ props.hiddenLabel }>
            <el-radio-group v-model={ path[node.id] } key={ node.id } inline={ props.radioInline }>
                {
                    enums && enums.length ?
                        enums.map(item => (
                            <el-radio label={ item.id } key={ item.id } disabled = { props.scan }>
                    { item.showValue }
                </el-radio>)
                ) : null
                }
            </el-radio-group>
            </el-form-item>
        );
    },
    datetime({ node, data, path, parent }) {
        const fieldInfo = this.getFieldInfo(...arguments);
        const props = this.getFieldProps(node, data);
        return (
            <el-form-item
            label={ node.display }
            label-position={ props.labelPosition }
            hidden-label={ props.hiddenLabel }>
            <el-calendar
                type='datetime'
                key={ node.id }
                placeholder={ fieldInfo.placeHolder }
                scan={ props.scan }
                hidden={ props.hidden }
                facade={ props.facade }
                format={ fieldInfo.formatType }
                required={ props.required }
                v-model={ path[node.id] }></el-calendar>
            </el-form-item>
        );
    },
    date({ node, data, path, parent }) {
        const fieldInfo = this.getFieldInfo(...arguments);
        const props = this.getFieldProps(node, data);
        return (
            <el-form-item
            label={ node.display }
            label-position={ props.labelPosition }
            hidden-label={ props.hiddenLabel }>
            <el-calendar
                type='date'
                key={ node.id }
                scan={ props.scan }
                hidden={ props.hidden }
                facade={ props.facade }
                required={ props.required }
                format={ fieldInfo.formatType }
                placeholder={ fieldInfo.placeHolder }
                v-model={ path[node.id] }></el-calendar>
            </el-form-item>
        );
    },
    select({ node, data, path, parent }) {
        const fieldInfo = this.getFieldInfo(...arguments);
        const props = this.getFieldProps(node, data);
        const { enums } = fieldInfo;
        return (
            <el-form-item
            label={ node.display }
            label-position={ props.labelPosition }
            hidden-label={ props.hiddenLabel }>
            <el-select
                v-model={ path[node.id] }
                key={ node.id }
                placeholder={ fieldInfo.placeHolder }
                facade={ props.facade }
                scan={ props.scan }
                hidden={ props.hidden }
                filterable
                clearable
                required={ props.required }>
                {
                    enums && enums.length ?
                        enums.map(item => <el-option label={ item.showValue } value={ item.id } key={ item.id }></el-option>) : null
                }
            </el-select>
            </el-form-item>
        );
    },
    static({ node }) {
        return (<div>{ node.display }</div>);
    },
    table({ node, data, path, masterPath, parent }) {
        if (parent) return null; // 暂时不支持单元格中嵌套表
        if (node.isMaster) return this.renderMainTable(node, path); // 主表
        return this.renderDetailTable({ node, data, path, masterPath }); // 重复表
    }
};
