import { getMergeMap, getTableStyle, BorderStyleMap, fieldMap } from './util';
import {
    Calendar,
    Form,
    Button,
    FormItem,
    Input,
    InputNumber,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Select,
    Option,
    OptionGroup

} from 'cap-ui';

import initCalendarFile from 'cap-ui/lib/utils/calendar';

const ElCalendar = Calendar;
const ElButton = Button;
const ElForm = Form;
const ElFormItem = FormItem;
const ElInput = Input;
const ElInputNumber = InputNumber;
const ElCheckbox = Checkbox;
const ElCheckboxGroup = CheckboxGroup;
const ElRadio = Radio;
const ElRadioGroup = RadioGroup;
const ElSelect = Select;
const ElOption = Option;
const ElOptionGroup = OptionGroup;

export default {
    components : {
        ElCalendar,
        ElButton,
        ElForm,
        ElFormItem,
        ElInput,
        ElInputNumber,
        ElCheckbox,
        ElCheckboxGroup,
        ElRadio,
        ElRadioGroup,
        ElSelect,
        ElOption,
        ElOptionGroup
    },
    created() {
        initCalendarFile();
    },
    methods : {
        renderTableTr(rIndex, col, table, path) {
            return (
                <tr>
                {
                    Array(col).fill(null).map((c, cIndex) => this.renderTableTd(rIndex, cIndex, table, path))
                }
                </tr>
            );
        },
        renderTableTd(rIndex, cIndex, table, path) {
            const cell = this.getCell(rIndex, cIndex, table);
            const isMerged = this.isMergedCell(rIndex, cIndex, table.mergeMap);
            const isMergeOriginCell = this.isMergeOriginCell(rIndex, cIndex, table);
            if (isMerged && !isMergeOriginCell) return null;
            const style = this.getCellStyle(rIndex, cIndex, table);
            if (cell && isMergeOriginCell) {
                return (
                    <td colspan={ isMergeOriginCell.colSpan } rowspan={ isMergeOriginCell.rowSpan } style={ style }>
                    { this.getCellFields(cell, table, path) }
                    </td>
                );
            }
            if (cell && !isMerged) return (<td style={ style }>{ this.getCellFields(cell, table, path) }</td>);
            return (<td style={ style }></td>);
        },
        getCell(rIndex, cIndex, table) {
            const cells = table.cells;
            return cells.find(cell => cell.rowIndex === rIndex && cell.colIndex === cIndex);
        },
        isMergedCell(rIndex, cIndex, map) {
            return map[rIndex][cIndex];
        },
        isMergeOriginCell(rIndex, cIndex, table) {
            const merges = table.merges;
            return merges.find(m => m.startRowIndex === rIndex && m.startColIndex === cIndex);
        },
        getCellFields(cell, table, path) {
            const children = cell.children;
            if (!children) return null;
            return children.map(node => this.parseNode({ node, table, parent : cell, path }));
        },
        getCellStyle(rowIndex, colIndex, table) {
            const colWidths = table.colWidths;
            let width = colWidths[colIndex];
            const isMergeOriginCell = this.isMergeOriginCell(rowIndex, colIndex, table);
            const colLen = isMergeOriginCell ? isMergeOriginCell.colSpan : 1;
            if (colLen > 1) {
                for (let step = 1; step < colLen; step++) {
                    width += colWidths[colIndex + step];
                }
            }
            return {
                width : `${width}px`
            };
        },
        getFieldInfo({ node, data, parent, table }) {
            const isFormMain = !table || table.isMaster;
            const nodeId = node.id;
            const { tableInfo } = data;
            // 主表控件
            if (isFormMain) {
                return tableInfo.formmain.fieldInfo[nodeId];
            }
            // 重复表的主表字段
            if (parent._isMainField) {
                return tableInfo.formmain.fieldInfo[nodeId];
            }
            // 重复表
            const currentTableInfo = this.currentTableInfo;
            return currentTableInfo.fieldInfo[nodeId];
        },
        getFieldProps(node, data) {
            const props = {};
            const { attrs } = node;
            const { viewInfo } = data;
            const { authInfo } = viewInfo;
            const nodeId = node.id;
            props.labelPosition = attrs.ctrlTitleStyle !== 'inline' ? 'top' : 'right';
            props.hiddenLabel = attrs.ctrlTitleStyle === 'none';
            props.required = authInfo[nodeId].isNotNull === '1';
            props.facade = BorderStyleMap[attrs.ctrlBorderStyle];
            props.radioInline = attrs.radioAlignType === 'horizontal';
            props.checkboxLabelStyle = attrs.ctrlTitleStyle; // 07-10-25更新，checkTitleStyle合并到TitleStyle
            props.scan = authInfo[nodeId].auth === 'browse';
            props.hidden = authInfo[nodeId].auth === 'hide';
            return props;
        },
        getFormStyle() {
            const { viewInfo } = this.data;
            if (!viewInfo) return {};
            return viewInfo.viewContent.styles;
        }
    },
    computed : {
        currentFormStyle() {
            const { viewInfo } = this.data;
            if (!viewInfo) return {};
            return viewInfo.viewContent.styles;
        },
        currentTableInfo() {
            const { tableInfo } = this.data;
            const node = this.node;
            if (!node) return tableInfo.formmain; // 当前组件实例node不存在,则为主表
            // 重复表
            const viewTableName = node.tableName;
            return tableInfo.formson.find(item => item.frontTableName === viewTableName);
        }
    }
};
