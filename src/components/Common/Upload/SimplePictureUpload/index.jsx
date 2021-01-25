import React, { useState, useEffect } from 'react'
import { Button, Upload, message } from 'antd'
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import './style.less'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

const SimplePictureUpload = (props) => {

  const {
    name: field,
    children: childrenProps,
    props: {
      action = '/ebd/sys/file/upload',
      listType = 'picture-card',
      accept = '.jpg,.jpeg,.png,.gif,.bmp',
      name = 'file',
      showUploadList = false,
      className = "avatar-uploader",
      uploadSuccess,
      previewImage: previewImageProps,
      ...otherUploadProps
    }
  } = props

  const [previewImage, setPreviewImage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setPreviewImage(previewImageProps)
  }, [previewImageProps])

  // 上传之前的操作
  const beforeUpload = file => {
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.warn('图片大小不能大于10MB!')
    }

    return isLt10M
  }

  // 上传
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setPreviewImage(imageUrl)
        setLoading(false)
      });

      if (uploadSuccess) {
        uploadSuccess(field, info.file.response.data.id)
      }
    }
  }

  const uploadButton = childrenProps || (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">上传</div>
    </div>
  );

  return (
    <Upload
      action={action}
      listType={listType}
      accept={accept}
      name={name}
      showUploadList={showUploadList}
      className={className}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      {...otherUploadProps}
    >
      {previewImage ? <img src={previewImage} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  )

}

export default SimplePictureUpload
