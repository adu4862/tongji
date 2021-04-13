<template>
  <div class="box-tongji"
       v-loading="isMapLoading"
       element-loading-text="数据加载中..."
       element-loading-spinner="el-icon-loading">
    <div class="screen">
      <div class="screen-left">
        <!-- <el-select class="screen-city" v-model="value" placeholder="请选择区级">
          <el-option v-for="item in options" :key="item" :label="item" :value="item"></el-option>
        </el-select> -->
        <el-date-picker

          v-model="selectedDate"
          type="month"
          align="right"
          clear-icon
          :placeholder="datePlaceholder()"
        >
          <span>{{ selectedDate }}</span>
        </el-date-picker>
      </div>

      <div class="screen-right">
        <el-select class="screen-city" v-model="valueTwo" placeholder="请选择">
          <el-option v-for="item in optionsTwo" :key="item" :label="item" :value="item"></el-option>
        </el-select>

        <el-select class="screen-city" v-model="valueThree" placeholder="请选择类型">
          <el-option v-for="item in optionsThree" :key="item" :label="item" :value="item"></el-option>
        </el-select>
      </div>
    </div>

    <div class="echarts-box">
      <div ref="mychart" class="city"></div>
      <div ref="mychartDistrict" class="district"></div>
    </div>
  </div>
</template>

