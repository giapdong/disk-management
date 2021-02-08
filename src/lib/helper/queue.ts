export default class Queue<T> {
  private data: T[];

  constructor() {
    this.data = new Array<T>();
  }

  isEmpty() {
    return this.data.length == 0;
  }

  enqueue(newItem: T): number {
    return this.data.push(newItem);
  }

  dequeue(): T | undefined {
    return this.data.shift();
  }

  peek(): T | undefined {
    return !this.isEmpty() ? this.data[0] : undefined;
  }

  clear(): void {
    this.data = new Array<T>();
  }

  length(): number {
    return this.data.length;
  }
}
