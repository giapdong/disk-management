import Stack from "../stack";

describe("Stack struture", () => {
  let stack = new Stack<number>();

  test("isEmpty() when created", () => {
    expect(stack.isEmpty()).toBeTruthy();
  });

  test("pop() should return undefined", () => {
    expect(stack.pop()).toBe(undefined);
  });

  test("push() should return new size of stack", () => {
    stack.push(1);
    stack.push(2);
    stack.push(20);

    expect(stack.size()).toBe(3);
    expect(stack.isEmpty()).toBeFalsy();
    expect(stack.peek()).toBe(20);
  });

  test("push() witn array", () => {
    expect(stack.push([102, 103, 106, 107])).toBe(7);
    expect(stack.size()).toBe(7);
  });

  test("pop() should return last element", () => {
    expect(stack.pop()).toBe(107);
    expect(stack.size()).toBe(6);
    expect(stack.peek()).toBe(106);
  });

  test("peek() should return 2", () => {
    expect(stack.peek()).toBe(106);
  });

  test("size() should return 2", () => {
    expect(stack.size()).toBe(6);
  });

  test("clear() should empty stack", () => {
    stack.clear();
    expect(stack.isEmpty()).toBeTruthy();
    expect(stack.size()).toBe(0);
    expect(stack.peek()).toBe(undefined);
  });
});
