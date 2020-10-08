<template>
  <div class="app-partition ant-col p-1 w-100" @click="onSelectDisk">
    <div class="ant-row">
      <a-icon class="mr-1" type="hdd" /><span class="text-bold"
        >Disk{{ index }} {{ dataSource.deviceid }}</span
      >
    </div>
    <div class="ant-row mt-1">
      {{ `${usage}GB/${total}GB` }}
    </div>
    <div class="app-process ant-row mt-1 h-100">
      <div :style="stylePartition" :class="colorPartition"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "Partition",
  props: {
    dataSource: Object,
    index: Number,
  },
  computed: {
    percent() {
      return (1 - this.dataSource.freespace / this.dataSource.size) * 100;
    },
    stylePartition() {
      return {
        width: this.percent + "%",
      };
    },
    colorPartition() {
      return this.percent > 90
        ? "bg-danger"
        : this.percent > 70
        ? "bg-warning"
        : "bg-success";
    },
    usage() {
      let used = this.dataSource.size - this.dataSource.freespace;
      return this._.round(used / 1024 ** 3, 2);
    },
    total() {
      return this._.round(this.dataSource.size / 1024 ** 3, 2);
    },
  },
  methods: {
    ...mapActions({
      selectDisk: "selectDisk",
    }),
    onSelectDisk() {
      this.selectDisk(this.dataSource.deviceid);
    },
  },
};
</script>

<style lang="less" scoped>
.app-partition {
  cursor: pointer;
  border: 1px solid rgba(192, 192, 192, 0.3);

  .app-process {
    height: 20px;
    background-color: rgb(232, 244, 254);

    div {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
