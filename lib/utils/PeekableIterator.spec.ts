import { PeekableIterator } from "./PeekableIterator";
import { expect } from "chai";

describe("PeekableIterator", () => {
  it("should work", () => {
    const input = [1, 2];

    const iterator = new PeekableIterator(input);

    expect(iterator.peek()).to.be.eq(1);
    expect(iterator.peek()).to.be.eq(1);
    expect(iterator.hasNext()).to.be.true;

    iterator.next();

    expect(iterator.peek()).to.be.eq(2);
    expect(iterator.peek()).to.be.eq(2);
    expect(iterator.hasNext()).to.be.false;
  });

  it("throw when done", () => {
    const input: any[] = [];

    const iterator = new PeekableIterator(input);

    expect(() => iterator.peek()).to.throw("Index out of bounds.");
  });

  it("should take n", () => {
    const input = [1, 2, 3];

    const iterator = new PeekableIterator(input);

    expect(iterator.take(2)).to.be.deep.eq([1, 2]);
    expect(iterator.peek()).to.be.eq(3);
  });
});
