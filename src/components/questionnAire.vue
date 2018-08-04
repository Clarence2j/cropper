<template>
	<div id="task-correct">
		<navbrumb></navbrumb>
		<!--<costombrumb></costombrumb>-->
		<div id="task-correct-bd" class="por">
			<div id="main" class="por" style="height: 464px;">
				<div class="main-btn-group">
					<b-button variant="secondary" disabled class="btn-count1" size="sm">{{target+1}}/{{imgList.length}}<i class="icon"></i></b-button>
					<b-button class="btn-count2" variant="success" size="sm" :disabled="target===0" @click="turnImgTop">
						上一张<i class="icon"></i></b-button>
					<b-button class="btn-count2 mb20" variant="success" size="sm" :disabled="target===imgList.length-1" @click="turnImgNext">下一张
					</b-button>

				</div>
				<div class="next-step" @click="done">完成</div>
				<img src="" alt="" id="iimgggg" />
				<div style="float: left;width: 60px;background-color: rgba(0,0,0,.7);height: 100%;">
					<nav>
						<ul style="margin-left: -40px;">
							<li @click="checkText"><img :src="textImg" alt=""></li>
							<li @click="checkPen"><img :src="penImg" alt=""></li>
							<li @click="goBack"><img src="../../static/images/newTask/goBack.png" alt=""></li>
							<li @click="isShowModal"><img src="../../static/images/newTask/clear.png" alt=""></li>
							<li @click="rotate(90)"><img src="../../static/images/newTask/s.png" alt=""></li>
							<li @click="rotate(-90)"><img src="../../static/images/newTask/n.png" alt=""></li>
							<li @click="big"><img src="../../static/images/newTask/big.png" alt=""></li>
							<li @click="small"><img src="../../static/images/newTask/small.png" alt=""></li>
						</ul>
					</nav>
				</div>
				<div style="float:left;position: relative;overflow: hidden;width: 648px;height: 464px;border-top: 1px solid #EEEEEE;border-bottom: 1px solid #EEEEEE;border-right:1px solid #EEEEEE;position: relative;" id="canvasBlock">
					<canvas id="canvas" style="position: absolute;left: 0;top: 0;" width="648" height="464"></canvas>
					<canvas id="canvas1" style="position: absolute;left: 0;top: 0;display: none;z-index: -10;"></canvas>
				</div>
			</div>

			<div class="side-info">{{workMessage.unread}}道题未批改 /<span> 共{{workMessage.total}}道</span></div>
			<div id="side" class="side">
				<b-list-group-item href="#" class="flex-column align-items-start transition" v-for="(v, i) of topicList" :key="i" :class="{active: i === selectedItemIndex, finish: v.correct_time}" @click.stop="clickItem(i)">
					<div class="d-flex w-100 resultImg justify-content-between">
						<h5 class="mb-1">
 <span class="num">{{i+1}}</span><div @click.stop.prevent="qusActives(0,i)" :class="{qusActive:qusActive[0]&&i === tabIndex||i!=tabIndex,qus: true}">题目</div><span @click.stop.prevent="qusActives(1,i)" :class="{qusActive:qusActive[1]&&i === tabIndex, parsing: true}">答案解析</span>
              题号：{{v.qid}}

            </h5>
					</div>
					<p class="mb-1" v-show="qusActive[0]&&i===tabIndex||i!==tabIndex">
						<img :src="v.screen_src || 'null'" />
					</p>
					<p class="mb-1" v-show="qusActive[1]&&i === tabIndex">
						<img :src="v.answer_src || 'null'" />
					</p>
					<div class="btn-top" v-if="+v.right === 1">
						<img src="../../static/images/qus_true.png" alt="">
					</div>
					<div class="btn-bottom" v-if="+v.right === 0">
						<img src="../../static/images/qus_false.png" alt="">
					</div>
					<div class="Anwserbtns">
						<div class="btn-top" @click.stop.prevent="homeworkUpdateCorrecting(i, 1)">
							<img src="../../static/images/qus_true.png" alt="">
						</div>
						<div class="btn-bottom" @click.stop.prevent="homeworkUpdateCorrecting(i, 0)">
							<img src="../../static/images/qus_false.png" alt="">
						</div>
					</div>
				</b-list-group-item>

				<div style="height:30px"></div>
			</div>
		</div>
		<div v-show="isClear">
			<div>
				<div id="modal-center___BV_modal_outer_">
					<div id="modal-center" role="dialog" class="modal fade show d-block" style="">
						<div class="modal-dialog modal-md modal-dialog-centered">
							<div tabindex="-1" role="document" aria-labelledby="modal-center___BV_modal_header_" aria-describedby="modal-center___BV_modal_body_" class="modal-content">
								<div id="modal-center___BV_modal_body_" class="modal-body textCenter">
									<p class="my-4">
										是否清空所有批注,恢复至原图么？</p>
								</div>
								<footer id="modal-center___BV_modal_footer_" style="justify-content: center;" class="modal-footer">
									<button type="button" size="sm" class="btn btn-primary bgGreen" style="border: none" @click="clear"> 确定</button>
									<button type="button" size="sm" class="btn btn-secondary" @click="isShowModal">取消</button>
								</footer>
							</div>
						</div>
					</div>
					<div id="modal-center___BV_modal_backdrop_" class="modal-backdrop fade show"></div>
				</div>
			</div>
		</div>
		<el-dialog title="提示" :visible.sync=" dialogShow" width="30%">
			<span>{{dialogTex}}</span>
			<span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confrimFn">知道了</el-button>
    </span>
		</el-dialog>
		<b-modal v-model="errorModal" ref="modal" title="提示" ok-title="知道了" @ok="closeError">
			{{errorText}}
		</b-modal>
	</div>
