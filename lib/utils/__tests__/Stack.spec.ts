import { expect } from "chai";
import { Stack } from "../Stack";

describe("Stack", () => {
  it("should throw when popping empty", () => {
    const stack = new Stack<number>();

    stack.push(1);

    expect(stack.pop()).to.be.eq(1);
    expect(() => stack.pop()).to.throw("Cannot pop empty stack");
  });

  it("should throw when pushing undefined", () => {
    const stack = new Stack<number>();

    expect(() => stack.push(undefined as any)).to.throw("Cannot push undefined/null on stack!");
  });
});
