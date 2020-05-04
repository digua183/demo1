import React from 'react'
import { Layout, Button, Avatar, Radio, Modal, Form, Input, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Index } from './Index'
import Mine from './Mine'
import './Home.less'
import axios from 'axios'

const { Header, Footer, Content } = Layout;

class Home extends React.Component {
    constructor() {
        super()
        this.state = {
            value: "b",
            visible: false,
            iconLoading: false,
            data: '',
            checkInterface: true
        }
    }
    onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    onFinish = values => {
        this.setState({ iconLoading: true })
        axios({
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            url: 'http://localhost:3000/all/login',
            data: values
        }).then(({ data }) => {
            if (data.status == "success") {
                let storage = window.localStorage;
                storage.setItem("userId", data.data.userId)
                storage.setItem("nickname", data.data.nickname)
                storage.setItem("pic", data.data.pic)
                message.success("登录成功！")
                this.setState({ visible: false, iconLoading: false, data: data.data || '' })
            } else {
                message.error("用户不存在或者密码错误！")
                this.setState({ iconLoading: false })
            }
        })
            .catch(function (error) {
                message.info("服务器错误！")
            });

    };
    registerInterface = () => {
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
        initialValues={{ remember: true }}
        onFinish={this.onFinish}
        onFinishFailed={this.onFinishFailed}
    >
        <Form.Item
            label="用 户 名："
            name="username"
            rules={[{ required: true, message: '请输入用户名！' }]}
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
            label="手    机："
            name="surePassword"
            rules={[{ required: true, message: '请输入你的密码！' }]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label="邮    箱："
            name="surePassword"
            rules={[{ required: true, message: '请输入你的密码！' }]}
        >
            <Input />
        </Form.Item>
        <Form.Item
            label="验 证 码："
            name="surePassword"
            rules={[{ required: true, message: '请输入你的密码！' }]}
        >
            <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
            <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                // loading={iconLoading}
            >
                立即注册
            </Button>
        </Form.Item>
        <Form.Item  {...tailLayout} style={{ textAlign: "right" }}>
            <Button type="link" onClick={()=>this.setState({checkInterface:true})}>登录</Button>
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
                label="用户名："
                name="username"
                rules={[{ required: true, message: '请输入你的用户名！' }]}
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
                <Button type="link" onClick={()=>this.setState({checkInterface:false})}>注册</Button>
            </Form.Item>
        </Form>) : this.registerInterface()}</React.Fragment>

    };
    handleChange = ({ target: { value } }) => {
        console.log('click ', value);
        this.setState({ value })
    };
    render() {
        let storages = window.localStorage
        const userId = storages.getItem("userId") || ""
        const nickname = storages.getItem("nickname") || ""
        const pic = storages.getItem("pic") || ""
        let { value, visible,checkInterface } = this.state;
        return <div className="Home">
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
                        {pic ? <Avatar src={pic} /> : <Avatar icon={<UserOutlined />} />}
                    </div>
                </Header>
                <Content>
                    {value == "a" ? <Index userId={userId} /> : <Mine userId={userId} />}
                </Content>
                <Footer>拾物拾物招领系统</Footer>
            </Layout>
            <Modal
                title={checkInterface?"登录":"注册"}
                visible={visible}
                footer={null}
                maskClosable={false}
                onCancel={() => { this.setState({ visible: false }) }}
            >
                {this.Demo()}
            </Modal>
        </div>
    }
}

export default Home