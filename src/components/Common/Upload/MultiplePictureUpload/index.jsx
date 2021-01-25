import React, { useState, useEffect } from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './style.less'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const MutilplePictureUpload = (props) => {

  const {
    name: field,
    children: childrenProps,
    maxNum = 3,
    props: {
      action = '/ebd/sys/file/upload',
      listType = 'picture-card',
      accept = '.jpg,.jpeg,.png,.gif,.bmp',
      name = 'file',
      fileList: fileListProps,
      uploadSuccess,
      ...otherUploadProps
    }
  } = props

  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [fileList, setFileList] = useState([])

  useEffect(() => {
    setFileList(fileListProps || [])
  }, [fileListProps])


  // 上传之前的操作
  const beforeUpload = file => {
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.warn('图片大小不能大于10MB!')
    }

    return isLt10M
  }

  // 上传
  const handleChange = ({ file, fileList: _fileList }) => {
    if (file.status === 'done') {
      if (uploadSuccess) {
        const imageList = []
        _fileList.forEach(item => {
          imageList.push(item.response?.data.id || item.id)
        })
        uploadSuccess(field, imageList)
      }
    }
    setFileList(_fileList)
  }

  // 删除
  const hanldeRemove = (file) => {
    const newFileList = fileList.slice()
    fileList.forEach((item, index) => {
      if (item.uid === file.uid) {
        newFileList.splice(index, 1)
      }
    })
    // setFileList(newFileList)

    if (uploadSuccess) {
      const imageList = []
      newFileList.forEach(item => {
        imageList.push(item.response?.data.id || item.id)
      })
      uploadSuccess(field, imageList)
    }
  }

  // 预览
  const handlePreview = async file => {

    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
  };

  // 关闭预览
  const handleCancel = () => {
    setPreviewVisible(false)
  }

  const uploadButton = childrenProps || (
    <div>
      <PlusOutlined />
      <div className="ant-upload-text">上传图片</div>
    </div>
  );

  return (
    <div className="clearfix">
      <Upload
        fileList={fileList}
        action={action}
        listType={listType}
        accept={accept}
        name={name}
        onPreview={handlePreview}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        onRemove={hanldeRemove}
        {...otherUploadProps}
      >
        {fileList.length >= maxNum ? null : uploadButton}
      </Upload>

      <Modal
        visible={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  )

}

export default MutilplePictureUpload
