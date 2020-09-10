<template>
  <div class="dm">
    <section class="ant-layout">
      <header class="ant-layout-header">
        <div class="dm-body-content">
          <div class="dm-header-logo">
            <img src="/images/icon.svg" alt="Logo disk management" />
            <span class="ml-1">Disk management</span>
          </div>
          <div class="dm-header-menu">
            <span class="ml-1">Disk management</span>
            <npmIcon />
            <a-icon class="ml-1" type="github" @click="gotoGithub" />
          </div>
        </div>
      </header>
      <main class="ant-layout-content">
        <button class="ant-btn ant-btn-primary ml-1">Button</button>
      </main>
      <footer class="ant-layout-footer">
        ©COPYRIGHT BY DevP Studio 2020
      </footer>
    </section>
  </div>
</template>

<script>
import npmIcon from "../components/npmIcon.vue";

export default {
  name: "dashboard",
  components: {
    npmIcon,
  },
  created() {
    const data = [1, 2, 3, 4];
    const find = _.filter(data, (item) => item >= 3);
    console.log(find);
  },
  methods: {
    gotoGithub() {
      window.open("https://github.com/giapdong/disk-management");
    },
  },
};
</script>

<style lang="less" scoped>
.dm {
  .ant-layout-header {
    top: 0px;
    z-index: 10;
    position: sticky;

    .dm-body-content {
      height: 100%;
      display: flex;
      color: white;
      flex-direction: row;
      background: #2b3a42;
      justify-content: space-between;

      .dm-header-logo {
        height: 100%;
        display: flex;
        width: fit-content;
        flex-direction: row;

        img {
          height: 90%;
        }
      }

      .dm-header-menu {
        width: fit-content;
      }
    }
  }

  .ant-layout-content {
    color: black;
    height: 1000px;
    min-height: 120px;
    line-height: 120px;
    background-color: white;
  }

  .ant-layout-footer {
    border-top: 1px solid rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    background-color: white;
  }
}
</style>
