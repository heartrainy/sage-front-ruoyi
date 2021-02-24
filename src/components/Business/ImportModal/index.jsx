import React, { useImperativeHandle, useState } from 'react';
import { Modal, Upload, Checkbox, Button, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import { requestPrefix } from '@/services/prefix';
import { download } from '@/utils/utils'
import { SageMessage } from '@/components/Common';

const { Dragger } = Upload;

/**
 * 导出窗口
 * @param {*} props 
 * @param {*} ref 
 */
function ImportModal(props, ref) {

  const { width = '400px', title = '导入', request, downloadTemplate } = props

  const [visible, setVisible] = useState(false)
  const [updateSupport, setUpdateSupport] = useState(0)  // 是否更新已经存在的用户数据
  const [fileList, setFileList] = useState([])

  const config = {
    name: 'file',
    accept: '.xls,.xlsx',
    multiple: false,
    maxCount: 1,
    // action: `/${requestPrefix}/system/user/importData?updateSupport=${updateSupport}`,
    beforeUpload: file => {
      setFileList([...fileList, file])
      return false;
    },
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList)
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
        setFileList([info.file])
      }
      // if (status === 'done') {
      //   message.success(`${info.file.name} file uploaded successfully.`);
      // } else if (status === 'error') {
      //   message.error(`${info.file.name} file upload failed.`);
      // }
    },
    fileList
  };

  const onOk = async () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('file', file);
    });

    const res = await request({
      updateSupport: updateSupport,
      file: formData
    })

    if (res.code === 200) {
      Modal.success({
        title: '导入结果',
        width: '460px',
        content: <div dangerouslySetInnerHTML={{__html: res.msg}} />
      })
    } else {
      Modal.error({
        title: '导入结果',
        width: '460px',
        content: <div dangerouslySetInnerHTML={{__html: res.msg}} />
      })
    }

    setVisible(false)
  }

  const onCancel = () => {
    setVisible(false)
    setFileList([])
  }

  const onChangeUpdateSupport = (e) => {
    setUpdateSupport(e.target.checked ? 1 : 0)
  }

  const onDownloadTemplate = async () => {
    const res = await downloadTemplate()
    if (res.code === 200) {
      download(res.msg)
    }
  }

  // 暴露给外部的方法
  useImperativeHandle(ref, () => ({
    setVisible
  }))

  return (
    <Modal
      title={title}
      width={width}
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      onOk={onOk}
      destroyOnClose={true}
    >
      <div>
        <div style={{marginBottom: '2px', fontSize: '12px'}}>
          <Checkbox onChange={onChangeUpdateSupport}>是否更新已经存在的用户数据</Checkbox>
          <Button type="link" size="small" style={{marginLeft: '10px'}} onClick={onDownloadTemplate}>
            下载模板
          </Button>
        </div>
        <div style={{marginBottom: '10px', fontSize: '12px', color: 'red'}}>提示：仅允许导入“xls”或“xlsx”格式文件！</div>
        
        <Dragger {...config}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">单击或拖动文件到此区域进行上传</p>
          {/* <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p> */}
        </Dragger>
      </div>
    </Modal>
  );
}

export default React.forwardRef(ImportModal);
