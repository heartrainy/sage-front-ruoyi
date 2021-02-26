import React, { useEffect, useState } from 'react';
import { VerifiedOutlined } from '@ant-design/icons';
import { Alert, Checkbox, Form, Row, Col, Input } from 'antd';
import { Link, connect } from 'umi';
import LoginFrom from './components/Login';
import styles from './style.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = LoginFrom;
const FormItem = Form.Item;

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = props => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType, errorMessage, codeUrl, uuid } = userLogin;
  const [autoLogin, setAutoLogin] = useState(true);
  const [type, setType] = useState('account');

  const getCode = () => {
    const { dispatch } = props;
    dispatch({
      type: 'login/getCodeImg',
      payload: {},
    });
  }

  useEffect(() => {
    if (localStorage.token) {
      console.log(localStorage.token)
      window.location.href = '/home'
    }
    getCode()
  }, [])

  const handleSubmit = values => {
    const { dispatch } = props;
    const pp = {
      uuid: uuid,
      ...values
    }
    dispatch({
      type: 'login/login',
      payload: { ...pp }
    });
  };

  return (
    <div className={styles.main}>
      <LoginFrom activeKey={type} onTabChange={setType} onSubmit={handleSubmit}>
        <Tab key="account" tab="账户密码登录">
          {status === 'error' && loginType === 'account' && !submitting && (
            <LoginMessage content={errorMessage} />
          )}

          <UserName
            name="username"
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <Password
            name="password"
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <FormItem shouldUpdate noStyle>
            <Row gutter={8}>
              <Col span={16}>
                <FormItem 
                  name="code"
                  rules={[{ required: true, message: '请输入验证码!' }]}
                >
                  <Input size="large" placeholder="验证码" prefix={<VerifiedOutlined style={{ color: '#1890ff'}} />} />
                </FormItem>
              </Col>
              <Col span={8}>
                <img src={codeUrl} onClick={getCode} className="login-code-img"/>
              </Col>
            </Row>
          </FormItem>
        </Tab>
        <Tab key="mobile" tab="手机号登录">
          {status === 'error' && loginType === 'mobile' && !submitting && (
            <LoginMessage content="验证码错误" />
          )}
          <Mobile
            name="mobile"
            placeholder="手机号"
            rules={[
              {
                required: true,
                message: '请输入手机号！',
              },
              {
                pattern: /^1\d{10}$/,
                message: '手机号格式错误！',
              },
            ]}
          />
          <Captcha
            name="captcha"
            placeholder="验证码"
            countDown={120}
            getCaptchaButtonText=""
            getCaptchaSecondText="秒"
            rules={[
              {
                required: true,
                message: '请输入验证码！',
              },
            ]}
          />
        </Tab>
        <div>
          <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
        <Submit loading={submitting}>登录</Submit>
        <div className={styles.other}>
          {/* 其他登录方式
          <AlipayCircleOutlined className={styles.icon} />
          <TaobaoCircleOutlined className={styles.icon} />
          <WeiboCircleOutlined className={styles.icon} />
          <Link className={styles.register} to="/user/register">
            注册账户
          </Link> */}
        </div>
      </LoginFrom>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
