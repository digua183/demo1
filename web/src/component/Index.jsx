import React from 'react'
import {
    Radio,
    Button,
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Upload,
    Divider,
    AutoComplete,
    message,
    Tag,
    Empty,
    Checkbox,
    Popconfirm
} from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './Index.less'
import { ReleaseModal } from './ReleaseModal'
import moment from 'moment';
import axios from 'axios';

// const { Option } = Select;
// let index = 0;

// function getBase64(file) {
//     return new Promise((resolve, reject) => {
//         const reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = () => resolve(reader.result);
//         reader.onerror = error => reject(error);
//     });
// }

function IndexItem({ data: { time, picture, nickname, urgent, releaseType, otherRemarks, img }, ...props }) {
    return <div className="item"  {...props}>
        <div className="release-time">{time ? moment(Number(time)).format("YYYY-MM-DD hh:mm") : null}</div>
        <div className="avatar">
            <img src={picture ? picture : null} alt="此图片无法显示" />
            <p className="username">{nickname || '-'}</p>
        </div>
        <div className="detail">
            <div className="theme">
                {urgent ? <Tag color="#f50">紧急</Tag> : null}
                {releaseType == "1" ? <Tag color="#2db7f5">失物招领</Tag> : <Tag color="#2db7f5">拾物招领</Tag>}
            </div>
            <div className="content">
                <p>{otherRemarks || '-'}</p>
            </div>
            <div className="images">
                {img ? img.map(item => <img key={item.name} src={item.url} alt="此图片无法显示" />) : null}
            </div>
        </div>
        {true || true ? <div className="operation-data">
            <EditOutlined />
            <Popconfirm
                title="您确定要删除它吗?"
                // onConfirm={confirm}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
            >
                <DeleteOutlined />
            </Popconfirm>
        </div> : null}
    </div>
}

class Index extends React.Component {
    constructor() {
        super()
        this.formRef = React.createRef();
        this.state = {
            visible: false,
            confirmLoading: false,
            releaseType: "失物",
            previewVisible: false,
            previewImage: '',
            name: "",
            checkedType: "",
            releaseData: {},
            fileList: [],
            data: []
        }
    }
    componentDidMount() {
        this.fetch()
    }
    fetch = () => {
        // let res = [{
        //     time: 1588140460169,
        //     picture: "/static/media/avatar_01.9bf849f7.jpg",
        //     nickname: "冷漠无情失智君",
        //     urgent: true,
        //     releaseType: 1,
        //     otherRemarks: "本人不慎在三区操场遗失了身份证，请捡到了小可爱联系我一下",
        //     img: [
        //         "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1141259048,554497535&fm=26&gp=0.jpg"
        //     ]
        // }]
        // this.setState({ data: res || [] })
        axios({
            method: 'get',
            headers: { 'Content-type': 'application/json' },
            url: 'http://localhost:3000/all/getReleaseData',
        }).then((res) => {
            console.log(res)
            this.setState({ data: res.data || [] })
        }).catch(() => {
            message.info("服务器错误！")
        })
    }
    // handleOk = () => {
    //     this.setState({ confirmLoading: true }, this.submitReleaseData)
    // }
    // submitReleaseData = () => {
    // axios({
    //     method: 'post',
    //     headers: { 'Content-type': 'application/json' },
    //     url: 'http://localhost:3000/all/upload',
    //     data: releaseData
    // }).then((res) => {
    //     if (res.data == "success") {
    //         message.success("发布成功！")
    //         this.setState({
    //             visible: false,
    //             confirmLoading: false
    //         }, this.fetch)
    //     } else {
    //         message.error("发布失败！")
    //     }

    // }).catch(function (err) {
    //     message.info("服务器错误！")
    // })

    // }

    //关闭预览界面
    // handleCancel = () => this.setState({ previewVisible: false });

    //处理图片预览
    // handlePreview = async file => {
    //     if (!file.url && !file.preview) {
    //         file.preview = await getBase64(file.originFileObj);
    //     }
    //     this.setState({
    //         previewImage: file.url || file.preview,
    //         previewVisible: true,
    //     });
    // };

