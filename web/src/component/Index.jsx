import React, { useState } from 'react'
import {
    Button,
    message,
    Tag,
    Empty,
    Popconfirm,
    DatePicker,
    Input
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import './Index.less'
import { ReleaseModal } from './ReleaseModal'
import moment from 'moment';
import axios from 'axios';

const RELEASETYPE = { "失物招领": 1, "拾物招领": 2, "全部": 3 }


function IndexItem({ data, fetch, userInfo, isPersonal = false, ...props }) {
    let { userId, time, picture, nickname, urgent, releaseType, otherRemarks, img } = data;
    let { jurisdiction } = userInfo
    let isAdmin = jurisdiction == 1
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
            params: { userId, time: Date.parse(moment()) }
        }).then(res => {
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
        {isAdmin || isPersonal ? <div className="operation-data">
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
        {visible ? <ReleaseModal data={data} visible={visible} againRelease={true} displayVisible={displayVisible} /> : null}
    </div>
}

const FilterButton = ({ selectType, changeType, ...props }) => {
    const changeSelect = (it) => {
        changeType && changeType(it)
    }
    return <div className="select">
        {['全部', '失物招领', '拾物招领'].map(it => <Button onClick={() => changeSelect(it)} className={it == selectType ? 'select-type' : ""} size="small" key={it}>{it}</Button>)}
    </div>
}

class Index extends React.Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            confirmLoading: false,
            releaseType: "失物",
            data: [],
            selectType: '全部',
            time: '',
            place: ''
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
            data = data.sort((a, b) => {
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
    changeType = (it) => {
        this.setState({ selectType: it }, this.handleFilter)
    }
    handleFilter = () => {
        let { selectType, time, place, data } = this.state;
        console.log(selectType, time, place, data)
        data = data.filter(it => {
            if (selectType == "全部") {
                return it
            } else if (it.releaseType == RELEASETYPE[selectType]) {
                return it
            }
        })
        this.setState({ data })
    }
    render() {
        let { visible, confirmLoading, data, selectType } = this.state;
        let { userInfo } = this.props;
        return <div className="index">
            <div className="pick-up-item">
                {data.length > 0 ? data.map((it, idx) => {
                    return <IndexItem userInfo={userInfo} data={it} key={idx} fetch={this.fetch} isPersonal={false} />
                }) : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            </div>
            <div className="right-part">
                <div className="radio-switch">
                    <div className="line">发布：</div>
                    <Button size="small" type="primary" style={{ marginRight: 20 }} onClick={() => { this.setState({ visible: true }) }}>发布招领</Button>
                </div>
                <div className="radio-switch">
                    <div className="line">筛选：</div>
                    <FilterButton selectType={selectType} changeType={this.changeType} />
                    <DatePicker placeholder="请选择筛选日期" showTime onOk={(value) => this.setState({ time: value }, this.handleFilter)} />
                    <Input placeholder="请填写筛选地点" onChange={({ target: { value } }) => this.setState({ place: value })} onPressEnter={this.handleFilter} />
                    <div>
                        <Button onClick={this.handleFilter} type="primary" size="small" style={{ marginTop: 10, width: 100 }}>搜索</Button>
                    </div>
                </div>
            </div>
            {visible ? <ReleaseModal visible={visible} data={{}} confirmLoading={confirmLoading} displayVisible={this.displayVisible} submitRelease={this.submitRelease} /> : null}
        </div>
    }
}

export { Index, IndexItem } 