</template>
<script>
	var vm;
	import { mapState, mapGetters } from 'vuex'
	import costombrumb from 'components/costombrumb.vue'
	import navbrumb from 'components/navbrumb.vue'
	export default {
		components: {
			costombrumb,
			navbrumb
		},
		data() {
			return {
				qusActive: [true, false], // 题目 答案解析默认选中状态
				imgList: [], // 学生上传图片列表
				target: 0, // 标识第几张图
				tabIndex: -1, //
				rightImg: '../../static/images/qus_true.png', // 勾路径
				tool: '', // 工具类型
				isClear: false, // 判断弹出框显隐状态
				isCheckTaskResult: true, //显示是否已经批改
				dialogShow: false,
				dialogTex: "",
				errorModal: false,
				topicList: [], // 题目list
				errorText: ["操作失败", "获取信息失败"],
				selectedItemIndex: -1, // 右侧批改确认区选择题index
				textImg: 'static/images/newTask/textChos.png',
				penImg: 'static/images/newTask/pen.png',
				toolImgList: {
					pen: {
						on: 'static/images/newTask/penChos.png',
						no: 'static/images/newTask/pen.png'
					},
					text: {
						on: 'static/images/newTask/textChos.png',
						no: 'static/images/newTask/text.png'
					}
				},
				textModal: ["是否清空所有批注，恢复至原图吗？", "没有可清空内容"],
				rightList: [], // 对勾图片列表
				scale: 1, // 放大缩小倍数
				workMessage: {}  // 未批改题目个数
			}
		},
    // 获取参数
		computed: {
			classId() {
				return this.$route.query.class_id || ''
			},
			smallId() {
				return this.$route.query.small_class_id || ''
			},
			smallClassId() {
				return this.$route.query.small_class_id || ''
			},
			urlTime() {
				return this.$route.query.time || ''
			},
			// 布置作业id
			workId() {
				return this.$route.query.work_id
			},
			// 学生id
			studentId() {
				return this.$route.query.uid
			},
			// 学生提交作业id
			taskId() {
				return this.$route.query.task_id
			}
		},
		activated: function() {
			this.getNewTaskList();
			vm = this;
		},

		watch: {
			'$route': 'getTask'
		},
		created() {
      // 获取页面数据
			this.getNewTaskList();
			vm = this;
		},
		methods: {
			getTask() {
				this.getNewTaskList();
				vm = this;
				// 暂时没用
				this.getTaskList();
			},
			// 点击完成 获取批改后得图片
			done() {
				var i = 0;
				var that = this;
				getDraw();
				var mes = []
        // 点击完成  所有操作画到对应下面canvas上面
				function getDraw() {
					if(i < data.pushImgList.length) {
            console.log(data.canvas.left)
						let img = new Image();
						let left = data.canvas.style.left.split("px")[0];
						let top = data.canvas.style.top.split("px")[0]
						img.src = data.pushImgList[i][data.pushImgList[i].length - 1].src;
						img.onload = function() {
							console.log(img.width)
							console.log(img.height)
							let canvas1 = document.getElementById('canvas1')
							let cavasctx = canvas1.getContext('2d');
							canvas1.style.display = "block";
							canvas1.width = img.width;
							canvas1.height = img.height;
							let countWidth = img.width / data.adaptationMes[i].width;
							let countheight = img.height / data.adaptationMes[i].height;
							cavasctx.clearRect(0, 0, canvas1.width, canvas1.height); //先清掉画布上的内容
							cavasctx.drawImage(img, 0, 0, img.width, img.height);
							if(data.textList[i].length > 0) {
								for(let j = 0; j < data.textList[i].length; j++) {
									let item = data.textList[i][j];
									cavasctx.font ="18px 宋体";
									cavasctx.fillStyle = 'red';
									let lastSubStrIndex = 0;
									let lineWidth = item.x+17;
									console.log(lineWidth);
									let initLineWidth = lineWidth;
									let maxWidth = lineWidth + 252;
									let lineheight = item.y+19;
									for(let i = 0; i < item.text.length; i++) {
										lineWidth += cavasctx.measureText(item.text[i]).width;
										if(lineWidth > maxWidth) {
											cavasctx.fillText(item.text.substring(lastSubStrIndex, i), initLineWidth, lineheight);
											lineheight += 18;
											lineWidth = initLineWidth;
											lastSubStrIndex = i;
										}
										if(i == item.text.length - 1) {
											cavasctx.fillText(item.text.substring(lastSubStrIndex, i + 1), initLineWidth, lineheight);
										}
									}
								}
							}
							if(data.rightImgList[i].length > 0) {
								for(let x = 0; x < data.rightImgList[i].length; x++) {
									let item = data.rightImgList[i][x];
									let right = new Image();
									right.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAoCAYAAACB4MgqAAADHUlEQVRYhdXYX6hUVRTH8c+d2x/BhxuEZCj4IvkQ4oNlYQVlhpUEJRJFgdZLJPknKh98EXzxTz7oQ9lLRJERBCVBpFmEkEFW0t9LhZDoFRT/oKTXvKb2sO7IOJ45Z5+Z053p+zLM3uus/Zs1+6y91+qb9clH/kfcis14otZtJYlci9XYi/ux+Jru6kliBt4e/azzXC9HvA+vYI8rRQ/jhV6N+AS8gwebxv/CI9jVi8Lvw1bc3DR+Bg9hN/TSVunHGux0tehhzDcqGnol4jfgPRHRZkbwKHY1DvaC8Gn4GLdkzF3A0+JfuIJub5X5+Ea2aFiKD7Imuin8RRHpgRbz67Cl1cPd2Co1bBTCW7EVq/KcjLXw60V+fjzHZjeexaU8R2MpfADbcG+OzRAWikySy1gJvxE7MDPHZkSIPpzicCyE3yTS2fQCuyUiwySRlVVWiNxZBZPFwVEkegveLOO4MeLj8AYWjX6/HS/jfBmHDUzGl5haYPe1CFYp6hGfJCKzqGFuGb7AxLJOxfb4XLHoE3hSwsvYTA134lvMypi/B99hdgmfE8QPnlZgdwnP4EAJ35ep4SVX38YamST+8ucT/A3gU1EbFvGaODnbooansL3A7jq8jrfEu9DK5kP5Ka/OIFYmasykJvbXAhk3sAwW4ytMaRrvx/uYk+BjRATrbLLKDOov51kZd94WzBT7fm7D2EY8lrjmWvyQKrAVfU19lfHihLsr4dkL4iJ0WuzXFH7GbdrIIs00n5xnxB15B+4oeLYf60us9Y/IIh2LJvvkPIV5+L6KBRrYUKXPVoVEXfyPFa3zuyiEKyOvAjqOB/BLBessw7kK/FymqHQ7KrLHbx2ssQ2fdfB8Jik15xEhfl8b/oexvI3nCkktlg+JDtOfJf2v0+ZdpIgyVf6QOBkPJtofwKulFSVStj2xX4gfSrBdjb/LCkqlnb7KPtFcz6sNfxXV/H9Guw2hP4T4oy3m1+Bim76T6KSTNSiyzbGM8cy2WZV02oL7SZywJxvGNilo5lRBFb3DvUL8KRH9dyvwWUhVfZU9eBh367BASOVfbLyPPfzXBWcAAAAASUVORK5CYII=";
									right.onload = function() {
										cavasctx.drawImage(right, item.x * countWidth, item.y * countheight, 45, 45);
										if(x === data.rightImgList[i].length - 1) {
											setTimeout(function() {
												outImg(i, that, canvas1.toDataURL('image/jpeg'))
												i++;
												if(i < data.pushImgList.length) {
													getDraw()
												}
											}, 150)
										}
									}
								}
							} else {
								outImg(i, that, canvas1.toDataURL('image/jpeg'))
								i++;
								if(i < data.pushImgList.length) {
									getDraw()
								}
							}

						}
					}
				}
        // 倒出每张图的所有批改内容
				function outImg(i, that, src) {
					mes.push({
						id: that.imgList[i].id,
						img_src: src,
						uid: that.studentId
					});
					if(i === data.pushImgList.length - 1) {
						that.determine(mes)
					}
				}
			},
      //
			confrimFn() {
				this.dialogShow = !this.dialogShow;
			},
			getPickedItem(it) {
				this.pickedItem = it
			},
			resetSelectedItemIndex() {
				this.selectedItemIndex = -1
			},
			qusActives(type, item) {
				this.tabIndex = item;
				if(type == 0 && this.tabIndex == item) {
					this.qusActive = [true, false];
				} else if(type == 1 && this.tabIndex == item) {
					this.qusActive = [false, true];
				} else {}
			},
			clickItem(n) {},
			//获取题列表信息
			getNewTaskList() {
				const payload = {
					query: {
						taskid: this.taskId,
						question_type: '1'
					}
				}
				let that = this;
				let res = this.$store.dispatch('getNewTaskList', payload)
					.then(r => {
						that.imgList = r.data.taskData;
						that.topicList = r.data.correcting;
						for(let i = 0; i < that.topicList.length; i++) {
							that.qusActive[i] = [true, false]
						}
						that.workMessage = r.data.number;
						this.tool = 'text';
						draw('canvas');
						chosText();
						if(r.code === 1) {
							return {
								code: 1,
								desc: '提交成功'
							}
						} else {
							this.errorText = "获取信息失败";
							this.errorModal = ture;

						}
					})
				return res
			},
			//旋转图片
			async getRotateImg(src) {
				const params = {
					param: {
						id: this.imgList[vm.target].id,
						img_src: src,
						uid: this.studentId
					}
				};
				await this.$store.dispatch('rotateImg', params)
					.then(r => {
						if(r.code) {
							document.getElementById('canvas1').style.block = "none";
							this.imgList[vm.target].correct_src_base64 = r.data.src_base64;
							draw('canvas')
						} else {
							this.errorText = "操作失败";
							this.errorModal = ture;
						}
          })
          .catch(err => {
            this.errorText = "网络请求失败，请检查网络情况";
            this.errorModal = ture;
          })
			},
			//上传批改图片
			async determine(data) {
				let params = {
					param: {
						datas: JSON.stringify(data)
					}
				};
				await this.$store.dispatch('determine', params)
					.then(r => {
						if(r.code && r.desc === "E_SUCCESS") {
							goPing()
						} else {
							this.errorText = "操作失败";
							this.errorModal = ture;
						}
					})
			},
			// 提交判题结果
			async homeworkUpdateCorrecting(i, result) {
				let payload = {
					param: {
						work_id: this.workId,
						uid: this.studentId,
						taskid: this.taskId,
						qid: this.topicList[i].qid,
						img_src: '',
						right: result,
						tag: '',
					}
				}
				// After get img and audio then submit task
				await this.$store.dispatch('homeworkUpdateCorrecting', payload)
					.then(r => {
						if(r.code === 1) {
							this.topicList[i].right = r.data.data.right;
							this.topicList[i].correct_time = r.data.data.correct_time;
							if(this.topicList[i].right === "1") {
								this.addRight('')
							}
							this.workMessage.unread = 0;
							for(let i = 0; i < this.topicList.length; i++) {
								if(this.topicList[i].correct_time === null) {
									this.workMessage.unread++;
								}
							}
						} else {
							this.errorText = "操作失败";
							this.errorModal = ture;
						}
					})
			},
			isShowModal: function() {
				if(data.pushImgList[this.target].length > 1) {
					this.isClear = !this.isClear;
				}
			},
			closeError: function() {
				this.errorModal = false;
			},
			clear: function() {
				this.isClear = !this.isClear;
				clear()
			},
			rotate: function(degree) {
				trunrot(degree)
			},
      // 上一张
			turnImgTop: function() {
				if(this.target !== 0) {
					this.target--;
					draw('canvas')
				}
			},
      // 下一张
			turnImgNext: function() {
				this.target++;
				draw('canvas');
			},
      // 选择画笔
			checkPen: function() {
				this.tool = 'pen';
				this.penImg = this.toolImgList.pen.on;
				this.textImg = this.toolImgList.text.no;
				chosPen();
			},
      // 增加对号
			addRight: function() {
				addRight('');
			},
      // 选择文字工具
			checkText: function() {
				this.tool = 'text';
				this.penImg = this.toolImgList.pen.no;
				this.textImg = this.toolImgList.text.on;
				chosText();

			},
      // 上一步
			goBack: function() {
				goBack();
				this.tool = 'text';
				this.penImg = this.toolImgList.pen.no;
				this.textImg = this.toolImgList.text.on;
				chosText();

			},
      // 放大
			big() {
				if(this.scale < 1.75) {
					this.scale +=.25;
					canvasScale(this.scale)
				}
			},

      // 缩小
			small() {
				if(this.scale > .5) {
					this.scale -= .25;
					canvasScale(this.scale)
				}
			}
		}
	}
	//初始化页面需要的数据
	var data = {
		el: '',
		canvas: '', // canvas对象
		cxt: '', // canvas 2d 对象
		tool: '',
		pushImgList: [], // 图片状态
		pushImgTarget: [], // 步骤记录
		lastX: '', // 画笔最后位置
		lastY: '', // 画笔最后位置
		textList: [], // 文字个数
		canvasBlock: '', // canvas上层DIV
		isTextDown: 0, // 移动文字鼠标是否点下
		rightImgList: [], // 对号集合
		initCanvasMes: {}, // 初始化canvas数据库获取对象
		adaptationMes: {}, // 适配canvas宽高
		scale: 1,
		adaptationMes: {}, // 适配之后
		scale: [], // 放大缩小记录
		canvasMess: { // 暂时没用（废物）
			height: "",
			width: ""
		},
		moveRight: false, // 是否选中对号
		moveImg: false // 是否选中图片
	};

  var timer = null;

	function initGlobalData() {
		data = {
			el: '',
			canvas: '',
			cxt: '',
			tool: '',
			pushImgList: [],
			pushImgTarget: [],
			lastX: '',
			lastY: '',
			textList: [],
			canvasBlock: '',
			isTextDown: 0,
			rightImgList: [],
			initCanvasMes: {},
			adaptationMes: [],
			scale: [],
			canvasMess: {
				height: "",
				width: ""
			},
			moveRight: false,
			moveImg: false
		}
	}
	//去评论页面
	function goPing() {
		initGlobalData()
		vm.$router.push({
			path: '/newTaskevaluation',
			query: {
				work_id: vm.workId,
				task_id: vm.taskId,
				uid: vm.studentId,
			}
		})
	};
	//画布放大缩小
	function canvasScale(count) {
    // 缩放倍数  --  data--> 初始化canvas结构数据
		count = count.toFixed(2)
		data.cxt.save(); // save 保存的是save之前的状态  restore 之后的状态是save的状态，和save之后的改变没有关系
		canvasClear(); // 清空画板上的已有内容
		let width = data.adaptationMes[vm.target].width * count; // 设置缩放之后的canvas宽度 -- [vm.target] --> 当前图片（多张图片）
		let height = data.adaptationMes[vm.target].height * count; // 设置缩放之后的canvas高度 -- [vm.target] --> 当前图片（多张图片）
		let image = new Image();
		image.crossOrigin = "anonymous";  // 解决图片跨域（目前没用）
		//如果图片切换回来 直接显示最后一次操作的状态
		image.src = data.pushImgList[vm.target][data.pushImgTarget[vm.target]].src; // data.pushImgList[vm.target] --> 当前图片   /  [data.pushImgTarget[vm.target]] -->  当前步骤
		image.onload = function() {
			data.canvas.width = width; // data 对象中 canvas 画布宽
			data.canvas.height = height; // data 对象中 canvas 画布高
			data.offset = data.canvas.getBoundingClientRect(); // getBoundingClientRect -> 获取某个元素相对于视窗的位置集合：top/bottom/left/right -> 都是相对于上边和左边的距离
			image.crossOrigin = "anonymous";  // 解决图片跨域（目前没用）
			data.cxt.drawImage(image, 0, 0, width, height); // 把图片画到画布上
			canvasContentMove(image);  // 图片移动事件
		}
		//清除之前在画布上的操作，并获取当前画布的操作 并添加到页面上
		for(let i = 0; i < data.textList[vm.target].length; i++) {
			let item = data.textList[vm.target][i];
      let textDiv = document.getElementById("textDiv" + item.id);
      textDiv.style.fontSize = 30 * count / data.scale[vm.target] + "px";
      textDiv.style.lineHeight = 40 * count / data.scale[vm.target] + "px";
      textDiv.style.width = ( width + 100 - parseInt(textDiv.style.left)) + "px";
			textDiv.style.left = item.x * count + parseInt(data.canvas.style.left) + "px";
      textDiv.style.top = item.y * count + parseInt(data.canvas.style.top) + "px";
		}
		for(let i = 0; i < data.rightImgList[vm.target].length; i++) {
			let item = data.rightImgList[vm.target][i];
			let textDiv = document.getElementById("img" + item.id);
			textDiv.style.left = item.x * count + parseInt(data.canvas.style.left) + "px";
			textDiv.style.top = item.y * count + parseInt(data.canvas.style.top) + "px";
			textDiv.style.height = 45 / data.scale[vm.target] * vm.scale + "px";
			textDiv.style.width = 45 / data.scale[vm.target] * vm.scale + "px";
		}
		//选择页面上所有的对号
	}
	//选择文字工具
	function chosText() {
		data.canvasBlock.addEventListener("dblclick", canvalBlockLis);
	}
	//获取当前图片的对号个数，遍历添加到画布上
	function mapRight() {
		for(let i = 0; i < data.rightImgList[vm.target].length; i++) {
			addRight(data.rightImgList[vm.target][i].id)
		}
	}
	//拖拽图片
	function drafting() {
		data.canvas.addEventListener("mousedown", function() {})
	}
	//添加对号 *********************************************
	function addRight(id) {
		let div = document.createElement('div');
		div.setAttribute('class', 'right');
		div.style.width = 45 * vm.scale / data.scale[vm.target] + "px";
		div.style.height = div.style.width;
		let imgMessage = {
			id: id,
			value: vm.rightImg,
			x: 550 - parseInt(data.canvas.style.left),
			y: 50 - parseInt(data.canvas.style.top),
			type: 'img',
			src: document.getElementById('canvas').toDataURL('image/jpg')
		};
		// 判断当前图片添加对号还是返回上张图片遍历添加已有对号
		if(id === '') {
			imgMessage.id = data.rightImgList[vm.target].length;
			data.rightImgList[vm.target].push(imgMessage);
			div.style.left = "550px";
			div.style.top = "50px";
      // 记录添加信息的状态
			pushImgOrDiv(imgMessage);
		} else {
			div.style.left = data.rightImgList[vm.target][id].x * vm.scale + "px"
			div.style.top = data.rightImgList[vm.target][id].y * vm.scale + "px"
		}
		div.setAttribute('id', 'img' + imgMessage.id);
		data.canvasBlock.appendChild(div);
		let client = {};
		div.addEventListener('mousedown', mouseDown);

		function mouseDown(e) {
			e.stopPropagation()
			data.moveRight = true;
			client.startx = e.clientX;
			client.starty = e.clientY;
			client.startLeft = parseInt(div.style.left);
			client.startTop = parseInt(div.style.top);
			data.canvasBlock.addEventListener('mousemove', mouseMove);
		}

		function mouseMove(e) {
			if(data.moveRight) {
        console.log(vm.scale)
				div.style.left = e.clientX - (client.startx - client.startLeft) + "px";
				div.style.top = e.clientY - (client.starty - client.startTop) + "px";
				data.rightImgList[vm.target][imgMessage.id].x = (parseInt(div.style.left) - parseInt(data.canvas.style.left)) / vm.scale;
				data.rightImgList[vm.target][imgMessage.id].y = (parseInt(div.style.top) - parseInt(data.canvas.style.top)) / vm.scale;
				data.pushImgList[vm.target].map(function(item, i) {
					if(item.id !== undefined && item.id === div.id.split('img')[1] && item.type === 'img') {}
				})
			}
		}
		div.addEventListener('mouseup', function(e) {
			if(data.moveRight) {
				data.moveRight = false;
				data.canvasBlock.removeEventListener('mousemove', mouseMove)
			}
		});
	};
	//当选择文字功能时 添加监听
	function canvalBlockLis(e) {
		e.stopPropagation();
    clearTimeout(timer)
		data.isTextDown = false;
    data.moveImg = false;
		if(vm.tool === 'text') {
			addText(data.textList[vm.target].length)
		}
	}
	//关闭双击出现输入框监听事件
	function closeCanvasBlockLis() {
		data.canvasBlock.removeEventListener("dblclick", canvalBlockLis);
	}

	//生成文字框
	function addText(id) {
		id = parseInt(id);
		let div = document.createElement('div');
		div.setAttribute('class', 'inputBlock');
		div.setAttribute('id', 'text' + id);
		let target = false;
		let str = '<div class="blockContent"><div class="textInput" id="input' + id + '" contenteditable="true" onBlur="saveText(id)"></div><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABh0lEQVRIibXWP08UQRzG8c+OlphoIpZHL4TGV0Bjh4kNgjE0xBZjQfQdqIUxSit0GKAxoaMR34CN0RbwYuWfnMbrTG4tZpacl93l4PaeZpN9Zr7PzuzM/CbLl+fVqIW7mMN1TOIvvuIL3mMHR1WArCKghadYwIW6L0AvhTxGe9AMJR1u4ROWhoAXjCV8Ts/agAd4i0tDgAc1gS08rAq4gxcloWdRhueJ9V9AC69Tg1GVJVarP+CJOMSmNIFnRcAUFhuEF1rAVEjwUea9SgGLQdxE49LcRcyUWrM3WFnl8pV6xK8OG6/4+KHMnQm4WtpxGDixzcpqlTvZzNzXLO6AH6XO5jq/O6fDOz/ZWK9yv2f58vw+bp5OOpf2A96NCQ4HQTxqe2OA97ATcIzdMQTs4rhYRY/QbRDeTcyTI6KN+8gbgOeJ1e4PgG2xWIzyP3KsJZbBAHiJ2/hzDngX98SCc6Kynbwnnk/bhhtNL7WdxptBs+pWUaj/2jKNa+n9N7HIH4ir5bAK8A+SnU/rKTYdYAAAAABJRU5ErkJggg==" alt="" class="removeText" id="img' + id + '" onClick="removeText(id)"></div>'
		div.innerHTML = str;
		data.canvasBlock.appendChild(div);
		for(let i = 0; i < data.textList[vm.target].length; i++) {
			let item = data.textList[vm.target][i];
			if(item.id === id && item.text !== '') {
				target = true;
			}
		}
		if(target) {
			for(let i = 0; i < data.textList[vm.target].length; i++) {
				let item = data.textList[vm.target][i];
				if(item.id === id && item.text !== '') {
					div.style.left = (item.x + parseInt(data.canvas.style.left)) * vm.scale + "px";
					div.style.top = (item.y + parseInt(data.canvas.style.top)) * vm.scale + "px";
				}
			}
		} else {
			let arr = {
				id: id,
				x: '180',
				y: '230',
				text: '',
				type: '',
				src: ''
			};
			div.style.left = arr.x + "px";
			div.style.top = arr.y + "px";
			data.textList[vm.target].push(arr);
		}
		document.getElementById('input' + id).innerText = data.textList[vm.target][id].text;
		document.getElementById('input' + id).focus();
		let range = window.getSelection(); //创建range
		range.selectAllChildren(document.getElementById('input' + id)); //range 选择obj下所有子内容
		range.collapseToEnd(); //光标移至最后
	}

	var timeout; //用于处理input同时有失去焦点和click事件
	window.saveText = function(id) {
		timeout = setTimeout(function() {
			data.isTextDown = false;
			let num = parseInt(id.split('input')[1]);
			if(document.getElementById(id).innerText === '') {
				data.textList[vm.target].splice(num, 1);
			} else {
				let arr = {
					x: (parseInt(document.getElementById('text' + num).style.left) - parseInt(data.canvas.style.left)) / vm.scale,
					y: (parseInt(document.getElementById('text' + num).style.top) - parseInt(data.canvas.style.top)) / vm.scale,
					text: document.getElementById(id).innerText,
					id: num,
					type: "textDiv",
					src: document.getElementById('canvas').toDataURL('image/jpg')
				};
				let texttarget = false,
					pushtext = false,
					pushtexttarget;
				for(let i = 0; i < data.textList[vm.target].length; i++) {
					let item = data.textList[vm.target][i];
					if(item.id === num) {
						texttarget = true;
					}
				}
				if(texttarget) {
					data.textList[vm.target][num] = arr;
				} else {
					data.textList[vm.target].push(arr);
				}
				for(let i = 0; i < data.pushImgList[vm.target].length; i++) {
					let item = data.pushImgList[vm.target][i];
					if(item.id === num && item.type === 'textDiv') {
						pushtexttarget = i;
						pushtext = true;
					}
				}
				if(pushtext) {
					data.pushImgList[vm.target][pushtexttarget] = arr
				} else {
					pushImgOrDiv(arr)
				}
				replaceText(num)
			}
			document.getElementById('text' + num).parentNode.removeChild(document.getElementById('text' + num));
		}, 150)
	};
	//删除文字
	window.removeText = function(id) {
		clearTimeout(timeout);
		let num = id.split('img')[1];
		data.textList[vm.target].splice(num, 1);
		for(let i = 0; i < data.textList[vm.target].length; i++) {
			let item = data.textList[vm.target][i];
			if(item.type === 'textDiv' && item.id === num) {
				data.textList[vm.target].splice(num, 1);
			}
		}
		document.getElementById('text' + num).parentNode.removeChild(document.getElementById('text' + num));
	};

	//当文字输入完成后,输入框去掉，生成文字 ***************************************
	function replaceText(num) {
		console.log(data.textList[vm.target]);
		data.textList[vm.target].map(function(item, i) {
			if(item.id === num) {
				var div = document.createElement('div');
				div.setAttribute('class', 'divToText');
				div.setAttribute('id', 'textDiv' + num);
				div.style.left = (item.x + parseInt(data.canvas.style.left)) * vm.scale + "px";
        div.style.top = (item.y + parseInt(data.canvas.style.top)) * vm.scale + "px";
				div.style.fontSize = 30 * vm.scale + "px";
				div.innerHTML = item.text;
				data.canvasBlock.appendChild(div);
				div.addEventListener('dblclick', function(e) {
					e.stopPropagation();
					addText(e.target.id.split('textDiv')[1]);
					div.parentNode.removeChild(div);
				});
				let client = {};
				div.addEventListener('mousedown', mouseDown);

				function mouseDown(e) {
					e.stopPropagation();
					data.isTextDown = true;
					client.startx = e.clientX;
					client.starty = e.clientY;
					client.startLeft = parseInt(div.style.left);
					client.startTop = parseInt(div.style.top);
					data.canvasBlock.addEventListener('mousemove', mouseMove);
				}

				function mouseMove(e) {
					if(data.isTextDown) {
						div.style.left = e.clientX - (client.startx - client.startLeft) + "px";
						div.style.top = e.clientY - (client.starty - client.startTop) + "px";
            let width = data.adaptationMes[vm.target].width * vm.scale; // 设置缩放之后的canvas宽度 -- [vm.target] --> 当前图片（多张图片）
            div.style.width = ( width + 100 - parseInt(div.style.left)) + "px";
					}
					item.x = (parseInt(div.style.left) - parseInt(data.canvas.style.left)) / vm.scale;
					item.y = (parseInt(div.style.top) - parseInt(data.canvas.style.top)) / vm.scale;
				}
				div.addEventListener('mouseup', function(e) {
					data.isTextDown = 0;
					data.canvasBlock.removeEventListener('mousemove', mouseMove)
				});
			}
		});
	}
	//重新获取图片画到canvas中
	function draw(el) {
		vm.scale = 1;
		data.lastX = 0;
		data.lastY = 0;
		//切换上一张下一张时如果没有批改过默认操作过的步骤为空
		if(data.pushImgList[vm.target] === undefined) {
			data.pushImgList[vm.target] = [];
		}
		if(data.pushImgTarget[vm.target] === undefined) {
			data.pushImgTarget[vm.target] = -1;
		}
		if(data.rightImgList[vm.target] === undefined) {
			data.rightImgList[vm.target] = [];
		}
		if(data.adaptationMes[vm.target] === undefined) {
			data.adaptationMes[vm.target] = {}
		}
		if(data.scale[vm.target] === undefined) {
			data.scale[vm.target] = 1
		}
		data.canvas = document.getElementById(el);
		data.canvasMess.height = data.canvas.height;
		data.canvasMess.width = data.canvas.width;
		data.cxt = data.canvas.getContext('2d');

		data.cxt.restore();
		canvasClear();
		data.canvas.style.left = "0px";
		data.canvas.style.top = "0px";
		data.mousePressed = false; //鼠标是否点下
		let image = new Image();
		//如果图片切换回来 直接显示最后一次操作的状态
		if(data.pushImgList[vm.target].length > 1 && data.pushImgTarget[vm.target] > 0) {
			drawImgInCanvas(data.pushImgList[vm.target][data.pushImgTarget[vm.target]].src)
			//如果一次操作直接画 不push到操作栈里面
		} else {
			image.src = vm.imgList[vm.target].correct_src_base64 ? vm.imgList[vm.target].correct_src_base64 : vm.imgList[vm.target].src_base64;
			image.onload = function() {
				let imgHeight = image.height;
				let imgWidth = image.width;
				data.scale[vm.target] = imgHeight / imgWidth;
				data.initCanvasMes.width = image.width;
				data.initCanvasMes.height = image.height;
				data.canvas.width = 648;
				data.canvas.height = data.canvas.width * data.scale[vm.target];
				data.adaptationMes[vm.target].width = 648;
				data.adaptationMes[vm.target].height = data.canvas.height;
				image.crossOrigin = "anonymous";
				data.cxt.drawImage(image, 0, 0, data.canvas.width, data.canvas.height);
				data.offset = data.canvas.getBoundingClientRect();
				canvasContentMove(image);
				if(data.pushImgList[vm.target].length === 0 && data.pushImgTarget[vm.target] === -1) {
					pushImg()
				} else {

				}
			};
		}
		//清除之前在画布上的操作，并获取当前画布的操作 并添加到页面上
		data.canvasBlock = document.getElementById('canvasBlock');
		clearAllText();
		if(data.textList[vm.target] === undefined) {
			data.textList[vm.target] = [];
		} else if(data.textList[vm.target].length > 0) {
			data.textList[vm.target].map(function(item, i) {
				replaceText(item.id)
			});
		}
		//选择页面上所有的对号
		clearAllRight();
		if(data.rightImgList[vm.target].length === undefined) {
			data.rightImgList[vm.target] = []
		} else if(data.rightImgList[vm.target].length > 0) {
			mapRight();
		}
	};
	//图片移动事件
	function canvasContentMove(image) {
    // canvasBlock --> canvas 上层的DIV
    clearTimeout(timer)
    timer = setTimeout(function () {
      data.canvasBlock.onmousedown = function (event) { //鼠标按下事件
        event.stopPropagation();
        // moveImg --> 是否选中图片
        data.moveImg = true;
        var pos = windowToCanvas(data.canvasBlock, event.clientX, event.clientY); // 鼠标点击时候获取图片位置
        data.canvasBlock.onmousemove = function(event) { // 鼠标移动事件
          if(vm.tool === 'text' && data.moveImg) { // 当前编辑状态是文字状态并且图片移动flag为true
            var pos1 = windowToCanvas(data.canvasBlock, event.clientX, event.clientY); // 鼠标移动时候实时获取鼠标位置坐标
            var x = pos1.x - pos.x; // 移动鼠标后当前点和起始点差
            var y = pos1.y - pos.y; // 移动鼠标后当前点和起始点差
            pos = pos1; // 更新起始点
            data.canvas.style.left = parseInt(data.canvas.style.left.split("px")[0]) + x + "px"; // 设置canvas位置 L
            data.canvas.style.top = parseInt(data.canvas.style.top.split("px")[0]) + y + "px"; // 设置canvas位置 T
            data.cxt.restore(); // 回复起始点canvas状态
            let divList = data.canvasBlock.querySelectorAll(".divToText"); // 文字集合
            if(divList.length > 0) { // 设置移动后文字的最新位置坐标
              for(let i = 0; i < divList.length; i++) {
                let item = document.getElementById(divList[i].id);
                item.style.left = parseInt(item.style.left.split("px")[0]) + x + "px";
                item.style.top = parseInt(item.style.top.split("px")[0]) + y + "px";
              }
            }
            let rightList = data.canvasBlock.querySelectorAll(".right"); // 对号集合
            if(rightList.length > 0) {  // 设置移动后对号的最新位置坐标
              for(let i = 0; i < rightList.length; i++) {
                let item = document.getElementById(rightList[i].id);
                item.style.left = parseInt(item.style.left.split("px")[0]) + x + "px";
                item.style.top = parseInt(item.style.top.split("px")[0]) + y + "px";
              }
            }
          };
          data.canvasBlock.onmouseup = function() { // 鼠标抬起事件
            if(data.moveImg) { // 移动图片flag为真
              data.offset = data.canvas.getBoundingClientRect();
              data.lastX = (x - parseInt(data.canvas.style.left.split('px')[0]));
              data.lastY = (y - parseInt(data.canvas.style.top.split('px')[0]));
              data.cxt.save(); // 保存移动后的最新图片状态
              data.cxt.restore();
              data.moveImg = false;
              data.canvas.onmousemove = null; // 置空事件
              data.canvas.onmouseup = null; // 置空事件
            }
          }
        }
      }
    }, 300)
	}

  // 获取图片位置
	function windowToCanvas(canvas, x, y) {
    var bbox = canvas.getBoundingClientRect(); // getBoundingClientRect --> 获取元素相对于视窗的位置（相对于上边和左边的距离）
    // x,y 是鼠标点击位置坐标
		return {
			x: x - bbox.left - (bbox.width - data.canvas.width) / 2, // 图片右边距离canvas窗口左边距的距离
			y: y - bbox.top - (bbox.height - data.canvas.height) / 2 // 图片底边边距离canvas窗口上边距的距离
		};
	}