    // handlePicChange = ({ fileList }) => this.setState({ fileList })
    // handleTypeChange = ({ target: { value } }) => {
    //     this.setState({ releaseType: value })
    // }
    // addItem = () => {
    //     const { items, name } = this.state;
    //     this.setState({
    //         items: [...items, name || `New item ${index++}`],
    //         name: '',
    //     });
    // };
    // onNameChange = ({ target: { value } }) => this.setState({ name: value });
    // onFormLayoutChange = (_, b) => {
    //     console.log(b)
    //     var times = Date(moment());
    //     if (b.time) {
    //         console.log(b.time)
    //         times = Date.parse(b.time)
    //         b = Object.assign({}, b, { time: times })
    //     } 
    //     this.state.releaseData = Object.assign({}, this.state.releaseData, b)
    // }
    // onCheckChange = ({ target: { checked } }) => this.setState({ urgent: checked })
    // releaseContent = () => {
    //     let { releaseType, urgent, dataSource, previewVisible, previewImage, fileList, items, name } = this.state;
    //     const uploadButton = (
    //         <div>
    //             <PlusOutlined />
    //             <div className="ant-upload-text">Upload</div>
    //         </div>
    //     );
    //     const children = dataSource.map((it) => (
    //         <Option key={it} value={it}>
    //             {it}
    //         </Option>
    //     ));
    //     return <div className="content">
    //         <Radio.Group defaultValue='失物' style={{ marginBottom: 30 }} onChange={this.handleTypeChange}>
    //             <Radio value="失物">失物招领</Radio>
    //             <Radio value="拾物">拾物招领</Radio>
    //         </Radio.Group>
    //         <div>
    //             <Form
    //                 ref={this.formRef}
    //                 labelCol={{ span: 4 }}
    //                 wrapperCol={{ span: 14 }}
    //                 layout="horizontal"
    //                 initialValues={{ place: "三区操场", time: moment(), otherRemarks: `本人于${moment().format("MM月DD日hh点mm分")}在三区操场捡到某物若干，请失主联系我，联系电话：xxxxxxx` }}
    //                 onValuesChange={this.onFormLayoutChange}
    //             >
    //                 <Form.Item label="物品类型：" name="type">
    //                     <Select
    //                         style={{ width: 160 }}
    //                         placeholder="请选择类型"
    //                         dropdownRender={menu => (
    //                             <div>
    //                                 {menu}
    //                                 <Divider style={{ margin: '4px 0' }} />
    //                                 <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
    //                                     <Input style={{ flex: 'auto' }} value={name} onChange={this.onNameChange} />
    //                                     <a
    //                                         style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
    //                                         onClick={this.addItem}
    //                                     >
    //                                         <PlusOutlined /> 添加
    //                                     </a>
    //                                 </div>
    //                             </div>
    //                         )}
    //                     >
    //                         {items.map(item => (
    //                             <Option key={item}>{item}</Option>
    //                         ))}
    //                     </Select>
    //                 </Form.Item>
    //                 <Form.Item label="紧急程度" name="urgent">
    //                     <Checkbox onChange={this.onCheckChange} checked={urgent}>紧急</Checkbox>
    //                 </Form.Item>
    //                 <Form.Item label={releaseType + "地点："} name="place">
    //                     <AutoComplete style={{ width: 200 }} placeholder={`请选择${releaseType}地点`}>
    //                         {children}
    //                     </AutoComplete>
    //                 </Form.Item>
    //                 <Form.Item label={releaseType + "时间："} name="time">
    //                     <DatePicker showTime placeholder="请选择时间" />
    //                 </Form.Item>
    //                 <Form.Item label="正文：" name="otherRemarks">
    //                     <Input.TextArea
    //                         autoSize={{ minRows: 4, maxRows: 6 }}
    //                     />
    //                 </Form.Item>
    //                 <div className="Tips" >
    //                 {releaseType == "拾物" ? "如果物品中内容较多，可简要列出物品的内容名称，以便失主核对是否为本人丢失，注意证件和饭卡的号码、人民币的数目均不能详写，以防他人冒领" :
    //                         "尽量写清楚失物地点,时间，物品名称，数量等"
    //                     }
    //                 </div>
    //                 <Form.Item label="上传图片" name="uploadPicture">
    //                     <div className="clearfix">
    //                         <Upload
    //                             action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
    //                             listType="picture-card"
    //                             fileList={fileList}
    //                             onPreview={this.handlePreview}
    //                             onChange={this.handlePicChange}
    //                         >
    //                             {fileList.length >= 8 ? null : uploadButton}
    //                         </Upload>
    //                     </div>
    //                 </Form.Item>
    //                 {releaseType == "拾物" ? <Button type="link" style={{ marginLeft: 148 }}>注意：若图片上包含敏感信息请打码之后上传！！！</Button> : null}
    //             </Form>
    //         </div>
    //         <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
    //             <img alt="example" style={{ width: '100%' }} src={previewImage} alt="此图片无法显示" />
    //         </Modal>
    //     </div>
    // }
    render() {
        let { visible, confirmLoading, data } = this.state;
        console.log(data, 'data')
        return <div className="index">
            <div className="pick-up-item">
                <div className="radio-switch">
                    <Button type="primary" style={{ marginRight: 20 }} onClick={() => { this.setState({ visible: true }) }}>发布招领</Button>
                    <Radio.Group defaultValue="a" buttonStyle="solid">
                        <Radio.Button value="a">拾物招领</Radio.Button>
                        <Radio.Button value="b">失物招领</Radio.Button>
                    </Radio.Group></div>
                {data.length > 0 ? data.map((it, idx) => {
                    return <IndexItem data={it} key={idx} />
                }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </div>
            <div className="right-part">

            </div>
            {visible ? <ReleaseModal visible={visible} data={{}} /> : null}
            {/* <Modal
                title="发布招领"
                wrapClassName="home-release"
                visible={visible}
                onOk={this.handleOk}
                confirmLoading={confirmLoading}
                onCancel={() => this.setState({ visible: false })}
                okText="确定"
                maskClosable={false}
                cancelText="取消"
                width={950}
                centered={true}
            >
                {this.releaseContent()}
            </Modal> */}
        </div>
    }
}

export { Index, IndexItem } 