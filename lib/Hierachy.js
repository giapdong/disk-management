module.exports = class Hierachy {
    /**
     * Tạo ra một Node mới - một Directory | File.
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
        this.child = []
    }

    addChild(child) {
        this.child.push(child);
    }
    addStorage(value) {
        this.storage += value;
        if (this.parent)
            this.parent.addStorage(value);
    }
}