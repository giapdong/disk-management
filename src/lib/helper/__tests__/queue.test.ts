import Queue from "../queue";

describe("Queue", () => {
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
    expect(queue.length()).toBe(2);
  });

  test("peek() should return 100", () => {
    expect(queue.peek()).toBe(100);
  });

  test("length should return 1", () => {
    expect(queue.peek()).toBe(100);
  });

  test("clear() should make empty queue", () => {
    queue.clear();
    expect(queue.isEmpty()).toBeTruthy();
  });
});
