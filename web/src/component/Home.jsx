import React from 'react'
import { Layout, Button, Avatar, Radio, Modal, Form, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Index } from './Index'
import Mine from './Mine'
import './Home.less'
import axios from 'axios'
import moment from 'moment'
import { HomeContext } from './HomeContext'

const { Header, Content } = Layout;


class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            value: "a",
            visible: false,
            iconLoading: false,
            data: '',
            checkInterface: true,
            registerData: {},
            randnum: undefined,
            time: undefined,
            displayTime: false,
            countDown: 60,
            registerSuccess: false,
            userInfo:{},
            isLoginStatus:false
        }
    }
    onFinish = values => {
        console.log(values)
        this.setState({ iconLoading: true })
        axios({
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            url: 'http://localhost:3000/all/login',
            data: values
        }).then(({ data }) => {
            let storage = window.localStorage;
            storage.setItem("userId", data.userId)
            message.success("登录成功！")
            this.setState({ visible: false, iconLoading: false, data: data || '',isLoginStatus:true },this.fetch)
        }).catch(function (error) {
            message.info("服务器错误！")
        });

    };
    componentDidMount(){
        let userId = window.localStorage.getItem("userId")
        if(userId){
            this.fetch()
        }
    }
    fetch = () => {
        let userId = window.localStorage.getItem("userId")
        axios({
            method: 'get',
            headers: { 'Content-type': 'application/json' },
            url: 'http://localhost:3000/all/getPersonalInfo',
            params: {userId}
        }).then(({data}) => {
            this.setState({userInfo:data,isLoginStatus:true})
        }).catch(function (error) {
            // message.info("服务器错误！")
        });
    }
    onFormLayoutChange = (_, b) => {
        this.setState({ registerData: b })
    }
    getVerificationCode = () => {
        let { registerData: { userId }, registerSuccess } = this.state;
        this.setState({ displayTime: true }, () => {
            let { countDown } = this.state;
            let abc = setInterval(() => {
                if (countDown > 0 && !registerSuccess) {
                    countDown--
                    this.setState({ countDown })
                } else {
                    this.setState({ displayTime: false, countDown: 60 }, () => {
                        clearInterval(abc)
                    })
                }
            }, 1000)
        })

        axios({
            method: 'get',
            headers: { 'Content-type': 'application/json' },
            url: 'http://localhost:3000/get/getverificationCode',
            params: { userId }
        }).then(({ data }) => {
            this.setState({ randnum: data.randnum, time: moment() })
            message.info("获取成功！")
        }).catch(function (error) {
            message.info("服务器错误！")
        });
    }
    registerNow = () => {
        let { registerData, time, randnum } = this.state;
        let { verificationCode } = registerData
        if (!time || !randnum) {
            message.error("验证码失效或者不正确，请重新获取")
            return

        }
        if (moment().diff(time, 'seconds') > 60 || verificationCode != randnum) {
            message.error("验证码失效或者不正确，请重新获取")
            return
        }
        axios({
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            url: 'http://localhost:3000/get/registerNow',
            data: registerData
        }).then((res) => {
            this.setState({ checkInterface: true, registerSuccess: true }, () => {
                message.info("注册成功！")
            })
        }).catch(function (error) {
            message.info("注册失败！")
        });
    }
    registerInterface = () => {
        let { iconLoading, displayTime, countDown } = this.state;
        let layout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        let tailLayout = {
            wrapperCol: { offset: 5, span: 16 },
        };
        return <Form
            {...layout}
            name="basic"
            initialValues={{}}
            onValuesChange={this.onFormLayoutChange}
        >

            <Form.Item
                label="手    机："
                name="userId"
                rules={[{ required: true, message: '请输入手机号！' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="设置密码："
                name="password"
                rules={[{ required: true, message: '请输入你的密码！' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="确认密码："
                name="surePassword"
                rules={[{ required: true, message: '请输入你的密码！' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                label="验 证 码："
                name="verificationCode"
                rules={[{ required: true, message: '请输入验证码！' }]}
            >
                {displayTime ? <Input suffix={<Button type="primary" size="small">{countDown}</Button>} /> :
                    <Input suffix={<Button type="primary" size="small" onClick={this.getVerificationCode}>获取验证码</Button>} />}

            </Form.Item>

            <Form.Item {...tailLayout}>
                <Button
                    type="primary"
                    htmlType="submit"
                    onClick={this.registerNow}
                    style={{ width: "100%" }}
                    loading={iconLoading}
                >
                    立即注册
            </Button>
            </Form.Item>
            <Form.Item  {...tailLayout} style={{ textAlign: "right" }}>
                <Button type="link" onClick={() => this.setState({ checkInterface: true })}>登录</Button>
            </Form.Item>
        </Form>
    }
    Demo = () => {
        let { iconLoading, checkInterface } = this.state;
        let layout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        let tailLayout = {
            wrapperCol: { offset: 5, span: 16 },
        };
        return <React.Fragment>{checkInterface ? (<Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
        >
            <Form.Item
                label="手机号码："
                name="username"
                rules={[{ required: true, message: '请输入你的手机号码！' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码："
                name="password"
                rules={[{ required: true, message: '请输入你的密码！' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item {...tailLayout}>
                <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: "100%" }}
                    loading={iconLoading}
                >
                    登录
                </Button>
            </Form.Item>
            <Form.Item  {...tailLayout} style={{ textAlign: "right" }}>
                <Button type="link" onClick={() => this.setState({ checkInterface: false })}>注册</Button>
            </Form.Item>
        </Form>) : this.registerInterface()}</React.Fragment>

    };
    handleChange = ({ target: { value } }) => {
        this.setState({ value })
    };
    render() {
        let { value, visible, checkInterface,userInfo,isLoginStatus } = this.state;
        let { userId, nickname, picture,phone } = userInfo
        return <HomeContext.Provider value={{handleLogin:this.fetch}}>
            <div className="Home">
                <Layout>
                    <Header>
                        <div className="left-header"><img src={require("../images/logo.jpeg")} alt="此图片无法显示" /></div>
                        <div className="center-header">
                            <Radio.Group defaultValue={value} onChange={this.handleChange}>
                                <Radio.Button value="a">首页</Radio.Button>
                                <Radio.Button value="d">我的</Radio.Button>
                            </Radio.Group>
                        </div>
                        <div className="right-header">
                            <Button type="link" onClick={() => this.setState({ visible: true })}>{nickname || '登录'}</Button>
                            {picture ? <Avatar src={picture} /> : <Avatar icon={<UserOutlined />} />}
                        </div>
                    </Header>
                    <Content>
                        {value == "a" ? <Index isLoginStatus={isLoginStatus} userId={userId} userInfo={userInfo} /> : <Mine userId={userId} userInfo={userInfo} />}
                    </Content>
                </Layout>
                <Modal
                    title={checkInterface ? "登录" : "注册"}
                    visible={visible}
                    footer={null}
                    maskClosable={false}
                    onCancel={() => { this.setState({ visible: false }) }}
                >
                    {this.Demo()}
                </Modal>
            </div>
        </HomeContext.Provider>
    }
}

export default Home