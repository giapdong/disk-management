export default class Stack<T> {
  private data: T[];

  constructor() {
    this.data = new Array<T>();
  }

  isEmpty() {
    return this.data.length == 0;
  }

  push(newItem: T): number {
    return this.data.push(newItem);
  }

  pop(): T | undefined {
    return this.data.pop();
  }

  peek(): T | undefined {
    return !this.isEmpty() ? this.data[this.data.length - 1] : undefined;
  }

  clear(): void {
    this.data = new Array<T>();
  }

  size(): number {
    return this.data.length;
  }
}
