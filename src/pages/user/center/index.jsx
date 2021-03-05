import React, { useState, useEffect, useRef } from 'react'
import { PageHeaderWrapper } from '@ant-design/pro-layout'
import { Card, Tabs } from 'antd'
import { connect } from 'umi'
import { SageLayoutLR, SageForm, SageMessage } from '@/components/Common'
import { mobile, email } from '@/utils/verify'
import { updateUser, resetPwd } from '@/pages/system/user/service'

import style from './style.less'

const { TabPane } = Tabs;

const Center = (props) => {

  const [userDetail, setUserDetail] = useState({})

  const formRef = useRef()
  const formRef2 = useRef()
  // const requestCenterInfo = async () => {
  //   const res = await getUserDetail({id: props.user.currentUser.userId})
  //   if (res.code === 200) {
  //     setUserDetail(res.data)
  //   }
  // }

  // 表单字段设置
  const formFields = [
    {
      name: 'personName',
      label: '用户名',
      type: 'input',
      rules: [{ required: true }],
      props: {
        style: {width: '300px'}
      }
    },
    {
      name: 'mobile',
      label: '手机号',
      type: 'input',
      rules: [
        { required: true },
        { pattern: mobile, message: '请输入正确的手机号' }
      ],
      props: {
        style: {width: '300px'}
      }
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'input',
      rules: [
        // { required: true },
        { pattern: email, message: '请输入正确的邮箱' }
      ],
      props: {
        style: {width: '300px'}
      }
    },
    {
      name: 'sex',
      label: '性别',
      type: 'radio',
      initialValue: '1',
      options: [
        { value: '1', text: '男' },
        { value: '0', text: '女' },
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
      name: 'oldPwd',
      label: '旧密码',
      type: 'input',
      rules: [
        { required: true, message: '请输入旧密码' }
      ],
      props: {
        type: 'password',
        style: {width: '300px'}
      }
    },
    {
      name: 'newPwd',
      label: '新密码',
      type: 'input',
      rules: [
        { required: true, message: '请输入新密码' }
      ],
      props: {
        type: 'password',
        style: {width: '300px'}
      }
    },
    {
      name: 'confirmPwd',
      label: '确认密码',
      dependencies: ['newPwd'],
      type: 'input',
      rules: [
        { required: true, message: '请确认新密码' },
        ({ getFieldValue }) => ({
          validator(rule, value) {
            if (!value || getFieldValue('newPwd') === value) {
              return Promise.resolve();
            }
            return Promise.reject('新密码不一致!');
          },
        }),
      ],
      props: {
        type: 'password',
        style: {width: '300px'}
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
    const data = props.user.currentUser.user
    setUserDetail(data)
    formRef.current.setFieldsValue({
      personName: data.personName,
      mobile: data.mobile,
      email: data.email,
      sex: data.sex,
    })
  }, [])

  return (
    <PageHeaderWrapper>

      <SageLayoutLR
        leftWidth="300"
        left={
          <Card title="个人信息" size="small" style={{ height: '100%' }}>
            <div>
              <div className={style["center-avator"]}>
                <img src={`/ebd/sys/file/showImage?imageId=${userDetail.headImage}`} width="120" height="120" />
              </div>
              <div className={style["user-info"]}>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>登录名</div>
                  <div className={style["user-info-item-right"]}>{userDetail.mobile}</div>
                </div>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>用户名</div>
                  <div className={style["user-info-item-right"]}>{userDetail.personName}</div>
                </div>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>所属部门</div>
                  <div className={style["user-info-item-right"]}>{userDetail.orgnName}</div>
                </div>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>用户邮箱</div>
                  <div className={style["user-info-item-right"]}>{userDetail.email}</div>
                </div>
                <div className={style["user-info-item"]}>
                  <div className={style["user-info-item-left"]}>入职时间</div>
                  <div className={style["user-info-item-right"]}>{userDetail.entryTime}</div>
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
                    labelCol={ {span: 3 }}
                    wrapperCol={ {span: 21} }
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
                    labelCol={ {span: 3 }}
                    wrapperCol={ {span: 21} }
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
