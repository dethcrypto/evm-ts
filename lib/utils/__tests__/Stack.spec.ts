import { expect } from "chai";
import { Stack } from "../Stack";

describe("Stack", () => {
  it("should throw when popping empty", () => {
    const stack = new Stack<number>();

    stack.push(1);

    expect(stack.pop()).to.be.eq(1);
    expect(() => stack.pop()).to.throw("Cannot pop empty stack");
  });
});
