<template>
  <div>
    <Button @click="showMap = true">选择地址</Button>
    <Drawer title="选择地址" :closable="false" v-model="showMap" width="100">
      <div>
        <Row>
          <Col span="4"> 搜索： </Col>
          <Col span="16">
            <Input
              prefix="ios-search"
              v-model="query"
              placeholder="输入要搜索的地址"
            />
          </Col>
          <Col span="4">
            <Button type="info" @click="search(true)">搜索</Button>
          </Col>
        </Row>
      </div>
      <div>地址：{{ this.address }}</div>
      <br />
      <div class="coord-picker">
        <div class="map-container">
          <amap
            cache-key="coord-picker-map"
            mmap-style="amap://styles/whitesmoke"
            async
            :center.sync="center"
            :zoom.sync="zoom"
            is-hotspot
            @click="onMapClick"
            ref="myMap"
          >
            <amap-satellite-layer :visible="satellite" />
            <amap-marker v-if="position" :position.sync="position" draggable />
          </amap>
        </div>
      </div>
      <List header="搜索详情">
        <ListItem v-for="item in results" :key="item.id">
          <Row>
            <Col span="24">
              <h3 @click="focus(item)">
                <a href="javascript:">{{ item.name }}</a>
              </h3>
            </Col>
            <Col span="24">
              <span>{{ item.address }}</span>
            </Col>
          </Row>
        </ListItem>
      </List>
      <div style="margin-top: 50px"></div>
      <div class="demo-drawer-footer">
        <Button style="margin-right: 8px" @click="showMap = false">取消</Button>
        <Button type="primary" @click="emitData">确认提交</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { loadAmap, loadPlugins } from "@amap/amap-vue";

export default {
  name: "mymap",
  data() {
    return {
      mode: "search",
      center: null,
      zoom: 13,
      query: "",
      searching: false,
      tips: [],
      results: [],
      position: null,
      address: "",
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      satellite: false,
      showMap: false,
    };
  },
  props: {
    positionData: {
      type: Array,
      default: null,
    },
  },
  computed: {
    wrapper() {
      return this.$refs.wrapper;
    },
    positionText() {
      if (!this.position) return "";
      return `${this.position[0]}, ${this.position[1]}`;
    },
  },

  created() {
    this.$ready = new Promise(async (resolve) => {
      const AMap = await loadAmap();
      await loadPlugins([
        "AMap.PlaceSearch",
        "AMap.AutoComplete",
        "AMap.Geocoder",
      ]);

      this.ps = new AMap.PlaceSearch({
        pageSize: this.pageSize,
      });
      this.ac = new AMap.AutoComplete();
      this.go = new AMap.Geocoder({
        radius: 1000,
        extensions: "all",
      });
      resolve();
    });
  },
  methods: {
    onMapClick(e) {
      if (e.lnglat) {
        this.position = [e.lnglat.lng, e.lnglat.lat];
        this.getAddresss();
      } else {
        this.position = null;
      }
    },
    getAddresss() {
      this.go.getAddress(this.position, (status, result) => {
        console.log(result);
        this.address = result.regeocode.formattedAddress;
      });
    },
    async search(clear = false) {
      this.mode = "result";
      await this._ready;

      if (clear) {
        this.results = [];
        this.total = 0;
        this.pageIndex = 1;
        this.ps.setPageIndex(1);
      }

      this.searching = true;
      const { query } = this;
      this.ps.search(query, (status, result) => {
        this.searching = false;
        if (query !== this.query) return;

        if (status === "complete" && result.poiList) {
          this.results = result.poiList.pois;
          this.total = result.poiList.count;
        } else {
          this.results = [];
          this.total = 0;
        }
      });
    },
    async autoComplete(kw) {
      if (!kw) {
        this.tips = [];
      } else {
        this.ac.search(kw, (status, result) => {
          if (kw !== this.query) return;
          if (status === "complete" && result.tips) {
            this.tips = Array.from(new Set(result.tips.map((tip) => tip.name)));
          } else {
            this.tips = [];
          }
        });
      }
    },
    focus(poi) {
      const pos = [poi.location.lng, poi.location.lat];
      this.position = [...pos];
      this.center = [...pos];
      this.getAddresss();
    },
    reset() {
      this.ps.setPageIndex(1);
      this.results = [];
      this.tips = [];
      this.total = 0;
      this.mode = "search";
    },
    emitData() {
      if (!this.address) {
        this.$Message.error("请选择地址后确定");
        return false;
      }
      const params = {
        position: this.position,
        address: this.address,
      };
      this.$emit("getAddress", params);
      this.showMap = false;
    },
  },
  watch: {
    pageIndex(value) {
      this.$ready.then(() => {
        this.ps.setPageIndex(value);
        this.search(false);
      });
    },
    positionData(val, old) {
      this.position = val;
      this.center = val;
    },
  },
};
</script>

<style lang="less" scoped>
.map-container {
  width: 100%;
  height: 50vh;
}

.result-panel {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 320px;
  display: flex;
  flex-direction: column;

  .search-bar {
    display: flex;
    align-items: center;
    .text {
      text-overflow: ellipsis;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .result-list.ant-list-loading {
    min-height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.info {
  position: absolute;
  right: 10px;
  top: 10px;
  padding-left: 24px;
}
.demo-drawer-footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>