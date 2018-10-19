<template>
	<Modal id='warnDetails' width="800" v-model="modal" title="高危检验项目明细">
		<div style="width:100%;max-height:500px;overflow-y:auto">
			<div style='position:relative;width:100%;overflow:hidden'>
				<Spin v-show='show' fix>
					<Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
					<div>加载中...</div>
				</Spin>
			</div>
			<div class="modal-box">
				<Row>
					<Col :span="3"> 抽样时间
					</Col>
					<Col :span="20"> {{dataList.cydRq}}
					</Col>
				</Row>
				<Row>
					<Col :span="3"> 食品名称
					</Col>
					<Col :span="7"> {{dataList.ypMc}}
					</Col>
					<Col :span="3"> 生产批号/日期
					</Col>
					<Col :span="4"> {{dataList.ph}}
					</Col>
				</Row>
				<Row>
					<Col :span="3"> 被抽样单位
					</Col>
					<Col :span="7"> {{dataList.qyMc}}
					</Col>
					<Col :span="2"> 所属区域
					</Col>
					<Col :span="6"> 
						{{dataList.qyQy}}
					</Col>
					<Col :span="2" style="padding-left:10px"> 地址
					</Col>
					<Col :span="4"> {{dataList.qyDz}}
					</Col>
				</Row>
				<Row>
					<Col :span="3"> 标称生产企业
					</Col>
					<Col :span="7"> {{dataList.sczMc}}
					</Col>
					<Col :span="2"> 所属区域
					</Col>
					<Col :span="6"> {{dataList.sczQy}}
					</Col>
					<Col :span="2" style="padding-left:10px"> 地址
					</Col>
					<Col :span="4"> {{dataList.sczDz}}
					</Col>
				</Row>
				<Row>
					<Col :span="3"> 委托单位
					</Col>
					<Col :span="21"> {{dataList.wtdw}}
					</Col>
				</Row>
			</div>
			<div class="modal-box" style="border:none">
				<Row>
					<Col :span="3"> 报告单编号
					</Col>
					<Col :span="7"> {{dataList.cydBh}}
					</Col>
					</Col>
				</Row>
				<Row>
					<Col :span="3"> 不合格项目
					</Col>
					<Col :span="7"> {{dataList.jyXm}}
					</Col>
					<Col :span="3"> 检测值||标准值
					</Col>
					<Col :span="4"> {{dataList.jcz}}||{{dataList.bzz}}
					</Col>
				</Row>
				<Row>
					<Col :span="3"> 检测结果
					</Col>
					<Col :span="7"> {{dataList.jyJg}}
					</Col>
					<Col :span="3"> 签发日期
					</Col>
					<Col :span="4"> {{dataList.jyBgrq}}
					</Col>
				</Row>
			</div>
		</div>
	</Modal>
</template>

<script>
	import http from '../../unit/http'
	import apis from '../../unit/apis'
	let {I_HIGHRISK} =apis 
	export default {
		data() {
			return {
				show: false,
				modal: false,
				dataList: {}
			}
		},

		methods: {
			modalShow(e) {
				this.modal = true;
				this.getModalMsg(e);
			},
			async getModalMsg(e) {
				this.show = true;
				let res = await http.get(I_HIGHRISK+"/"+e.ypMc+"/"+e.jyXm);
				if(res){
					this.dataList = res.data;
				}
				this.show = false;
			}
		}
	}
</script>

<style lang='scss'>
	#warnDetails {
		.modal-box {
			padding: 16px 20px;
			border-bottom: 2px solid #131A36;
		}
		.ivu-col {
			line-height: 26px;
		}
	}
</style>