export default class Stack<T> {
  private data: T[];

  constructor() {
    this.data = new Array<T>();
  }

  isEmpty() {
    return this.data.length == 0;
  }

  push(newItem: T): number;
  push(rangeValue: T[]): number;
  push(newItem: T | T[]): number {
    this.data = this.data.concat(newItem);
    return this.size();
  }

  pop(): T | undefined {
    return this.data.pop();
  }

  peek(): T | undefined {
    // For best performance
    // Ref: https://stackoverflow.com/questions/3216013/get-the-last-item-in-an-array
    return !this.isEmpty() ? this.data[this.data.length - 1] : undefined;
  }

  clear(): void {
    this.data = new Array<T>();
  }

  size(): number {
    return this.data.length;
  }
}
