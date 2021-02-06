<template>
  <div
    class="app-partition ant-col p-1 w-100"
    @click="onSelectDisk"
    :style="border"
  >
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
    ...mapState({
      partitionSelected: (state) => state.partitionSelected,
    }),
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
    border() {
      return this.partitionSelected == this.dataSource.deviceid
        ? { border: "2px solid #4410c7" }
        : { border: "1px solid #bfc0c0" };
    },
  },
  methods: {
    ...mapActions({
      selectDisk: "selectDisk",
    }),
    onSelectDisk() {
      this.selectDisk(
        this.partitionSelected == this.dataSource.deviceid
          ? null
          : this.dataSource.deviceid
      );
    },
  },
};
</script>

<style lang="less" scoped>
.app-partition {
  cursor: pointer;

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
