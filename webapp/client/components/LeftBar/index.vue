<template>
  <div class="w-100 h-100 app-left-bar">
    <Partition
      v-for="(item, index) in partition"
      :key="index"
      :data-source="item"
    />
  </div>
</template>

<script>
import Partition from "@/components/LeftBar/Partition.vue";

export default {
  name: "LeftBar",
  components: {
    Partition,
  },
  props: {
    partition: Array,
  },
};
</script>

<style lang="less" scoped>
.app-left-bar {
  border-top: 1px solid red;
}
</style>
