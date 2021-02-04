const EventType = require("./const").EventType;

class Hierachy {
  /**
   * Create new Node - a Directory | File.
   *
   * @param {Object} parent Object instance of Hierachy or null - parent of this node e.g: ../
   * @param {String} name Name of Directory | File - absolute path
   * @param {Number} storage Size of File | Directory (Bytes)
   * @param {String} type Type: Directory | File
   */
  constructor(parent, name, storage, type) {
    this.parent = parent;
    this.name = name;
    this.storage = storage;
    this.type = type;
    this.child = [];
  }

  /**
   * Increment value storage with value is size of child item
   *
   * @param {Number} value Value of child item
   */
  addStorage(value) {
    this.storage += value;
    if (this.parent) this.parent.addStorage(value);
  }
}

/**
 * Return Proxy object to make mechanism notification Scan Big directory finish
 *
 * @param {Object} object Origin object wanna use Proxy to modify
 */
function SafeDirectory(object) {
  object.timestamp = object.maxTimestamp = 1000;

  const intervalID = setInterval(() => {
    object.timestamp -= 10;

    if (object.timestamp < 0) {
      emitter.emit(EventType.FilterBigDirectoryFinish);
      clearInterval(intervalID);
    }
  }, 50);

  return new Proxy(object, {
    get(obj, key) {
      return obj[key];
    },
    set(obj, key, value) {
      obj[key] = value;
      obj.timestamp = obj.maxTimestamp;
    },
  });
}

module.exports = { Hierachy, SafeDirectory };