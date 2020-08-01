class Hierachy {
  /**
   * Tạo ra một Node mới - một Directory | File.
   *
   * @param {Object} parent Là object parent của object hiện tại. Ví dụ: ../
   * @param {String} name Tên của thư mục/File - Địa chỉ tuyệt đối của Directory | File
   * @param {Number} storage Dung lượng của Directory | File tính bằng Bytes
   * @param {String} type Kiểu: Directory | File
   */
  constructor(parent, name, storage, type) {
    this.parent = parent;
    this.name = name;
    this.storage = storage;
    this.type = type;
    this.child = [];

    this.timestamp = 1000;
  }

  addChild(child) {
    this.child.push(child);
  }

  addStorage(value) {
    if (this.parent) this.parent.addStorage(value);
    this.storage += value;
  }

  countDown() {
    let current = Date.now();
    const intervalID = setInterval(() => {
      let deltaTime = Date.now() - current;
      current = Date.now();
      this.timestamp -= deltaTime;

      if (this.timestamp < 0) {
        emitter.emit("1");
        clearInterval(intervalID);
      }
    }, 50);
  }

  resetTimeout() {
    this.timestamp = 1000;
  }
}

module.exports = Hierachy;
