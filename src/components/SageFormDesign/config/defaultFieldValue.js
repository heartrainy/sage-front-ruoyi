const defaultFieldValue = {
  input: {
    label: '单行文本',      // 标题
    fieldId: '',           // 字段名
    placeholder: '请输入单行文本',        // 占位提示
    // span: 24,               // 表单栅格
    // labelWidth: '',         // 标签宽度
    componentWidth: '100%', // 组件宽度
    defaultValue: '',       // 默认值
    maxLength: '',          // 最多输入
    clearable: true,        // 能否清空
    readonly: false,        // 是否只读
    disabled: false,        // 是否禁用
    required: true          // 是否必填
  },
  textarea: {
    label: '多行文本',      // 标题
    fieldId: '',           // 字段名
    placeholder: '请输入多行文本',        // 占位提示
    // span: 24,               // 表单栅格
    // labelWidth: '',         // 标签宽度
    componentWidth: '100%', // 组件宽度
    defaultValue: '',       // 默认值
    maxLength: '',          // 最多输入
    minRows: 4,              // 最小行数
    maxRows: 4,              // 最大行数
    clearable: true,        // 能否清空
    readonly: false,        // 是否只读
    disabled: false,        // 是否禁用
    required: true          // 是否必填
  },
  password: {
    label: '密码',      // 标题
    fieldId: '',           // 字段名
    placeholder: '请输入密码',        // 占位提示
    // span: 24,               // 表单栅格
    // labelWidth: '',         // 标签宽度
    componentWidth: '100%', // 组件宽度
    defaultValue: '',       // 默认值
    maxLength: '',          // 最多输入
    clearable: true,        // 能否清空
    readonly: false,        // 是否只读
    disabled: false,        // 是否禁用
    required: true          // 是否必填
  },
  number: {
    label: '计数器',      // 标题
    fieldId: '',           // 字段名
    placeholder: '计数器',        // 占位提示
    // span: 24,               // 表单栅格
    // labelWidth: '',         // 标签宽度
    componentWidth: '200px', // 组件宽度
    defaultValue: '',       // 默认值
    min: 1,          // 最小值
    max: 100,          // 最大值
    step: 1,          // 步长
    precision: '',    // 精度
    readonly: false,        // 是否只读
    disabled: false,        // 是否禁用
    required: true          // 是否必填
  },
}

export default defaultFieldValue