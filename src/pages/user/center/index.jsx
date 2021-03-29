import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Tabs, Upload } from 'antd'
import { connect } from 'umi'
import ImgCrop from 'antd-img-crop';
import { SageLayoutLR, SageForm, SageMessage } from '@/components/Common'
import { mobile, email } from '@/utils/verify'
import { updateUser, resetPwd, getUserProfile, uploadAvatar } from '@/pages/system/user/service'
import { requestPrefix } from '@/services/prefix'
import defaultAvator from '@/assets/profile.jpg'

import style from './style.less'

const { TabPane } = Tabs;

const Center = (props) => {

  const {dispatch} = props

  const [userDetail, setUserDetail] = useState({})

  const formRef = useRef()
  const formRef2 = useRef()

  const requestCenterInfo = async () => {
    const res = await getUserProfile()
    if (res.code === 200) {
      const obj = Object.assign({}, res.data)
      obj.roleGroup = res.roleGroup
      obj.postGroup = res.postGroup
      setUserDetail(obj)

      // 基本资料赋值
      formRef.current.setFieldsValue({
        nickName: obj.nickName,
        phonenumber: obj.phonenumber,
        email: obj.email,
        sex: obj.sex,
      })
    }
  }

  // 表单字段设置
  const formFields = [
    {
      name: 'nickName',
      label: '用户昵称',
      type: 'input',
      rules: [{ required: true }],
      props: {
        style: { width: '300px' }
      }
    },
    {
      name: 'phonenumber',
      label: '手机号码',
      type: 'input',
      rules: [
        { required: true },
        { pattern: mobile, message: '请输入正确的手机号码' }
      ],
      props: {
        style: { width: '300px' }
      }
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'input',
      rules: [
        { required: true },
        { pattern: email, message: '请输入正确的邮箱' }
      ],
      props: {
        style: { width: '300px' }
      }
    },
    {
      name: 'sex',
      label: '性别',
      type: 'radio',
      initialValue: '0',
      options: [
        { value: '1', text: '女' },
        { value: '0', text: '男' },
      ]
    }
  ]

  const doSave = async (values) => {
    const formData = Object.assign({}, values)

    formData.loginId = userDetail.loginId
    const res = await updateUser(formData)

    if (res.code === 200) {
      SageMessage.success('保存成功')
      window.location.reload()
    }
  }

  const onFinish = (values) => {
    doSave(values)
  }

  const onFinishFailed = ({ values }) => {
    console.log(values)
  }

  // 表单字段设置
  const formFields2 = [
    {
      name: 'oldPassword',
      label: '旧密码',
      type: 'input',
      rules: [
        { required: true, message: '请输入旧密码' }
      ],
      props: {
        type: 'password',
        style: { width: '300px' }
      }
    },
    {
      name: 'newPassword',
      label: '新密码',
      type: 'input',
      rules: [
        { required: true, message: '请输入新密码' }
      ],
      props: {
        type: 'password',
        style: { width: '300px' }
      }
    },
    {
      name: 'confirmPassword',
      label: '确认密码',
      dependencies: ['newPwd'],
      type: 'input',
      rules: [
        { required: true, message: '请确认新密码' },
        ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value || getFieldValue('newPassword') === value) {
              return Promise.resolve();
            }
            return Promise.reject('新密码不一致!');
          },
        }),
      ],
      props: {
        type: 'password',
        style: { width: '300px' }
      }
    }
  ]

  const doSave2 = async (values) => {
    const formData = Object.assign({}, values)

    // formData.loginId = userDetail.loginId
    const res = await resetPwd(formData)

    if (res.code === 200) {
      SageMessage.success('修改密码成功')
      window.location.reload()
    }
  }

  const onFinish2 = (values) => {
    doSave2(values)
  }

  const onFinishFailed2 = ({ values }) => {
    console.log(values)
  }

  useEffect(() => {
    // const data = props.user.currentUser
    // console.log(data)
    // setUserDetail(data)
    // formRef.current.setFieldsValue({
    //   // personName: data.personName,
    //   // mobile: data.mobile,
    //   // email: data.email,
    //   // sex: data.sex,
    // })
    requestCenterInfo()
  }, [])


  const onChange = async ({ file: newFile }) => {
    if (newFile.status === 'done') {
      const formData = new FormData();
      formData.append('avatarfile', newFile.originFileObj);

      const res = await uploadAvatar({
        file: formData
      })

      if (res.code === 200) {
        SageMessage.success('修改成功')
        requestCenterInfo()
        dispatch({
          type: 'user/fetchCurrent',
        });
      }
    }
  };

  const onPreview = async file => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  return (
    <PageHeaderWrapper>

      <SageLayoutLR
        leftWidth="300"
        left={
          <Card title="个人信息" size="small" style={{ height: '100%' }}>
            <div>
              <div className={style["center-avator"]}>
                <ImgCrop rotate>
                  <Upload
                    action={`/${requestPrefix}/system/user/profile/avatar`} // 无效地址(只是为了不再请求当前页设置的地址)
                    listType="picture-card"
                    className="avatar-uploader"
                    name="avatarfile"
                    showUploadList={false}
                    onChange={onChange}
                    onPreview={onPreview}
                  >
                    <img src={userDetail.avatar ? `/${requestPrefix}${userDetail.avatar}` : defaultAvator} width="120" height="120" />
                  </Upload>
                </ImgCrop>
                {/* <img src={userDetail.avatar ? userDetail.avatar : defaultAvator} width="120" height="120" /> */}
              </div>
              <div className={style["user-info"]}>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>用户名称</div>
                  <div className={style["user-info-item-right"]}>{userDetail.userName}</div>
                </div>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>手机号码</div>
                  <div className={style["user-info-item-right"]}>{userDetail.phonenumber}</div>
                </div>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>用户邮箱</div>
                  <div className={style["user-info-item-right"]}>{userDetail.email}</div>
                </div>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>所属部门</div>
                  <div className={style["user-info-item-right"]}>{userDetail.dept ? `${userDetail.dept.deptName} / ${userDetail.postGroup}` : ''}</div>
                </div>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>所属角色</div>
                  <div className={style["user-info-item-right"]}>{userDetail.roleGroup}</div>
                </div>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>入职时间</div>
                  <div className={style["user-info-item-right"]}>{userDetail.createTime}</div>
                </div>
              </div>
            </div>
          </Card>
        }
        right={
          <div style={{ paddingLeft: 12, height: '100%' }}>
            <Card title="基本资料" size="small" style={{ height: '100%' }}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="基本资料" key="1">
                  <SageForm
                    ref={formRef}
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    formFields={formFields}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    showButtonRow
                    showSubmitButton
                    tailLayout={{
                      wrapperCol: { offset: 3, span: 21 }
                    }}
                  />
                </TabPane>
                <TabPane tab="修改密码" key="2">
                  <SageForm
                    ref={formRef2}
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                    formFields={formFields2}
                    onFinish={onFinish2}
                    onFinishFailed={onFinishFailed2}
                    showButtonRow
                    showSubmitButton
                    tailLayout={{
                      wrapperCol: { offset: 3, span: 21 }
                    }}
                  />
                </TabPane>
              </Tabs>
            </Card>
          </div>

        }
      />

    </PageHeaderWrapper>
  )
}

export default connect(({ user }) => ({ user }))(Center)