// 回退画
	function drawImgInCanvas(src) {
		let image = new Image();
		image.src = src;
		image.onload = function() {
			data.canvas.width = data.adaptationMes[vm.target].width;
			data.canvas.height = data.adaptationMes[vm.target].height;
			data.cxt.drawImage(image, 0, 0, data.canvas.width, data.canvas.height);
			canvasContentMove(image);
			data.cxt.restore();
		};
	}
	//画笔的监听事件
	function penMouseDown(e) {
		if(vm.tool === 'pen') {
			data.mousePressed = true;
			drawPen(e.clientX - data.offset.left, e.clientY - data.offset.top, false, data);
		}
	}
// 画笔画线
	function penMouseMove(e) {
		if(vm.tool === 'pen') {
			if(data.mousePressed) {
				drawPen(e.clientX - data.offset.left, e.clientY - data.offset.top, true, data);
			}
		}
	}
	//画笔
	function drawPen(x, y, isDown, canvasObj) {
		if(isDown) {
			canvasObj.cxt.beginPath();
			canvasObj.cxt.strokeStyle = 'red'
			canvasObj.cxt.lineWidth = 2 / data.scale[vm.target] * vm.scale;
      canvasObj.cxt.moveTo(data.lastX, data.lastY);
      // canvasObj.cxt.lineTo((x - parseInt(data.canvas.style.left.split('px')[0])), (y - parseInt(data.canvas.style.top.split('px')[0])));
      canvasObj.cxt.lineTo(x, y);
			canvasObj.cxt.closePath();
			canvasObj.cxt.stroke();
			canvasObj.cxt.save();
		}
    // canvasObj.lastX = (x - parseInt(data.canvas.style.left.split('px')[0]));
    // canvasObj.lastY = (y - parseInt(data.canvas.style.top.split('px')[0]));
    canvasObj.lastX = x;
    canvasObj.lastY = y;
	}
	//移除画笔监听
	function removePenLisenter() {
		data.canvasBlock.removeEventListener("mousedown", penMouseDown);
		data.canvasBlock.removeEventListener("mousemove", penMouseMove);
	}
	//选择画笔
	function chosPen() {
		removePenLisenter();
		data.canvasBlock.addEventListener("mousedown", penMouseDown);
		data.canvasBlock.addEventListener("mousemove", penMouseMove);
		data.canvasBlock.addEventListener("mouseup", function(e) {
			if(vm.tool === 'pen') {
				if(data.mousePressed) {
					data.mousePressed = false;
					pushImg();
				}
			}
		});
	}
	//记录操作图片的状态
	function pushImg() {
		data.pushImgTarget[vm.target]++;
		if(data.pushImgTarget[vm.target] < data.pushImgList[vm.target].length) {
			data.pushImgList[vm.target].length = data.pushImgTarget[vm.target];
		}
		setTimeout(function() {
			data.pushImgList[vm.target].push({
				type: "pen",
				src: document.getElementById('canvas').toDataURL('image/jpg')
			});
		}, 100);
	}
	//生成文字或者生成图片的时候需要记录在操作栈里面;
	function pushImgOrDiv(obj) {
		data.pushImgTarget[vm.target]++;
		data.pushImgList[vm.target].push(obj);
	}
	//回退到上一步
	function goBack() {
		if(data.pushImgTarget[vm.target] > 0) {
			let item = data.pushImgList[vm.target][data.pushImgTarget[vm.target]];
			if(item.type === "pen") {
				console.log("消除画笔");
				canvasClear();
			} else {
				data.canvasBlock.removeChild(document.getElementById(item.type + item.id));
				if(item.type === "img") {

					data.rightImgList[vm.target].splice(data.rightImgList[vm.target].length - 1, 1);
				} else {
					data.textList[vm.target].splice(data.textList[vm.target].length - 1, 1);
				}
			}
			data.pushImgList[vm.target].splice(data.pushImgTarget[vm.target], 1);
			data.pushImgTarget[vm.target]--;
			drawImgInCanvas(data.pushImgList[vm.target][data.pushImgTarget[vm.target]].src);
		}
	}

	//清空页面所有的文字
	function clearAllText() {
		let divList = data.canvasBlock.querySelectorAll(".divToText");
		if(divList.length > 0) {
			for(let i = 0; i < divList.length; i++) {
				data.canvasBlock.removeChild(document.getElementById(divList[i].id))
			}
		}
	}
	//清空页面所有的文字
	function clearAllTextList() {
		let divList = data.canvasBlock.querySelectorAll(".divToText");
		if(divList.length > 0) {
			for(let i = 0; i < divList.length; i++) {
				data.canvasBlock.removeChild(document.getElementById(divList[i].id))
			}
		}
	}
  // 清除所有对号（切换图片调用）
	function clearAllRight() {
		let rightlist = data.canvasBlock.querySelectorAll(".right");
		if(rightlist.length > 0) {
			for(let i = 0; i < rightlist.length; i++) {
				data.canvasBlock.removeChild(document.getElementById(rightlist[i].id))
			}
		}
	}
	//清空
	function clear() {
		data.pushImgList[vm.target] = [];
		data.pushImgTarget[vm.target] = -1;
		clearAllText();
		clearAllRight()
		data.textList[vm.target] = [];
		data.rightImgList[vm.target] = [];
		data.cxt.clearRect(0, 0, data.canvas.width, data.canvas.height); //先清掉画布上的内容
		draw('canvas')
	}

	//画板清除
	function canvasClear() {
		data.cxt.clearRect(0, 0, data.canvas.width, data.canvas.height); //先清掉画布上的内容
	}
  // 旋转
	function trunrot(degree) {
		if(data.pushImgList[vm.target].length < 2) {
			data.cxt.save()
			canvasClear();
			let canvasPic = new Image();
			canvasPic.src = vm.imgList[vm.target].correct_src_base64 ? vm.imgList[vm.target].correct_src_base64 : vm.imgList[vm.target].src_base64;
			canvasPic.onload = function() {
				let canvasHid = document.getElementById('canvas1');
				let convasHidctx = canvasHid.getContext('2d')
				canvasPic.crossOrigin = "anonymous";
				let imgHeight = canvasPic.height;
				let imgWidth = canvasPic.width;
				canvasHid.height = imgWidth;
				canvasHid.width = imgHeight;
				convasHidctx.translate(canvasHid.width / 2, canvasHid.height / 2); //将绘图原点移到画布中点
				convasHidctx.rotate((Math.PI / 180) * degree); //旋转角度
				convasHidctx.translate(-(canvasHid.height / 2), -(canvasHid.width / 2)); //将画布原点移动
				convasHidctx.drawImage(canvasPic, 0, 0, canvasHid.height, canvasHid.width);
				convasHidctx.restore();
				data.pushImgList[vm.target] = [];
				data.pushImgTarget[vm.target] = -1;
				//				console.log(canvasHid.toDataURL('image/jpg'));
				vm.getRotateImg(canvasHid.toDataURL('image/jpg'));
			};
		} else {
			alert("批改之后不能进行此操作")
		}
	}
	//旋转的方法
	function imgrotato(degree) {

	}
