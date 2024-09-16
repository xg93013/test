import React, { Component } from 'react'

export default class Formdata extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: '132'
        }
    }
    uploadfile() {
        var btn = document.querySelector('[type=button]');
        btn.onclick = function () {
            // 文件元素
            var file = document.querySelector('[type=file]');
            // 通过FormData将文件转成二进制数据
            var formData = new FormData();
            // 将文件转二进制
            formData.append('upload', file.files[0]);
            var xhr = new XMLHttpRequest;
            xhr.open('post', 'file.php');
            // 监听上传进度
            xhr.upload.onprogress = function (ev) {
                // 事件对象
                // console.log(ev);

                var percent = (ev.loaded / ev.total) * 100 + '%';

                console.log(percent);

                progress.style.width = percent;
            }

            xhr.send(formData);

            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    //
                }
            }
        }

    }
    render() {
        return (
            <div className="formdata">
                <form action="">
                    <label for="">
                        姓名: <input type="text" name="name" />
                    </label>
                    <label for="">
                        文件：<input id="file" type="file" name="file" />
                    </label>
                    <label for="">
                        <input type="button" value="保存" />
                    </label>
                </form>
            </div>
        );
        // return (
        //     <div className="formdata">
        //         <form action="">
        //             <label for="">
        //                 姓名：<input type="text" name="name" />
        //             </label>
        //         </form>
        //     </div>
        // );
    }
}