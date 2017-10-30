<script>
    import Api from '../common/api';
    import FormData from '../../static/from';
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

    const NewParams = {
        rightId : '4934368602173165503',
        moduleId : '-2652479162664269835',
        moduleType : '42'
    };
    const EditParams = {
        rightId : '4934368602173165503',
        moduleId : '-2652479162664269835',
        moduleType : '42'
    };
    const BrowseParams = {
        rightId : '4934368602173165503',
        moduleId : '-2652479162664269835',
        moduleType : '42'
    };
    const params = {
        NewParams,
        EditParams,
        BrowseParams
    };
    const createOrEdit = {
        url : 'http://10.5.5.231:8080/seeyon/rest/cap4/form/createOrEdit',
        method : 'POST'
    };
    const saveOrUpdate = {
        url : 'http://10.5.5.231:8080/seeyon/rest/cap4/form/saveOrUpdate',
        method : 'POST'
    };
    const fetch = {
        createOrEdit,
        saveOrUpdate
    };

    const BorderStyleMap = {
        all : 'default',
        bottom : 'bottom-border',
        none : 'no-border'
    };

    const fieldMap = {
        text(node, data, parent) {
            if (node.ctrlType === 'suiNumber') return fieldMap.number.call(this, node, data, parent);
            const fieldInfo = this.getFieldInfo(node, data, parent);
            const props = this.getFieldProps(node, data);
            return (<el-form-item
                label={ fieldInfo.display }
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
                    v-model={ this.formData[node.id] }></el-input>
                </el-form-item>);
        },
        number(node, data, parent) {
            const fieldInfo = this.getFieldInfo(node, data, parent);
            const props = this.getFieldProps(node, data);
            return (<el-form-item
                label={ fieldInfo.display }
                label-position={ props.labelPosition }
                hidden-label={ props.hiddenLabel }>
                    <el-input-number
                        key={ node.id }
                        placeholder={ fieldInfo.placeHolder }
                        v-model={ this.formData[node.id] }
                        facade={ props.facade }
                        required={ props.required }
                        scan={ props.scan }
                        hidden={ props.hidden }
                    ></el-input-number>
                </el-form-item>);
        },
        checkbox(node, data, parent) {
            const fieldInfo = this.getFieldInfo(node, data, parent);
            const props = this.getFieldProps(node, data);
            const { enums } = fieldInfo;
            const label = props.checkboxLabelStyle !== 'none' ? fieldInfo.display : null;
            const labelBefore = props.checkboxLabelStyle === 'before';
            if ((!enums || !enums.length) && labelBefore) {
                return (
                    <el-form-item
                    label={ label }>
                        <el-checkbox
                        true-label = { 1 }
                        false-label = { 0 }
                         v-model={ this.formData[node.id] }
                        key={ node.id }></el-checkbox>
                    </el-form-item>
                );
            }
            if (!enums || !enums.length) {
                return (
                    <el-form-item >
                        <el-checkbox
                        label={ label }
                        true-label = { 1 }
                        false-label = { 0 }
                        v-model={ this.formData[node.id] }
                        label-width="label-width"
                        key={ node.id }></el-checkbox>
                    </el-form-item>
                );
            }
            return (<el-form-item
                label={ fieldInfo.display }
                label-position={ props.labelPosition }
                hidden-label={ props.hiddenLabel }>
                    <el-checkbox-group v-model={ this.formData[node.id] } key={ node.id } inline={ props.radioInline }>
                    {
                        enums && enums.length ?
                            enums.map(item => <el-checkbox label={ item.showValue } key={ item.id }></el-checkbox>) : null
                    }
                    </el-checkbox-group>
                </el-form-item>);
        },
        textarea(node, data, parent) {
            const fieldInfo = this.getFieldInfo(node, data, parent);
            const props = this.getFieldProps(node, data);
            return (<el-form-item
                label={ fieldInfo.display }
                label-position={ props.labelPosition }
                hidden-label={ props.hiddenLabel }>
                    <el-input
                    maxlength={ Number(fieldInfo.fieldLength) }
                    placeholder={ fieldInfo.placeHolder }
                    v-model={ this.formData[node.id] }
                    required={ props.required }
                    facade={ props.facade }
                    autosize
                    key={ node.id }
                    scan={ props.scan }
                    hidden={ props.hidden }
                    type="textarea">checkbox</el-input>
                </el-form-item>);
        },
        radio(node, data, parent) {
            const fieldInfo = this.getFieldInfo(node, data, parent);
            const props = this.getFieldProps(node, data);
            const { enums } = fieldInfo;
            return (<el-form-item
                label={ fieldInfo.display }
                label-position={ props.labelPosition }
                hidden-label={ props.hiddenLabel }>
                    <el-radio-group v-model={ this.formData[node.id] } key={ node.id } inline={ props.radioInline }>
                        {
                            enums && enums.length ?
                                enums.map(item => <el-radio label={ item.id } key={ item.id }>{ item.showValue }</el-radio>) : null
                        }
                    </el-radio-group>
                </el-form-item>);
        },
        datetime(node, data, parent) {
            const fieldInfo = this.getFieldInfo(node, data, parent);
            const props = this.getFieldProps(node, data);
            return (<el-form-item
                label={ fieldInfo.display }
                label-position={ props.labelPosition }
                hidden-label={ props.hiddenLabel }>
                    <el-calendar
                    type='datetime'
                    key={ node.id }
                    placeholder={ fieldInfo.placeHolder }
                    scan={ props.scan }
                    hidden={ props.hidden }
                    facade={ props.facade }
                    required={ props.required }
                    v-model={ this.formData[node.id] }></el-calendar>
                </el-form-item>);
        },
        date(node, data, parent) {
            const fieldInfo = this.getFieldInfo(node, data, parent);
            const props = this.getFieldProps(node, data);
            return (<el-form-item
                label={ fieldInfo.display }
                label-position={ props.labelPosition }
                hidden-label={ props.hiddenLabel }>
                    <el-calendar
                    type='date'
                    key={ node.id }
                    scan={ props.scan }
                    hidden={ props.hidden }
                    facade={ props.facade }
                    required={ props.required }
                    placeholder={ fieldInfo.placeHolder }
                    v-model={ this.formData[node.id] }></el-calendar>
                </el-form-item>);
        },
        select(node, data, parent) {
            const fieldInfo = this.getFieldInfo(node, data, parent);
            const props = this.getFieldProps(node, data);
            const { enums } = fieldInfo;
            return (<el-form-item
                label={ fieldInfo.display }
                label-position={ props.labelPosition }
                hidden-label={ props.hiddenLabel }>
                    <el-select
                    v-model={ this.formData[node.id] }
                    key={ node.id }
                    placeholder={ fieldInfo.placeHolder }
                    facade={ props.facade }
                    scan={ props.scan }
                    hidden={ props.hidden }
                    filterable
                    required={ props.required }>
                        {
                            enums && enums.length ?
                                enums.map(item => <el-option label={ item.showValue } value={ item.id } key={ item.id }></el-option>) : null
                        }
                    </el-select>
                </el-form-item>);
        },
        table(data) {
            return this.renderTable(data);
        }
    };

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
        data() {
            return {
                test : 'test',
                data : null,
                type : 'edit', // edit browse
                formData : {},
                checked : []
            };
        },
        props : {},
        mounted() {
            initCalendarFile(); // 加载日期时间控件依赖的文件
            this.calendarFileLoaded = true;
            this.requestFormData();
        },
        updated() {
            this.initCalendar();
        },
        methods : {
            async requestFormData() {
                fetch.createOrEdit.body = params.NewParams;
//                const { data } = await Api.resource(fetch.createOrEdit);
                this.data = FormData.data.data;
            },
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
            initFieldModel() {
                if (!this.data) return;
                const { formmain = {} } = this.data.tableInfo;
                if (!formmain.fieldInfo) return;
                Object.keys(formmain.fieldInfo).forEach(id => this.$set(
                    this.formData,
                    id,
                    this.getFieldDefaultModel(formmain.fieldInfo[id])
                ));
            },
            getFieldDefaultModel(field) {
                switch (field.inputType) {
                    default:
                        return field.value;
                }
            },
            renderTable(table) {
                const row = table.row;
                const col = table.col;
                table.mergeMap = this.getMergeMap(row, col, table);
                const tableStyle = this.getTableStyle(table);

                return (
                    <table style={ this.getTableStyle(table) } key={ table.id }>
                        {
                            Array(row).fill(null).map((r, rIndex) => this.renderTableTr(rIndex, col, table))
                        }
                    </table>
                );
            },
            getTableStyle(table) {
                const { colWidths } = table;
                let tableWidth = 0;
                if (!colWidths || !colWidths.length) return {};
                tableWidth = colWidths.reduce((p, n) => p + n, tableWidth);
                return {
                    width : `${tableWidth}px`
                };
            },
            getMergeMap(row, col, table) {
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
            },
            renderTableTr(rIndex, col, table) {
                return (
                    <tr>
                        {
                            Array(col).fill(null).map((c, cIndex) => this.renderTableTd(rIndex, cIndex, table))
                        }
                    </tr>
                );
            },
            renderTableTd(rIndex, cIndex, table) {
                const cell = this.getCell(rIndex, cIndex, table);
                const isMerged = this.isMergedCell(rIndex, cIndex, table.mergeMap);
                const isMergeOriginCell = this.isMergeOriginCell(rIndex, cIndex, table);
                if (isMerged && !isMergeOriginCell) return null;
                const style = this.getCellStyle(rIndex, cIndex, table);
                if (cell && isMergeOriginCell) {
                    return (
                        <td colspan={ isMergeOriginCell.colSpan } rowspan={ isMergeOriginCell.rowSpan } style={ style }>
                            { this.getCellFields(cell, table) }
                        </td>
                    );
                }
                if (cell && !isMerged) return (<td style={ style }>{ this.getCellFields(cell, table) }</td>);
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
            getCellFields(cell, table) {
                const children = cell.children;
                if (!children) return null;
                return children.map(node => this.parseNode(node, table));
            },
            getCellStyle(rowIndex, colIndex, table) {
                const colWidths = table.colWidths;
                const width = colWidths[colIndex];
                const isMergeOriginCell = this.isMergeOriginCell(rowIndex, colIndex, table);
                const step = isMergeOriginCell ? isMergeOriginCell.colSpan : 1;
                const cellWidth = (parseInt(width, 10) * step) + (step - 1);
                return {
                    width : `${cellWidth}px`
                };
            },
            getFieldInfo(node, data, parent) {
                const isFormMain = !parent || parent.isMaster;
                const nodeId = node.id;
                const { tableInfo } = data;
                if (isFormMain) {
                    return tableInfo.formmain.fieldInfo[nodeId];
                }
                // 重复表
                return {};
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
                props.checkboxLabelStyle = attrs.checkBoxTitleStyle;
                props.scan = authInfo[nodeId].auth === 'browse';
                props.hidden = authInfo[nodeId].auth === 'hide';
                return props;
            },
            parseNode(node, ...rest) {
                const nodeType = node.nodeType === 'ctrl' ? node.type : node.nodeType;
                return fieldMap.hasOwnProperty(nodeType) ? fieldMap[nodeType].call(this, node, this.data, ...rest) : null;
            },
            renderCreateHeader() {
                return (
                    <div class="el-Sheet__header">
                    <el-button type="primary" onClick={ this.saveForm }>保存</el-button>
                    <el-button type="primary">保存并新建</el-button>
                    <el-button type="primary">保存并复制</el-button>
                    <el-button>取消</el-button>
                    </div>
                );
            },
            renderEditHeader() {
                return (
                    <div class="el-Sheet__header">
                    <el-button type="primary" onClick={ this.saveForm }>保存</el-button>
                    <el-button type="primary">保存修改下一条</el-button>
                    <el-button>取消</el-button>
                    </div>
                );
            },
            renderBrowseHeader() {
                return null;
            },
            renderHeader() {
                if (this.type === 'create') return this.renderCreateHeader();
                if (this.type === 'edit') return this.renderEditHeader();
                return this.renderBrowseHeader;
            },
            getFormStyle() {
                const { viewInfo } = this.data;
                if (!viewInfo) return {};
                return viewInfo.viewContent.styles;
            },
            async saveForm() {
                console.log(this.formData);
                const { viewInfo, content, tableInfo } = this.data;
                const formName = tableInfo.formmain.tableName;
                const body = {
                    content : {
                        ...content,
                        isMerge : '0',   // 是否仅仅合并缓存
                        saveType : '1'   // 1:保存，2:保存并新建，3:保存并复制
                    },
                    [formName] : {
                        ...this.formData
                    }
                };
                fetch.saveOrUpdate.body = body;
                const { data } = await Api.resource(fetch.saveOrUpdate);
            }
        },
        computed : {
            fieldData() {
                console.log(this.formData);
            }
        },
        watch : {
            data(value) {
                value && this.initFieldModel();
            }
        },
        render() {
            if (!this.data) return null;
            const view = this.data.viewInfo.viewContent.children;
            return (
                <div class="el-Sheet">
                { this.renderHeader() }
                <div class='el-Sheet__content'style={ this.getFormStyle() }>
                <div class='el-Sheet__formHeader'>{ this.data.formInfo.formName }</div>
                <el-form label-width="76px" v-model={ this.formData } style={ this.getFormStyle() }>
                    {
                        view.map(node => this.parseNode(node))
                    }
                </el-form>
                </div>
                </div>
            );
        }
    };
</script>

<style>
    @component-namespace el{
        @b Sheet{
            @e header {
                padding: 10px 20px;
                border-bottom: 1px solid #CECECE;
            }
            @e content {
                margin: 46px auto 0;
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
                border-spacing: 0px;
                table-layout: fixed;
                & + table {
                    margin-top: 20px;
                }
            }
            td {
                border: 1px solid #B6B6B6;
                border-bottom: 0;
                overflow-x: hidden;
                padding: 0;
                & > .el-form-item {
                }
            }
            td ~ td {
                border-left: 0;
            }
            table tr:last-child td {
                border-bottom: 1px solid #B6B6B6;
            }
        }
    }
</style>
