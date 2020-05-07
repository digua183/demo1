import React, { useState } from 'react'
import {
    Radio,
    Button,
    message,
    Tag,
    Empty,
    Popconfirm
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './Index.less'
import { ReleaseModal } from './ReleaseModal'
import moment from 'moment';
import axios from 'axios';


function IndexItem({ data, fetch, ...props }) {
    let { userId, time, picture, nickname, urgent, releaseType, otherRemarks, img } = data;
    const [visible, setVisible] = useState(false)
    let editReleaseContent = () => {
        setVisible(true)
    }
    let displayVisible = () => {
        setVisible(false)
    }
    let deleteData = () => {
        axios({
            method: 'get',
            headers: { 'Content-type': 'application/json' },
            url: 'http://localhost:3000/get/deleteData',
            params: { userId, time }
        }).then(res => {
            console.log(res)
            fetch && fetch()
        })
    }
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
            <EditOutlined onClick={editReleaseContent} />
            <Popconfirm
                title="您确定要删除它吗?"
                onConfirm={deleteData}
                okText="Yes"
                cancelText="No"
            >
                <DeleteOutlined />
            </Popconfirm>
        </div> : null}
        {visible ? <ReleaseModal data={data} visible={visible} againRelease={true} displayVisible={displayVisible}/> : null}
    </div>
}

class Index extends React.Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            confirmLoading: false,
            releaseType: "失物",
            data: []
        }
    }
    componentDidMount() {
        this.fetch()
    }
    fetch = () => {
        axios({
            method: 'get',
            headers: { 'Content-type': 'application/json' },
            url: 'http://localhost:3000/all/getReleaseData',
        }).then((res) => {
            let data = res.data || []
            data = data.sort((a,b)=>{
              return Number(b.time) - Number(a.time)
            })
            this.setState({ data: data || [] })
        }).catch(() => {
            message.info("服务器错误！")
        })
    }

    submitRelease = (data) => {
        let userId = this.props.userId
        data = Object.assign({}, data, { userId })
        console.log(data)
        axios({
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            url: 'http://localhost:3000/all/upload',
            data
        }).then((res) => {
            console.log(res)
            if (res.data == "success") {
                console.log('aaaaaaaaaaaa')
                message.success("发布成功！")
                this.setState({
                    visible: false,
                    confirmLoading: false
                }, this.fetch)
            } else {
                message.error("发布失败！")
            }

        }).catch(function (err) {
            message.info("服务器错误！")
        })
    }
    displayVisible = () => {
        this.setState({ visible: false })
    }
    render() {
        let { visible, confirmLoading, data } = this.state;
        console.log(data)
        return <div className="index">
            <div className="pick-up-item">
                <div className="radio-switch">
                    <Button type="primary" style={{ marginRight: 20 }} onClick={() => { this.setState({ visible: true }) }}>发布招领</Button>
                    <Radio.Group defaultValue="a" buttonStyle="solid">
                        <Radio.Button value="a">拾物招领</Radio.Button>
                        <Radio.Button value="b">失物招领</Radio.Button>
                    </Radio.Group></div>
                {data.length > 0 ? data.map((it, idx) => {
                    return <IndexItem data={it} key={idx} fetch={this.fetch} />
                }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </div>
            <div className="right-part">

            </div>
            {visible ? <ReleaseModal visible={visible} data={{}} confirmLoading={confirmLoading} displayVisible={this.displayVisible} submitRelease={this.submitRelease} /> : null}
        </div>
    }
}

export { Index, IndexItem } 