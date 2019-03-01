import React from "react";
import styles from "./Demonstration.scss";

import { links } from '@/unit/pub.js';

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            systemModel: [
                {
                    key: 'scjg',
                    label: "市场监管",
                    suffix: "大数据",
                    videoSrc: "http://172.27.17.22/video/最新logo食药监视频-12月.mp4",
                    links: [{
                        key: "cjwt",
                        name: "抽检问题分析系统",
                        links: "http://www.baidu.com",
                        icon: "",
                        linkKey: 'cj'
                    }, {
                        key: "spaq",
                        name: "食品安全关联图谱",
                        links: "#",
                        icon: "",
                        linkKey: 'gltp'
                    }, {
                        key: "fzwlyq",
                        name: "复杂网络舆情",
                        links: "#",
                        icon: "",
                        linkKey: 'wlyq'
                    }]
                },
                {
                    key: 'yg',
                    label: "遥感",
                    suffix: "大数据",
                    videoSrc: "http://172.27.17.22/video/遥感大数据视频正片-12月.mp4",
                    links: [{
                        key: "sp",
                        name: "视频",
                        links: "#",
                        icon: "sp",
                        linkKey: '',
                        videoSrc: 'http://172.27.17.22/video/遥感大数据视频正片-12月.mp4'
                    }, {
                        key: "hhzl",
                        name: "河湖治理",
                        links: "#",
                        icon: "",
                        linkKey: 'hhzl'
                    }, {
                        key: "cdzlzx",
                        name: "成都治理中心",
                        links: "#",
                        icon: "",
                        linkKey: ''
                    }]
                },
                {
                    key: 'zw',
                    label: "政务基础",
                    suffix: "大数据",
                    videoSrc: "http://172.27.17.22/video/数据处理视频片段.mp4",
                    links: [{
                        key: "hzjd",
                        name: "合作街道",
                        links: "#",
                        icon: "",
                        linkKey: 'hzjd'
                    }, {
                        key: "rcept",
                        name: "蓉创e平台",
                        links: "#",
                        icon: "",
                        linkKey: 'rce'
                    }, {
                        key: "ztbsj",
                        name: "招投标审计平台",
                        links: "#",
                        icon: "",
                        linkKey: ''
                    }]
                }
            ],
            videoModel: {
                src: '',
                show: false
            }
        };
    }
    linkAction = (item, e) => {
        if (item.linkKey && links[item.linkKey]) {
            window.open(links[item.linkKey], '', 'fullscreen=no');
        } else {
            if (item.videoSrc) {
                let { videoModel } = this.state;
                videoModel.show = true;
                videoModel.src = item.videoSrc;
                let video = this.refs.video;
                this.setState({ videoModel });
                setTimeout(() => {
                    video.play();
                }, 0);
            }
        }
    }
    closeVideo = () => {
        let { videoModel } = this.state;
        videoModel.show = false;
        let video = this.refs.video;
        video.currentTime = 0;
        video.pause();
        console.log(this.refs)
        this.setState({ videoModel });
    }
    render() {
        let { systemModel } = this.state;
        return (
            <div className={styles['system-area']}>
                <div className={`${styles["video-area"]}`}
                    style={{ display: this.state.videoModel.show ? 'block' : 'none' }}
                >
                    <div
                        className={styles["close-btn"]}
                        onClick={this.closeVideo}></div>
                    <video
                        src={this.state.videoModel.src}
                        controls="controls"
                        className={styles["video-box"]}
                        // autoPlay="autoplay"
                        ref="video"
                    // loop="loop"
                    ></video>
                </div>
                <div className={styles['system-links']}>
                    {
                        systemModel.map((item, index) => {
                            return (
                                <div className={styles['system-link']} key={item.key}>
                                    <div className={styles['link-item']} onClick={(e) => this.linkAction(item, e)}>
                                        <div className={styles['link-text']}>
                                            <div className={styles['texts']}>
                                                {item.label + item.suffix}<span className={styles['lines']}></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles['link-short']}>
                                        <div className={styles['short-item']} onClick={(e) => this.linkAction(item.links[0], e)}>
                                            <div className={styles['texts']}>
                                                <div className={styles['sp-box']} style={{ display: item.links[0].icon === 'sp' ? 'block' : 'none' }}>
                                                    <img src={require('./images/video-icon.png')} alt="" />
                                                    <span className={styles['lines']}></span>
                                                    <p>[{item.links[0].name}]</p>
                                                </div>
                                                <div style={{ display: item.links[0].icon !== 'sp' ? 'block' : 'none' }}>{item.links[0].name}<span className={styles['lines']} ></span></div>
                                            </div>
                                        </div>
                                        <div className={styles['short-item']} onClick={(e) => this.linkAction(item.links[1], e)}>
                                            <div className={styles['texts']}>
                                                {item.links[1].name}<span className={styles['lines']}></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles['link-long']} onClick={(e) => this.linkAction(item.links[2], e)}>
                                        <div className={styles['texts']}>
                                            {item.links[2].name}<span className={styles['lines']}></span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }


                </div>
            </div>
        )
    }

}

export default Index
