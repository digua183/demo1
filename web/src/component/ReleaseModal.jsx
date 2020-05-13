import React, { useState, useContext } from 'react'
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
    Checkbox,
    message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment'
import axios from 'axios'

const { Option } = Select;


export const ReleaseModal = ({ visible = false,againRelease=false, displayVisible, confirmLoading = false, submitRelease, data = {}, ...props }) => {
    const [releaseType, setReleaseType] = useState((data.releaseType && data.releaseType == 2) ? "拾物" : "失物" || '失物')
    const [urgent, setUrgent] = useState(data.urgent || false)
    const [dataSource, setdataSource] = useState([])
    const [items, setItems] = useState(['手机', '衣物', '钱包'])
    const [fileList, setFileList] = useState(data.img&&data.img.map(it=>{
        return {name:it.name,status:it.status,uid:it.uid,url:it.url}
    })  ||[])
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [name, setName] = useState('')
    const [releaseData, setReleaseData] = useState({})
    const formRef = useContext({})

    let index = 0;
    


    let onFormLayoutChange = (_, b) => {
        console.log(b)
        var times = Date(moment());
        if (b.time) {
            times = Date.parse(b.time)
            b = Object.assign({}, b, { time: times })
        }
        setReleaseData({
            ...releaseData,
            ...b
        })
    }

    //处理图片预览
    let handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
    };

    let getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    let handleOk = () => {
        releaseData.releaseType = releaseType
        releaseData.urgent = urgent
        releaseData.fileList = fileList
        submitRelease && submitRelease(releaseData)
    }
    let releaseContent = () => {
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const children = dataSource.map((it) => (
            <Option key={it} value={it}>
                {it}
            </Option>
        ));
        return <div className="content">
            <Radio.Group defaultValue={releaseType} style={{ marginBottom: 30 }} onChange={({ target: { value } }) => {
                setReleaseType(value)
            }}>
                <Radio value="失物">失物招领</Radio>
                <Radio value="拾物">拾物招领</Radio>
            </Radio.Group>
            <div>
                <Form
                    ref={formRef}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    initialValues={data.userId ?
                        {type:data.type,fileList: data.img, place: data.place, time: moment(Number(data.time)), otherRemarks: data.otherRemarks, contactMethod: data.contactMethod } :
                        { fileList: [], place: "三区操场", time: moment(), otherRemarks: `本人于${moment().format("MM月DD日hh点mm分")}在三区操场捡到某物若干，请失主联系我，联系电话：xxxxxxx` }}
                    onValuesChange={onFormLayoutChange}
                >
                    <Form.Item label="物品类型：" name="type">
                        <Select
                            style={{ width: 160 }}
                            placeholder="请选择类型"
                            dropdownRender={menu => (
                                <div>
                                    {menu}
                                    <Divider style={{ margin: '4px 0' }} />
                                    <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                        <Input style={{ flex: 'auto' }} value={name} onChange={({ target: { value } }) => {
                                            setName(value)
                                        }} />
                                        <a
                                            style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                            onClick={() => {
                                                setName('')
                                                setItems([...[...items, name || `New item ${index++}`]])
                                            }}
                                        >
                                            <PlusOutlined /> 添加
                                        </a>
                                    </div>
                                </div>
                            )}
                        >
                            {items.map(item => (
                                <Option key={item}>{item}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="紧急程度：" name="urgent">
                        <Checkbox onChange={({ target: { checked } }) => {
                            setUrgent(checked)
                        }} checked={urgent}>紧急</Checkbox>
                    </Form.Item>
                    <Form.Item label="联系电话/微信/QQ：" name="contactMethod">
                        <Input style={{ width: 200 }} />
                    </Form.Item>
                    <Form.Item label={releaseType + "地点："} name="place">
                        <AutoComplete style={{ width: 200 }} placeholder={`请选择${releaseType}地点`}>
                            {children}
                        </AutoComplete>
                    </Form.Item>
                    <Form.Item label={releaseType + "时间："} name="time">
                        <DatePicker showTime placeholder="请选择时间" />
                    </Form.Item>
                    <Form.Item label="正文：" name="otherRemarks">
                        <Input.TextArea
                            autoSize={{ minRows: 4, maxRows: 6 }}
                        />
                    </Form.Item>
                    <div className="Tips" >
                        {releaseType == "拾物" ? "如果物品中内容较多，可简要列出物品的内容名称，以便失主核对是否为本人丢失，注意证件和饭卡的号码、人民币的数目均不能详写，以防他人冒领" :
                            "尽量写清楚失物地点,时间，物品名称，数量等"
                        }
                    </div>
                    <Form.Item label="上传图片" name="uploadPicture">
                        <div className="clearfix">
                            <Upload
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture-card"
                                fileList={fileList}
                                onPreview={handlePreview}
                                onChange={(({ fileList }) => setFileList([...fileList]))}
                            >
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                        </div>
                    </Form.Item>
                    {releaseType == "拾物" ? <Button type="link" style={{ marginLeft: 148 }}>注意：若图片上包含敏感信息请打码之后上传！！！</Button> : null}
                </Form>
            </div>
            <Modal visible={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} alt="此图片无法显示" />
            </Modal>
        </div >
    }
    return <Modal
        title="发布招领"
        wrapClassName="home-release"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => displayVisible && displayVisible()}
        okText={againRelease?"重新发布":"确定"}
        maskClosable={false}
        cancelText="取消"
        width={950}
        centered={true}
    >
        {releaseContent()}
    </Modal>
}