</script>
<style lang="scss" scoped>
	@import '../assets/scss/taskcorrect';
	.textCenter {
		text-align: center;
	}

	.por {
		border-radius: 8px;
	}

	.modal-footer> :not(:last-child) {
		margin-right: .85rem;
	}

	.bgGreen {
		background-color: #36b5af;
	}

	.bgWhite {
		background-color: white;
		color: #EEEEEE;
	}

	nav {
		width: 100%;
	}

	ul {
		width: 100%;
	}

	nav li {
		list-style-type: none;
		width: 60px;
		text-align: center;
		color: white;
		height: 48px;
		line-height: 48px;
	}

	nav li .air {
		position: absolute;
		top: 50%;
		margin-top: -9px;
		right: 10px;
		display: block;
		background: #ED8B8A;
		border-radius: 10px;
		padding: 1px 9px;
		color: white;
		font-size: 12px;
	}
</style>
<style>
	.inputBlock {
		position: absolute;
		width: 340px;
		min-height: 46px;
		background-color: rgba(0, 0, 0, .5);
		border: 1px dashed #FFFFFF;
	}

	.blockContent {
		position: relative;
	}

	.textInput {
		width: 100%;
		min-height: 44px;
		max-width: 340px;
		min-width: 340px;
		background-color: transparent;
		word-wrap: break-word;
		border: none;
		outline: none;
		caret-color: #36b5af;
		font-size: 14px;
		padding-left: 10px;
		color: #FFFFFF;
		padding: 10px;
	}

	.removeText {
		position: absolute;
		width: 25px;
		height: 25px;
		top: -13px;
		right: -13px;
	}

	.inputBlock ::-webkit-input-placeholder {
		/* WebKit browsers */
		color: #FFFFFF;
	}

	.inputBlock :-moz-placeholder {
		/* Mozilla Firefox 4 to 18 */
		color: #FFFFFF;
	}

	.inputBlock ::-moz-placeholder {
		/* Mozilla Firefox 19+ */
		color: #FFFFFF;
	}

	.inputBlock :-ms-input-placeholder {
		/* Internet Explorer 10+ */
		color: #FFFFFF;
	}

	.divToText {
		color: red;
		position: absolute;
		left: 40%;
		top: 5%;
    width: 476px;
		font-size: 30px;
		padding-left: 15px;
		word-wrap: break-word;
	}

	.right {
		width: 45px;
		height: 45px;
		position: absolute;
		cursor: pointer;
		background: url("../../static/images/newTask/right.png") no-repeat;
		background-size: 100% 100%;
	}

	.rightImg {
		width: 45px;
		height: 45px;
		margin: 7px;
		cursor: pointer
	}

  .divToText{
    transform-origin:left top;
    -webkit-transform-origin:left top;
    transform: scale(0.60);
    -webkit-transform: scale(0.60);
  }
</style>
