<template>
  <section class="ant-layout app">
    <header class="ant-layout-header">
      <div class="app-container-content">
        <div class="app-header-logo">
          <img src="/images/icon.svg" alt="Logo disk management" />
          <span class="ml-1">Disk management</span>
        </div>
        <div class="app-header-menu">
          <span class="ml-1">Disk management</span>
          <npmIcon />
          <a-icon class="ml-1" type="github" @click="gotoGithub" />
        </div>
      </div>
    </header>
    <main class="ant-layout-content p-1">
      <button class="ant-btn ant-btn-primary ml-1">Check button</button>
    </main>
    <footer class="ant-layout-footer">
      <div class="app-container-content">
        <span class="text-bold">©COPYRIGHT BY DevP Studio 2020</span>
      </div>
    </footer>
  </section>
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
.app {
  .ant-layout-header {
    top: 0px;
    z-index: 10;
    position: sticky;
    background: #2b3a42;

    .app-container-content {
      height: 100%;
      display: flex;
      color: white;
      flex-direction: row;
      background: #2b3a42;
      justify-content: space-between;

      .app-header-logo {
        height: 100%;
        display: flex;
        width: fit-content;
        flex-direction: row;

        img {
          height: 90%;
        }
      }

      .app-header-menu {
        width: fit-content;
      }
    }
  }

  .ant-layout-content {
    color: black;
    height: calc(100vh - 150px);
    background-color: white;
  }

  .ant-layout-footer {
    background-color: white;

    .app-container-content {
      border-top: 1px solid rgba(0, 0, 0, 0.3);
      display: flex;
      justify-content: center;
      background-color: white;
    }
  }
}
</style>