<script>
  import {getStatisticsChange} from '../api/statistical'
  import echarts from 'echarts';

  export default {
    name: 'tongji-architecture',
    data() {
      return {
        jurisdictions:{
          time:[],
          new:[],
          newNull:[],
          dismantle:[],
          dismantleNull:[],
        },
        below:{
          toponymy:[],
          new:[],
          newNull:[],
          dismantle:[],
          dismantleNull:[],
        },
        requiredParameter:{
          url: '/count',
          data:{
            dateStr:'',
            liangweiType: 2
          }
        },
        interfaceSwitch:{
          sum:'/count',
          area:'/areaCovered'
        },
        isMapLoading: false,
        options: ['灵川县'],
        optionsThree: ['全部', '新增', '拆除'],
        optionsTwo: ['数量/宗', '面积/㎡'],
        selectedDate: '',
        value: '灵川县',
        valueTwo: '数量/宗',
        valueThree: '全部',
        lineChart: null,
        countyChart: null,
        quName: []
      }
    },
    watch: {
      value() {
        this.mychartDistrict()
      },
      valueTwo(value) {
        debugger
        value === '数量/宗'? this.requiredParameter.url = this.interfaceSwitch.sum : this.requiredParameter.url = this.interfaceSwitch.area
        // if(value ==='')
        this.req()
        // this.drawLine();
        // this.mychartDistrict();
      },
      valueThree() {
        this.drawLine()
        this.mychartDistrict()
      },
      selectedDate() {
        if (!this.selectedDate) {
          console.log(this.selectedDate)
          return;
        }

        // this.isMapLoading = true;
        let d = new Date(this.selectedDate)
        let datetime
        d.getMonth() + 1 < 10 ? datetime = d.getFullYear() + '-0' + (d.getMonth() + 1) : datetime =  d.getFullYear() + '-' + (d.getMonth() + 1)
        // let datetime = d.getFullYear() + '-' + (d.getMonth() + 1)
        // debugger
        // let time = datetime < 10 ? '0' + datetime : datetime
        debugger
        this.requiredParameter.data.dateStr = datetime
        // let time = datetime < 10 ? '0' + datetime : datetime

        this.req()

      },


    },
    methods: {
      //初始化显示本月时间
      datePlaceholder() {
        let date = new Date;
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        month = (month < 10 ? "0" + month : month);
        let mydate = (year.toString() + '-' + month.toString());
        return mydate
      },
      // 全部数据的表格
      drawLine() {

        if (!this.lineChart) {
          this.lineChart = echarts.init(this.$refs.mychart);
        }
        this.lineChart.setOption({
          title: {
            text: this.valueTwo
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['新增', '拆除'],
            selectedMode: false
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.jurisdictions.time,
            // splitLine:{show: false},
          },
          yAxis: {
            type: 'value',
            // splitLine:{show: false},

          },
          series: [
            {
              name: '新增',
              type: 'line',
              // stack: '总量',
              // data: this.jurisdictions.new, this.valueThree === '全部' || this.valueThree === '新增' ? this.jurisdictions.new :this.jurisdictions.newNull
              data: this.valueThree === '全部' || this.valueThree === '新增' ? this.jurisdictions.new :this.jurisdictions.newNull,
              itemStyle: {
                normal: {
                  color: "#FF9094",//折线点的颜色
                  lineStyle: {
                    color: "#FF9094"//折线的颜色
                  }
                }
              },
              // areaStyle: {normal: {}},
            },
            {
              name: '拆除',
              type: 'line',
              // stack: '总量',
              data: this.valueThree === '全部' || this.valueThree === '拆除' ? this.jurisdictions.dismantle :this.jurisdictions.dismantleNull,
              itemStyle: {
                normal: {
                  color: "#3FB2FF",//折线点的颜色
                  lineStyle: {
                    color: "#3FB2FF"//折线的颜色
                  }
                }
              },

            },

          ]
        });

      },
      //区级数据的表格
      mychartDistrict() {

        if (!this.countyChart) {
          this.countyChart = echarts.init(this.$refs.mychartDistrict);
        }

        this.countyChart.setOption({
          title: {
            text: this.valueTwo
          },
          legend: {
            data: ['新增', '拆除'],
            selectedMode: false
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: this.below.toponymy,
            // splitLine:{show: false},
          },

          yAxis: {
            type: 'value',
            // splitLine:{show: false},
          },
          series: [
            {
              name: '新增',
              data: this.valueThree === '全部' || this.valueThree === '新增' ? this.below.new :this.below.newNull,
              type: 'bar',
              itemStyle: {
                normal: {
                  color: "#FF9094",//折线点的颜色
                  lineStyle: {
                    color: "#FF9094"//折线的颜色
                  }
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
            },
            {
              name: '拆除',
              data: this.valueThree === '全部' || this.valueThree === '新增' ? this.below.dismantle :this.below.dismantleNull,
              type: 'bar',
              itemStyle: {
                normal: {
                  color: "#3FB2FF",//折线点的颜色
                  lineStyle: {
                    color: "#3FB2FF"//折线的颜色
                  }
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
            }
          ]
        })
      },
      getDataLIst() {
        let  date = new Date();
        let year = date .getFullYear() + ''
        let month = date .getMonth() + 1
        let time = year + '-' + (month < 10 ? '0' + month : month)
        this.requiredParameter.data.dateStr = time
        this.req()
      },
      req() {

        let self = this
        self.isMapLoading = true
        self.requiredParameter
        debugger
        self.jurisdictions.time = []
        self.jurisdictions.new = []
        self.jurisdictions.dismantle = []
        self.below.toponymy = []
        self.below.new = []
        self.below.dismantle= []
        getStatisticsChange(self.requiredParameter).then((res) => {
          let {dateStatistics, districtStatistics} = res.data

          for(let i = 0; i < dateStatistics.length; i++) {
            self.jurisdictions.time.push(dateStatistics[i].title)
            let avalue = dateStatistics[i].avalue
            let bvalue = dateStatistics[i].bvalue

            if(self.valueTwo === '数量/宗') {

              self.jurisdictions.new.push(avalue)
              self.jurisdictions.dismantle.push(bvalue)

            }else {
              self.jurisdictions.new.push(Number(avalue).toFixed(2))
              self.jurisdictions.dismantle.push(Number(bvalue).toFixed(2))
            }

          }

          for(let j = 1; j < districtStatistics.length; j++) {
            self.below.toponymy.push(districtStatistics[j].title)
            let avalue = districtStatistics[j].avalue
            let bvalue = districtStatistics[j].bvalue

            if(self.valueTwo === '数量/宗') {
              self.below.new.push(avalue)
              self.below.dismantle.push(bvalue)
            }else {
              self.below.new.push(Number(avalue).toFixed(2))
              self.below.dismantle.push(Number(bvalue).toFixed(2))
            }

          }

          self.drawLine()
          self.mychartDistrict()
          self.isMapLoading = false

        });
      }

    },
    created() {
    },
    mounted() {
      this.getDataLIst()
    },
  }

</script>

<style scoped>
  .box-tongji {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 10px;
    top: 10px;
  }
  .echarts-box {
    position: absolute;
    top: 65px;
    left: 0px;
    right: 10px;
    bottom: 0;
    z-index: 999;
  }
  .city {
    height: calc(50vh - 70px);
  }
  .district {
    height: calc(50vh - 70px);
  }

  .loading {
    position: fixed;
    z-index: 1000;
    background-color: #fff;
    left: 110px;
    right: 0;
    top: 65px;
    bottom: 0;
  }
  .prompt {
    text-align: center;
    color: #0090ff;
  }
  .screen {
    top: 0px;
    position: absolute;
    left: 0px;
    right: 0;
    height: 60px;
    background-color: #fff;
    box-shadow: 0px 4px 6px 0px rgba(6, 6, 6, 0.1);
    border-radius: 10px;
    padding: 11px 20px 0 20px;
    box-sizing: border-box;
    z-index: 999;
  }
  .screen /deep/ .el-input__inner {
    background: rgba(242, 245, 248, 1);
    border: none;
    color: #000;
  }

  .screen /deep/ input::placeholder {
    color: #000;
    font-weight: 500;
  }
  .screen-left {
    float: left;
  }
  .screen-left > div {
    margin-right: 10px;
  }
  .screen-right {
    float: right;
  }
  .screen-right > div {
    margin-left: 10px;
  }
</style>
