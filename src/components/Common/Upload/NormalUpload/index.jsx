import React, { useState, useEffect } from 'react'
import { Button, Upload, message } from 'antd'
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import './style.less'


const NormalUpload = (props) => {

  const {
    name: field,
    children: childrenProps,
    maxNum,
    props: {
      action = '/ebd/sys/file/upload',
      name = 'file',
      fileList: fileListProps,
      uploadSuccess,
      ...uploadProps
    }
  } = props

  const [fileList, setFileList] = useState([])

  useEffect(() => {
    setFileList(fileListProps || [])
  }, [fileListProps])

  // 上传
  const handleChange = ({ file, fileList: _fileList }) => {
    // if (info.file.status !== 'uploading') {
    //   // console.log(info.file, info.fileList);
    // }
    // if (info.file.status === 'done') {
    //   // message.success(`${info.file.name} file uploaded successfully`);
    //   message.success(`文件上传成功`);
    // } else if (info.file.status === 'error') {
    //   // message.error(`${info.file.name} file upload failed.`);
    //   message.error(`文件上传失败`);
    // }

    let newFileList = _fileList.slice()
    if (maxNum) {
      newFileList = newFileList.slice(-maxNum)
    }

    if (file.status === 'done') {
      if (uploadSuccess) {
        const imageList = []
        newFileList.forEach(item => {
          imageList.push(item.response?.data.id || item.id)
          item.thumbUrl = `/ebd/sys/file/showImage?imageId=${item.response?.data.id || item.id}`
        })
        uploadSuccess(field, imageList)
      }
    }
    setFileList(newFileList)
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

  const uploadButton = childrenProps || (
    <Button>
      <UploadOutlined /> 上传
    </Button>
  );

  return (
    <Upload
      action={action}
      name={name}
      fileList={fileList}
      onChange={handleChange}
      onRemove={hanldeRemove}
      {...uploadProps}
    >
      {childrenProps || uploadButton}
    </Upload>
  )

}

export default NormalUpload
