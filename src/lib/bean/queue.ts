export default class Queue<T> {
  private data: T[];

  constructor() {
    this.data = new Array<T>();
  }

  isEmpty() {
    return this.data.length == 0;
  }

  enqueue(newItem: T): number;
  enqueue(newRange: T[]): number;
  enqueue(newItem: T | T[]): number {
    this.data = this.data.concat(newItem);
    return this.size();
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

  size(): number {
    return this.data.length;
  }
}
