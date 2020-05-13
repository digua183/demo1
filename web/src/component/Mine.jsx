import React from 'react'
import { IndexItem } from './Index'
import { Menu, Upload, message, Button, Form, Radio, Input, Empty, Avatar } from 'antd'
import axios from 'axios'
import { UserOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { HomeContext } from './HomeContext'
import './Mine.less'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class MyRelease extends React.Component {
  constructor() {
    super()
    this.state = {
      data: []
    }
  }
  componentDidMount() {
    this.fetch()
  }
  fetch = () => {
    let { userId } = this.props;
    axios({
      method: 'get',
      headers: { 'Content-type': 'application/json' },
      url: 'http://localhost:3000/get/getPersonalReleaseInfo',
      params: { userId }
    }).then(res => {
      this.setState({ data: res.data || {} })
    })
  }
  render() {
    let { data } = this.state;
    console.log(data)
    return <div style={{ width: "100%" }}>
      {data.length > 0 ? data.map((it, idx) => <IndexItem data={it} key={idx} fetch={this.fetch} isPersonal={true} />) :
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </div>
  }
}
class AlterPersonalInfo extends React.Component {
  static contextType = HomeContext;
  constructor(props) {
    super(props)
    let { jurisdiction, nickname, password, picture, userId, sex, remarks } = props.userInfo || {}
    this.state = {
      nickname,
      picture,
      userId,
      sex,
      remarks,
      loading: false,
      password
    }
  }

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          picture: imageUrl,
          loading: false,
        }),
      );
    }
  }
  fetch = () => {
    let { userId } = this.state;
    axios({
      method: 'get',
      headers: { 'Content-type': 'application/json' },
      url: 'http://localhost:3000/all/getPersonalInfo',
      params: { userId }
    }).then(({ data }) => {
      console.log(data)
      let storage = window.localStorage;
      storage.setItem("personalInfo", JSON.stringify(data))
    }).catch(function (error) {
      message.info("服务器错误！")
    });
  }
  onFinish = fieldsValue => {
    let { picture, userId, password } = this.state;
    fieldsValue = Object.assign({}, fieldsValue, { picture })
    axios({
      method: 'post',
      headers: { 'Content-type': 'application/json' },
      url: 'http://localhost:3000/get/alterPersonalInfo',
      data: fieldsValue
    }).then(res => {
      this.fetch()
      this.context && this.context.handleLogin()
      message.success("修改成功！")
    })
  }
  render() {
    let { loading, userId, nickname, picture, remarks, sex } = this.state;
    const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    }


    return <div className="alter-personal-info">
      <Form name="time_related_controls"
        {...formItemLayout}
        onFinish={this.onFinish}
        initialValues={{ userId, nickname, sex: sex || 'male', remarks, picture }}
      >
        <Form.Item name="picture" style={{ marginLeft: 80 }}>
          <div className="head">
            <div className="avatar">
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={this.handleChange}
              >
                {picture ? <img src={picture} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
              </Upload>
            </div>
            <div>
              <Button type="link">点击修改</Button>
              <div>可上传jpg，jpeg，png类型文件，2M以内</div>
            </div>
          </div>
        </Form.Item>
        <Form.Item label="姓名：" name="nickname">
          <Input />
        </Form.Item>
        <Form.Item label="性别：" name="sex">
          <Radio.Group>
            <Radio value={'male'}>男</Radio>
            <Radio value={'female'}>女</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="联系方式：" name="userId">
          <Input />
        </Form.Item>
        <Form.Item label="备注：" name="remarks">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div >
  }
}
class Mine extends React.Component {

  constructor() {
    super()
    this.state = {
      openKeys: 'b'
    }
  }
  handleClick = ({ key }) => {
    this.setState({ openKeys: key });
  }
  render() {
    let { openKeys } = this.state;
    let { userId, userInfo } = this.props;
    let { picture, nickname, jurisdiction } = userInfo
    return <div className="mine">
      <div className="personal-info">
        <div style={{ borderRight: "1px solid #f9f9f9" }}>
          <div className="info">
            {picture ? <img src={picture} alt="" /> : <Avatar icon={<UserOutlined />} />}
            <div style={{ marginLeft: 16 }}>
              <p>{nickname || ""}</p>
              <span>{jurisdiction == 1 ? "管理员" : "普通用户"}</span>
            </div>
          </div>
          <Menu openKeys={openKeys} style={{ width: 240 }} defaultSelectedKeys="a" onClick={this.handleClick}>
            <Menu.Item key="a"><span className={openKeys == "a" ? "click-style" : ""}>我发布的</span></Menu.Item>
            <Menu.Item key="b"><span className={openKeys == "b" ? "click-style" : ""}>修改个人信息</span></Menu.Item>
          </Menu>
        </div>
        {openKeys == "a" ? <MyRelease userId={userId} /> : openKeys == "b" ? <AlterPersonalInfo userId={userId} userInfo={userInfo || {}} /> : null}
      </div>
    </div>
  }
}

export default Mine