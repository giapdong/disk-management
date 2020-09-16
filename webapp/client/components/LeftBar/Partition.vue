<template>
  <div class="app-partition ant-col p-1 w-100">
    <div class="ant-row">
      <a-icon class="mr-1" type="hdd" /><span class="text-bold"
        >Disk0 ({{ dataSource.name }})</span
      >
    </div>
    <div class="ant-row mt-1">
      {{ `${dataSource.usage}GB/${dataSource.total}GB` }}
    </div>
    <div class="app-process ant-row mt-1 h-100">
      <div :style="stylePartition" :class="colorPartition"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Partition",
  props: {
    dataSource: Object,
  },
  computed: {
    percent() {
      return (this.dataSource.usage / this.dataSource.total) * 100;
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
  },
  created() {
    console.log(this.dataSource);
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
