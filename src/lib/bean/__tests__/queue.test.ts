import Queue from "../queue";

describe("Queue structure", () => {
  let queue = new Queue<number>();

  test("isEmpty() when created", () => {
    expect(queue.isEmpty()).toBeTruthy();
  });

  test("dequeue() return undefined", () => {
    expect(queue.dequeue()).toBe(undefined);
  });

  test("peek() return undefined", () => {
    expect(queue.peek()).toBe(undefined);
  });

  test("enqueue() 100 and 200", () => {
    expect(queue.enqueue(100)).toBe(1);
    expect(queue.enqueue(200)).toBe(2);
    expect(queue.size()).toBe(2);
  });

  test("enqueue() with array", () => {
    expect(queue.enqueue([102, 103, 104, 105])).toBe(6);
    expect(queue.size()).toBe(6);
  });

  test("peek() should return 100", () => {
    expect(queue.peek()).toBe(100);
  });

  test("size should return 1", () => {
    expect(queue.peek()).toBe(100);
  });

  test("clear() should make empty queue", () => {
    queue.clear();
    expect(queue.isEmpty()).toBeTruthy();
  });
});
